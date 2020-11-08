import React from 'react';
import './SwipeProfile.css';
import {withRouter, Link} from 'react-router-dom'

class SwipeProfiles extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            id: this.props?.location?.state?.id,
            age: '',
            firstName: '',
            description: '',
            interests: '',
            gender: '',
            workplace: '',
            potentialFriends: [],
            displayedUserId: '',
            error: '',
        };

        this.getPotentialFriendList = this.getPotentialFriendList.bind(this);
        this.displayProfile = this.displayProfile.bind(this);
        this.handleSwipe = this.handleSwipe.bind(this);
    }

    getPotentialFriendList() {
      const id = this.props?.location?.state?.id;
      var formData = new FormData();
      formData.append("userId", id)
      const myRequest = new Request('http://127.0.0.1:5000/getPotentialFriends', {
            method: 'POST',
            body: formData,
          });
      fetch(myRequest)
        .then(res => res.json())
        .then(res => { 
          if(res.response === "Success"){
            var potentialFriendsList = res.potentialListId;
            const displayProfileId = potentialFriendsList.pop();
            console.log(displayProfileId);
            this.setState({
              potentialFriends: potentialFriendsList,
              displayedUserId: displayProfileId,
              error: '',
            });

            this.displayProfile();
          }        
          else{      
            this.setState({
              error: res.response
            });
        }
        })
        .catch((error) => {
            this.setState({
              error: "Error connecting to backend"
            });
          }
        );

    }




    displayProfile(){
        const displayId = this.state.displayedUserId;
        if(displayId) {
        var formData = new FormData();
        formData.append("userId", displayId);
        const myRequest = new Request('http://127.0.0.1:5000/displayProfile', {
              method: 'POST',
              body: formData,
            });
        fetch(myRequest)
          .then(res => res.json())
          .then(res => { 
            if(res.response === "Success"){
              this.setState({
                age: res.age,
                firstName: res.firstName,
                description: res.description,
                interests: res.interests,
                gender: res.gender,
                workplace: res.workPlace,
                error: '',
              });

              console.log(this.state);
            } 
            else{             
              this.setState({
                error: res.response
              });
          }
          })
          .catch((error) => {
              this.setState({
                error: "Error connecting to backend"
              });
            }
          );
        }
        else {
          this.setState({
            error: "We don't have a user matching with your preference. Please edit your profile and try again later."
          });
        }

    }    
    
    
    
    handleSwipe(choice) {
        console.log(choice);
        const displayId = this.state.displayedUserId;
        const currentUserId = this.props?.location?.state?.id;
        var formData = new FormData();
        formData.append("currentUserId", currentUserId);
        formData.append("shownUserId", displayId);
        formData.append("match", choice);
        const myRequest = new Request('http://127.0.0.1:5000/swipe', {
              method: 'POST',
              body: formData,
            });
        fetch(myRequest)
          .then(res => res.json())
          .then(res => { 
            if(res.response === "Success") {
              var potentialList = this.state.potentialFriends;
              var newPotentialUserId = potentialList.pop();
              this.setState({
                potentialFriends: potentialList,
                displayedUserId: newPotentialUserId,
                error: '',
              });
              this.displayProfile();
            } 
            else{             
              this.setState({
                error: res.response
              });
          }
          })
          .catch((error) => {
              this.setState({
                error: "Error connecting to backend"
              });
            }
          );
    }

    render(){
      const potentialFriends = this.state.potentialFriends;
      const displayedUserId = this.state.displayedUserId;
      const error = this.state.error;
      if(displayedUserId === "" && potentialFriends.length === 0 && error ==="") {
        this.getPotentialFriendList();
      }
      
       return(
          <div className = "SwipeProfile">
            <header>Potential Friends!</header> 
            <Link to={{pathname: '/matches', state: {id: this.state.id}}}>See matches</Link> 
            <br></br>
            <br></br>
            {error ?
            <text>{error}</text> :
              <div>
                <p>Name: </p>
                <text>{this.state.firstName}</text>
                <p>Age: </p>
                <text>{this.state.age}</text>
                <p>Gender: </p>
                <text>{this.state.gender}</text>
                <p>Description: </p>
                <text>{this.state.description}</text>
                <p>Interests: </p>
                <text>{this.state.interests}</text>
                <p>Education / Work: </p>
                <text>{this.state.workplace}</text> <br></br> <br></br>
                <button onClick ={() => this.handleSwipe(true)}>Yes</button> <br></br>
                <button onClick ={() => this.handleSwipe(false)}>No</button>
              </div>
            }
          </div>
        
       ) 
    }
} 

export default withRouter(SwipeProfiles);