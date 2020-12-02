import React from "react";
import { withRouter, Link } from "react-router-dom";
import { getCookie } from "../cookies";
import Header from "../Header/Header";

import "./ViewProfile.css";

class ViewProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: getCookie("userId"),
      name: "",
      birthday: "",
      age: 0,
      bio: "",
      gender: "Female",
      genderPreference: "Female",
      education: "",
      interests: "",
      error: "",
      maxDistance: 10,
      profilePicture: null,
    };
  }
  componentDidMount() {
    const myRequest = new Request("http://127.0.0.1:5000/viewprofile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: this.state.userId }),
    });
    fetch(myRequest)
      .then((response) => response.json())
      .then((res) =>
        this.setState({
          name: res.name,
          age: res.age,
          bio: res.bio,
          gender: res.gender,
          genderPreference: res.genderPreference,
          education: res.education,
          interests: res.interests,
          birthday: res.birthday,
          maxDistance: res.maxDistance,
          profilePicture: res.profilePicture,
        })
      )
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    if (this.state.userId === "") {
      this.props.history.push({
        pathname: "/login",
      });
      return null;
    }
    return (
      <div>
        <Header id={this.state.userId} />
          <div className="Profile">
            <h1>View My Profile</h1>
            <img src="ppFriendsLogo.png"></img>
          <div class = "row">
            <div class = "column left">
              <div class = "profilepic">
                <p>Profile Picture</p>
                {this.state.profilePicture 
                && <img src={this.state.profilePicture}></img>
                }
              </div>
                                  
            </div>
              <div class = "column right">
              <div class="rectangle">
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

                <label for="GenderPreference">
                  Your Preferred Gender for friends 🎎
                </label>
                {this.state.genderPreference}

                <br></br>
                <br></br>
                <br></br>

                <label for="Education">Education/Work 💻</label>
                {this.state.education}

                <br></br>
                <br></br>

                <label for="Interests">Your interests 🎨</label>
                {this.state.interests}

                <br></br>
                <br></br>

                <label for="Bio">Bio 😶</label>
                {this.state.bio}
                
                <br></br>
                <br></br>

                <label for="Distance">Max Distance 🌎</label>
                <input
                  type="range"
                  name="maxDistance"
                  value={this.state.maxDistance}
                  min="1"
                  max="500"
                />
                <text>{this.state.maxDistance}KM</text>
                <text>{this.state.error}</text>
                <br></br>
                <br></br>
                </div>
              </div>
            </div>
          </div>
      </div>
    );
  }
}
export default withRouter(ViewProfile);
