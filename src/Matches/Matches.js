import React from "react";
import "./Matches.css";
import { withRouter, Link } from "react-router-dom";
import { getCookie } from "../cookies";
import Header from "../Header/Header";


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
        this.unmatchUser = this.unmatchUser.bind(this);
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
    unmatchUser(event) {
        const userSelected = event.target.value.split("|");
        const myRequest = new Request('http://127.0.0.1:5000/unmatch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "userId": this.state.userId,
                "friendId": userSelected[0],
            }),
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
    this.get_matches();
  }
  componentDidUpdate(prevProps, prevState) {
    for (var i = 0; i < this.state.userIds.length; ++i) {
      if (this.state.userIds[i] != prevState.userIds[i]) {
        this.get_matches();
        break;
      }
    }
  }
  get_button_colour(i){
    let buttonColour
    if (i%2 == 0){
        buttonColour = "blue"
    }
    else {
        buttonColour = "yellow"
    }
    return buttonColour
  }
  render() {
    if (this.state.userId === "") {
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
                        <div className = "MessagedUsers">
                            <p1>{messageSenderName} | </p1>
                            <Link to={{pathname: '/viewfriendprofile', state: {id: this.state.userId, friendId: this.state.messagedUserIds[i], currentName: this.state.name}}}>View Profile | </Link>                            <button className='unmatch-button'
                              key={pos_user+"match"}
                              value = {this.state.messagedUserIds[i]+"|"+this.state.messagedUserIds[i]}
                              onClick = {(e) => { if (window.confirm('Are you sure you wish to unmatch with this user? You cannot undo this action')) this.unmatchUser(e) } }
                            >
                              Unmatch
                            </button>      
                            <button className={[this.get_button_colour(i), 'pos-user'].join(' ')}
                              key={pos_user}
                              value = {this.state.messagedUserIds[i]+"|"+this.state.messagedUserNames[i]} 
                              onClick = {this.selectUser}>
                              Message {messageSenderName}
                            </button>  
                            <i>{messageSenderName}: {this.state.messageContent[i]} </i>
                            <br></br>
                            <i>{this.state.timeStamp[i]}
                            </i>
                            <br></br>
                            <br></br>
                        </div>
                    )
                }
            }
            if (this.state.notMessagedUserIds && this.state.notMessagedUserIds.length > 0){
                for (var i = 0; i < this.state.notMessagedUserIds.length; i++){
                    var pos_user = this.state.notMessagedUserIds[i];
                    notMessagedUserItems.push(
                        <div>
                            <p1>{this.state.notMessagedUserNames} | </p1>
                            <Link to={{pathname: '/viewfriendprofile', state: {id: this.state.userId, friendId: this.state.notMessagedUserIds[i], currentName: this.state.name}}}>View Profile | </Link>
                            <button className='unmatch-button'
                              key={pos_user+"match"}
                              value = {this.state.notMessagedUserIds[i]+"|"+this.state.notMessagedUserNames[i]}
                              onClick = {(e) => { if (window.confirm('Are you sure you wish to unmatch with this user? You cannot undo this action')) this.unmatchUser(e) } }
                            >
                              Unmatch
                            </button>      
                            <button className={[this.get_button_colour(i), 'pos-user'].join(' ')}
                              key={pos_user} 
                              value = {this.state.notMessagedUserIds[i]+"|"+this.state.notMessagedUserNames[i]} 
                              onClick = {this.selectUser}>
                              Message {this.state.notMessagedUserNames[i]}
                            </button>  
                  
                        </div>
                    )
                }
            }
            if (this.state.messagedUserIds.length !== 0 && this.state.notMessagedUserIds.length !== 0){
                matchingSection = (
                  <div className= "UserContainers">
                  <div className = "row">
                      <img src="happy-penguin.svg"></img>
                      <h4>Congratulations, you have a match!</h4>
                          <div className = "column left">
                            <h2>Not Messaged Users</h2>
                            <p>{notMessagedUserItems}</p>
                            
                          </div>
                          <div className = "column right">
                            <h2>Messaged Users</h2>
                            <p>{messagedUserItems}</p>
                          </div>
                      </div>
                    </div>
                  );
            }
            else if (messagedUserItems.length > 0) {
                matchingSection =  
                    <div className= "UserContainers">
                        <img src="happy-penguin.svg"></img>
                        <div className = "row">
                          <div className = "column left">
                            <br></br>
                            <h2>You don't have any new matches</h2>
                            <h2>Please keep swiping or check back later!</h2>
                          </div>
                          <div className = "column right">
                            <h2>Messaged Users</h2>
                            <div className="containerBox">
                                <p>{messagedUserItems}</p>
                            </div>
                          </div>
                      </div>
                    </div>
            }
            else if (notMessagedUserItems.length > 0) {
                matchingSection =  
                        <h3 id="Matches-congrats">
                        <img src="happy-penguin.svg"></img>
                        <p>Congratulations, you have a match!</p>
                        <p>There are friends you haven't messaged yet :)</p>
                        <p>Not Messaged Users</p>
                        <p>{notMessagedUserItems}</p>
                      </h3>
            }
            } else if (this.state.matchesExist == "not exists") {
            matchingSection = (
                <h2 id="Matches-none">
                <img src="sad-penguin.svg"></img>

                <p>Sorry, no one met the matching criteria you set.</p>
                <br></br>
                <p>
                    We suggest you to edit your profile, or wait for more users to join
                    our community.
                </p>
                <p>Please try again later :(</p>
                </h2>
            );
            } else {
            matchingSection = <h2></h2>;
            }
    return (
      <div>
        <Header id={this.state.userId} />
        <br></br>
        <br></br>
        <br></br>
        <br></br>

        <div id="Matches-section">
          {matchingSection}

          <div class="swipingButton" id="swipingButton">
            <Link to={{ pathname: "/main" }}>Keep Swiping</Link>
          </div>
          <div class="viewProfileButton" id="viewProfileButton">
            <Link to={{ pathname: "/viewprofile" }}>View Profile</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Matches);
