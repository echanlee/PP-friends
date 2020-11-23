import React from "react";
import {withRouter, Link} from 'react-router-dom'
import Header from '../Header/Header'

class ViewFriendProfile extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        userId: this.props?.location?.state?.id,
        friendId: this.props?.location?.state?.friendId,
        name: "",
        birthday: "",
        age: 0,
        bio: "",
        gender: "Female",
        education: "",
        interests: "",
        error: "",
      };
      this.selectUserMessage = this.selectUserMessage.bind(this);
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
    render() {
      var displayName = this.state.name+"'s";
      return (
        <div className="Profile">
          <Header id={this.state.userId}/>
          <button className='pos-user' 
              key={this.state.friendId+"|message"}
              value = {this.state.friendId+"|"+this.state.name} 
              onClick = {this.selectUserMessage}>
            message {this.state.name}
          </button>  
          <form id="profileForm">
            <h1>View {displayName} Profile</h1>
            <p>Name:</p>

            {this.state.name}

            <p>Birthday:</p>
            <input type="date" name="birthday"
              value={this.state.birthday}
              placeholder = "YYYY-MM-DD"
              />

            <p>{displayName} Gender:</p>

            <select
              name = "gender"
              value = {this.state.gender}
            >
              <option value="Female">Female</option>
              <option value ="Male">Male</option>
              <option value ="Other">Other</option>
            </select>

            <p>Education/Work:</p>
            {this.state.education}

            <p>{displayName} interests:</p>
            {this.state.interests}

            <p>Bio:</p>
            {this.state.bio}
          </form>
          <text>{this.state.error}</text>
        </div>
      );
  };
}
export default withRouter(ViewFriendProfile);
