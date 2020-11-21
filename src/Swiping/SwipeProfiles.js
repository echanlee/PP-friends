import React from "react";
import Header from '../Header/Header';
import "./SwipeProfile.css";
import { withRouter, Link } from "react-router-dom";
import {getCookie, setCookie} from '../cookies';
import {getLocation} from '../GetLocation';

class SwipeProfiles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: getCookie("userId"),
      age: "",
      firstName: "",
      description: "",
      interests: "",
      gender: "",
      workplace: "",
      potentialFriends: [],
      displayedUserId: "",
      error: "",
    };

    this.getPotentialFriendList = this.getPotentialFriendList.bind(this);
    this.displayProfile = this.displayProfile.bind(this);
    this.handleSwipe = this.handleSwipe.bind(this);
  }

  getPotentialFriendList() {
    const id = this.state.id;
    var formData = new FormData();
    formData.append("userId", id);
    const myRequest = new Request("http://127.0.0.1:5000/getPotentialFriends", {
      method: "POST",
      body: formData,
    });
    fetch(myRequest)
      .then((res) => res.json())
      .then((res) => {
        if (res.response === "Success") {
          var potentialFriendsList = res.potentialListId;
          const displayProfileId = potentialFriendsList.pop();
          this.setState({
            potentialFriends: potentialFriendsList,
            displayedUserId: displayProfileId,
            error: "",
          });

          this.displayProfile();
        } else {
          this.setState({
            error: res.response,
          });
        }
      })
      .catch((error) => {
        this.setState({
          error: "Error connecting to backend",
        });
      });
  }

  displayProfile() {
    const displayId = this.state.displayedUserId;
    if (displayId) {
      var formData = new FormData();
      formData.append("userId", displayId);
      const myRequest = new Request("http://127.0.0.1:5000/displayProfile", {
        method: "POST",
        body: formData,
      });
      fetch(myRequest)
        .then((res) => res.json())
        .then((res) => {
          if (res.response === "Success") {
            this.setState({
              age: res.age,
              firstName: res.firstName,
              description: res.description,
              interests: res.interests,
              gender: res.gender,
              workplace: res.workPlace,
              error: "",
            });
          } else {
            this.setState({
              error: res.response,
            });
          }
        })
        .catch((error) => {
          this.setState({
            error: "Error connecting to backend",
          });
        });
    } else {
      this.setState({
        error:
          "There are no current potential friends for you within the area.",
      });
    }
  }

  handleSwipe(choice) {
    const displayId = this.state.displayedUserId;
    const currentUserId = this.state.id;
    var formData = new FormData();
    formData.append("currentUserId", currentUserId);
    formData.append("shownUserId", displayId);
    formData.append("match", choice);
    const myRequest = new Request("http://127.0.0.1:5000/swipe", {
      method: "POST",
      body: formData,
    });
    fetch(myRequest)
      .then((res) => res.json())
      .then((res) => {
        if (res.response === "Success") {
          var potentialList = this.state.potentialFriends;
          var newPotentialUserId = potentialList.pop();
          this.setState({
            potentialFriends: potentialList,
            displayedUserId: newPotentialUserId,
            error: "",
          });
          this.displayProfile();
        } else {
          this.setState({
            error: res.response,
          });
        }
      })
      .catch((error) => {
        this.setState({
          error: "Error connecting to backend",
        });
      });
  }

  async componentDidMount(){
    const storedLocation = getCookie("location");
    const storedLongitude = storedLocation[0];
    const storedLatitude = storedLocation[1];

    var currentLocation = await getLocation();
    const currentLongitude = currentLocation.coords.longitude;
    const currentLatitude = currentLocation.coords.latitude;
      
    if(storedLongitude === currentLongitude && storedLatitude === currentLatitude){
       console.log("test6")
    }
    else{
      
      const id = this.state.id;     
      setCookie("longitude", currentLongitude);
      setCookie("latitude", currentLatitude);
     

      const myRequest = new Request("http://127.0.0.1:5000/location", {
        method: "POST",
        body: JSON.stringify({"userID": id, "longitude": currentLongitude, "latitude": currentLatitude,})
      ,});
      
      fetch(myRequest)
      .then((res) => res.json())
      .then((res) => {
        if(res.response === "Success") {
          console.log("updated location")
        }
        else{
          console.log("error location update")
        };
      })
      .catch((error) => {
        this.setState({
          error: "Error connecting to backend",
        });
        console.log("test error")
      });
    }     
    
  }

  render() {
    
    const id = this.state.id;
    const potentialFriends = this.state.potentialFriends;
    const displayedUserId = this.state.displayedUserId;
    const error = this.state.error;

    if(id === "") {
      this.props.history.push({
        pathname: "/login",
      });
      return null;
    }

    if (
      displayedUserId === "" &&
      potentialFriends.length === 0 &&
      error === ""
    ) {
      this.getPotentialFriendList();
    }

    

    return (
      /*navigation bar and other necessary information about the match*/
      <div className="SwipeProfile">
        <br></br>
        <header class="pageTitle">Potential Friends!</header>
        <br></br>
            <Header id={id}/>
            <img src="ppFriendsLogo.png"></img>
            <br></br>
            <br></br>
            <br></br>
            {error ? (
              <text>{error}</text>
            ) : (
              <div>
                <p>Name: </p>
                <text>{this.state.firstName}</text>
                <p>Age: </p>
                <text>{this.state.age}</text>
                <br></br>
                <div class="profileIntroSection">
                  <br></br>
                  <p>Gender: </p>
                  <text>{this.state.gender}</text>
                  <p>Description: </p>
                  <text>{this.state.description}</text>
                  <p>Interests: </p>
                  <text>{this.state.interests}</text>
                  <p>Education / Work: </p>
                  <text>{this.state.workplace}</text>
                  <br></br>
                </div>
                <br></br>
                <button
                  class="button letsTalkButton"
                  onClick={() => this.handleSwipe(true)}
                >
                  Let's Talk!
                </button>{" "}
                <br></br>
                <button
                  class="button notInterestedButton"
                  onClick={() => this.handleSwipe(false)}
                >
                  Not Interested.
                </button>
              </div>
            )}
      </div>
    );
  }
}

export default withRouter(SwipeProfiles);
