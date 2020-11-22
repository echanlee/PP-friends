import React from 'react';
import './Matches.css';
import {withRouter, Link} from 'react-router-dom'
import {getCookie} from '../cookies';

class Matches extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userId: getCookie("userId"),
            userIds: [],
            matchesExist: "not set",
            firstnames: [],
            name: "",
            userIds: [],
            notMessagedUserIds: [],
            notMessagedUserNames: [],
            messagedUserIds: [],
            messagedUserNames: [],
            messageIds: [],
            messageSender: [],
            messageContent: [],
            timeStamp: [],
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
                        name: res.currentName,
                        matchesExist: "exists", 
                        userIds: res.userIds,
                        notMessagedUserIds: res.notMessagedUserIds,
                        notMessagedUserNames: res.notMessagedUserNames,
                        messagedUserIds: res.messagedUserIds,
                        messagedUserNames: res.messagedUserNames,
                        messageIds: res.messageIds,
                        messageSender: res.messageSender,
                        messageContent: res.messageContent,
                        timeStamp: res.timeStamp,
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
        if(this.state.userId === "") {
            this.props.history.push({
              pathname: "/login",
            });
            return null;
        }

        let matchingSection;
        if (this.state.matchesExist == "exists"){
            let messagedUserItems = [];
            let notMessagedUserItems = [];
            if (this.state.messagedUserIds && this.state.messagedUserIds.length > 0){
                for (var i = 0; i < this.state.messagedUserIds.length; i++){
                    var pos_user = this.state.messagedUserIds[i];
                    let messageSenderName;
                    if (this.state.messageSender[i] == this.userId){
                        messageSenderName = this.state.currentName;
                    }
                    else {
                        messageSenderName = this.state.messagedUserNames[i]
                    }
                    messagedUserItems.push(
                        <div>
                            {/* <Link to={{pathname: '/viewfriendprofile', state: {id: this.state.userId, friendId: this.state.messagedUserIds[i]}}}>{this.state.messagedUserNames[i]}</Link> */}
                            <button className='pos-user' 
                                    key={pos_user}
                                    value = {this.state.messagedUserIds[i]+"|"+this.state.messagedUserNames[i]} 
                                    onClick = {this.selectUser}>

                                {messageSenderName}: {this.state.messageContent[i]}
                                timestamp: {this.state.timeStamp[i]}
                            </button>  
                        </div>
                    )
                }
            }
            if (this.state.notMessagedUserIds && this.state.notMessagedUserIds.length > 0){
                for (var i = 0; i < this.state.notMessagedUserIds.length; i++){
                    var pos_user = this.state.notMessagedUserIds[i];
                    notMessagedUserItems.push(
                        <button className='pos-user' 
                                key={pos_user} 
                                value = {this.state.notMessagedUserIds[i]+"|"+this.state.notMessagedUserNames[i]} 
                                onClick = {this.selectUser}>
                            {this.state.notMessagedUserNames[i]}
                        </button>  
                    )
                }
            }
            if (this.state.messagedUserIds != [] && this.state.notMessagedUserIds.length != []){
                matchingSection =  <h3 id='Matches-congrats'>
                        <p>Congratulations, </p>
                        <p>you have a match!</p> 
                        <p>Messaged Users</p>
                        <p>    
                            {messagedUserItems}
                        </p>
                        <p>Not Messaged Users</p>
                        <p> 
                            {notMessagedUserItems}
                        </p>
                        </h3>
            }
            else if (messagedUserItems.length > 0) {
                matchingSection =  <h3 id='Matches-congrats'>
                        <p>Congratulations,</p>
                        <p>you have a match!</p> 
                        <p>Messaged Users</p>
                        <p>    
                            {messagedUserItems}
                        </p>
                        </h3>
            }
            else if (notMessagedUserItems.length > 0) {
                matchingSection =  <h3 id='Matches-congrats'>
                        <p>Congratulations,</p>
                        <p>you have a match!</p> 
                        <p>Not Messaged Users</p>
                        <p> 
                            {notMessagedUserItems}
                        </p>
                        </h3>
            }
        }
        else if (this.state.matchesExist == "not exists") {
            matchingSection = <h2 id='Matches-none'>
                <p>Sorry, no one met the matching criteria you set.</p> 
                <p>We suggest you to edit your profile, or wait for more users to join our community.</p> 
                <p>Please try again later :(</p>
            </h2>
        }
        else {
            matchingSection = <h2></h2>
        }
        return(
            <div id='Matches-section'>
                 {matchingSection}                        

                <div class = "swipingButton" id = 'swipingButton'>
                    <Link to={{pathname: '/main'}}>Keep Swiping</Link>
                </div>
                <div class = "viewProfileButton" id = 'viewProfileButton'>
                    <Link to={{pathname: '/viewprofile'}}>View Profile</Link>
                </div>
            </div>
        )
    }

}

export default withRouter(Matches)