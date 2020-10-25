import React from 'react';
import './Matches.css';
import {browserHistory} from 'react-router';

class Matches extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userId: 5,
            // userId set to 5 for testing purposes
            potentialUserId: [],
            matchesExist: "not set"
        }
    }
    componentDidMount() {
        console.log("mounted");
        const myRequest = new Request('http://127.0.0.1:5000/matches', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({"userId": this.state.userId}),
            });

        fetch(myRequest)
            .then(response => response.json())
            .then(res => 
                (res.potentialUserIds.length != 0) ?
                    this.setState({
                        matchesExist: "exists", 
                        potentialUserId: res.potentialUserIds
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

    render(){
        let matchingSection;
        if (this.state.matchesExist == "exists"){
            let userItems = [];
            for (var i = 0; i < this.state.potentialUserId.length; i++){
                var pos_user = this.state.potentialUserId[i];
                userItems.push(
                    <tr className='pos-user' key={pos_user}>
                        {pos_user}
                    </tr>
                )
            }
            matchingSection = 
                <div>
                    <td id='Matches-congrats'>
                        Congratulations, these people want to be your friend!
                    </td>
                    {userItems}
                </div>
        }
        else if (this.state.matchesExist == "not exists") {
            matchingSection = <h2 id='Matches-none'>
                Sorry, No one wants to be your friend for now. Please try again later :(
            </h2>
        }
        else {
            matchingSection = <h2></h2>
        }
        return(
            <div id='Matches-section'>
                <h2 id='Matches-header'>Matches</h2>
                <div id='Matches-section'>
                    {matchingSection}
                </div>
            </div>
        )
    }

}

export default Matches