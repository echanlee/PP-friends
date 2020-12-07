import React from "react";
import {withRouter, Link} from 'react-router-dom'
import Header from '../Header/Header'
import "../Profile/profile.css";


class ViewFriendProfile extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        userId: this.props?.location?.state?.id,
        friendId: this.props?.location?.state?.friendId,
        currentName: this.props?.location?.state?.currentName,
        name: "",
        birthday: "",
        age: 0,
        bio: "",
        gender: "Female",
        education: "",
        interests: "",
        error: "",
        profilePicture: null, 
      };
      this.selectUserMessage = this.selectUserMessage.bind(this);
      this.unmatchUser = this.unmatchUser.bind(this);
    }
    componentDidMount(){
      const myRequest = new Request('https://pp-friends.herokuapp.com/viewprofile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({"userId": this.state.friendId}),
        });
    fetch(myRequest)
        .then(response => response.json())
        .then(res => 
                this.setState({
                    name: res.name,
                    age: res.age, 
                    bio: res.bio,
                    gender: res.gender,
                    education: res.education, 
                    interests: res.interests,
                    birthday: res.birthday,
                    profilePicture: res.profilePicture,
                })
        ).catch((error) => {
            console.error(error)
        })
    }
    selectUserMessage(event) {
      const userSelected = event.target.value.split("|");
      const myRequest = new Request('https://pp-friends.herokuapp.com/conversationId', {
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
                    currentName: this.state.currentName,
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
      const myRequest = new Request('https://pp-friends.herokuapp.com/unmatch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              "userId": this.state.userId,
              "friendId": this.state.friendId,
          }),
      });
      fetch(myRequest)
      .then(response => response.json())
      .then(res => {
          this.props
          .history.push({
            pathname: "/matches",
            state: {
                id: this.state.userId,
          }});
      })
      .catch((error) => {
          alert("Something went wrong");
          console.error(error)
      });
    }
    render() {
      var displayName = this.state.name+"'s";
      return (
        <div>
          <Header id={this.state.userId}/>
          <div className="Profile">
            <form id="profileForm">
            < h1>View {displayName} Profile</h1>             
              <div class = "row">
                <br></br>
                <button className='pos-user' 
                  key={this.state.friendId+"|message"}
                  value = {this.state.friendId+"|"+this.state.name} 
                  onClick = {this.selectUserMessage}>
                  message {this.state.name}
                </button>
                <br></br>
                <div class = "column left">
                  <div class = "profilepic">
                  <button className='unmatch-button'
                  onClick = {(e) => { if (window.confirm('Are you sure you wish to unmatch with this user? You cannot undo this action')) this.unmatchUser(e) } }
                >
                  Unmatch {this.state.name}
                </button>
                <br></br>
                    {this.state.profilePicture 
                    && <img src={this.state.profilePicture}></img>
                    }     
                  </div>
                </div>
                <div class = "column right">
                  <div class= "rectangle">
                    <label for="User">Name 😀</label>
                    {this.state.name}
                    <br></br>
                    <br></br>

                    <label for="Birthday">Birthday 🎂</label>
                      {this.state.birthday}
                    <br></br>
                    <br></br>

                    <label for="Gender">Gender 👫</label>
                    {this.state.gender}

                    <br></br>
                    <br></br>

                    <label for="Education">Education/Work 💻</label>
                    <text>{this.state.education}</text>

                    <br></br>
                    <br></br>

                    <label for="Interests">Your interests 🎨</label>
                    <text class= "bigText">{this.state.interests}</text>

                    <br></br>
                    <br></br>

                    <label for="Bio">Bio 😶</label>
                    <text class= "bigText">{this.state.bio}</text>

                    <br></br>
                    <br></br>
 
                  </div>              
                </div>
              </div>
            </form>

            <text>{this.state.error}</text>
          </div>
        </div>

      );
  };
}
export default withRouter(ViewFriendProfile);
