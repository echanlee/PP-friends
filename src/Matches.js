import React from 'react';
import './Matches.css';
import {withRouter, Link} from 'react-router-dom'

class Matches extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userId: this.props?.location?.state?.id,
            userIds: [],
            matchesExist: "not set",
            firstnames: [],
            name: "",
        }
        this.selectUser = this.selectUser.bind(this);
    }
    selectUser(event) {
        const userSelected = event.target.value.split("|");
        const myRequest = new Request('http://127.0.0.1:5000/conversationId', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "userId": this.state.userId,
                "friendId": userSelected[0],
            }),});
        fetch(myRequest)
            .then(response => response.json())
            .then(res => {
                this.props
                .history.push({
                  pathname: "/messages",
                  state: {
                      id: this.state.userId,
                      friendId: userSelected[0],
                      currentName: this.state.name,
                      friendName: userSelected[1],
                      currentConvoId: res.currentConvoId,
                      friendConvoId: res.friendConvoId
                }});
            })
        .catch((error) => {
            alert("Something went wrong");
            console.error(error)
        });
    }

    get_matches(){
        const myRequest = new Request('http://127.0.0.1:5000/matches', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({"userId": this.state.userId}),
            });
        fetch(myRequest)
            .then(response => response.json())
            .then(res => 
                (res.userIds && res.userIds.length != 0) ?
                    this.setState({
                        matchesExist: "exists", 
                        userIds: res.userIds,
                        firstnames: res.firstnames,
                        name: res.currentName
                    })
                    :
                    this.setState({
                        matchesExist: "not exists"
                    })
            )
            .catch((error) => {
                console.error(error)
            })
    }
    componentDidMount() {
        this.get_matches()
    }
    componentDidUpdate(prevProps, prevState){
        for (var i = 0; i < this.state.userIds.length; ++i){
            if (this.state.userIds[i] != prevState.userIds[i]) {
                this.get_matches()
                break;
            }
        }
        
    }


    render(){
        let matchingSection;
        if (this.state.matchesExist == "exists"){
            let userItems = [];
            for (var i = 0; i < this.state.userIds.length; i++){
                var pos_user = this.state.userIds[i];
                userItems.push(
                    <button className='pos-user' key={pos_user} value = {this.state.userIds[i]+"|"+this.state.firstnames[i]} onClick = {this.selectUser}>
                        {this.state.firstnames[i]}
                    </button>
                )
            }
            matchingSection = <h3 id='Matches-congrats'>
                Congratulations, these people want to be your friend!
                <p>
                    {userItems}
                </p>
                </h3>
        }
        else if (this.state.matchesExist == "not exists") {
            matchingSection = <h2 id='Matches-none'>
                Sorry, no one met the matching criteria you set. 
                We suggest you to edit your profile 
                Please try again later :(
            </h2>
        }
        else {
            matchingSection = <h2></h2>
        }
        return(
            <div id='Matches-section'>
                <h2 id='Matches-header'>Your Matches</h2>
                <Link to={{pathname: '/main', state: {id: this.state.userId}}}>Back to Swiping!</Link>
                <div id='Matches-section'>
                    {matchingSection}
                </div>
            </div>
        )
    }

}

export default withRouter(Matches)