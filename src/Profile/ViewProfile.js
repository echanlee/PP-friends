import React from "react";
import { withRouter, Link } from "react-router-dom";
import { getCookie } from "../cookies";
import Header from "../Header/Header";
import LoadingSpinner from "./LoadingSpinner";

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
      loading: true,
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
          loading: false,
          profilePicture: res.profilePicture,
        })
      )
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const loading = this.state.loading;
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
          {loading ? (
            <LoadingSpinner /> && <div className="Loading"></div>
          ) : (
            <form id="profileForm">
              <h1>View My Profile</h1>
              <img src="ppFriendsLogo.png"></img>
              <br></br>
              <br></br>
              <div class="rectangle">
                <label for="User">Name 😀</label>
                <input name={this.state.name} value={this.state.name} />

                <br></br>
                <br></br>

                <label for="Birthday">Birthday 🎂</label>
                <input
                  type="date"
                  name="birthday"
                  value={this.state.birthday}
                  placeholder="YYYY-MM-DD"
                />

                <br></br>
                <br></br>

                <label for="Gender">Gender 👫</label>
                <select name="gender" value={this.state.gender}>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>

                <br></br>
                <br></br>

                <label for="GenderPreference">
                  Your Preferred Gender for friends 🎎
                </label>
                <select
                  name="genderPreference"
                  value={this.state.genderPreference}
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Both">Both</option>
                </select>

                <br></br>
                <br></br>

                <label for="Education">Education/Work 💻</label>
                <input
                  name={this.state.education}
                  value={this.state.education}
                />

                <br></br>
                <br></br>

                <label for="Interests">Your interests 🎨</label>
                <input
                  name={this.state.interests}
                  value={this.state.interests}
                />

                <br></br>
                <br></br>

                <label for="Bio">Bio 😶</label>
                <input name={this.state.bio} value={this.state.bio} />

                <br></br>
                <br></br>

                <label for="Distance">Max Distance 🌎</label>
                <input
                  type="range"
                  name="maxDistance"
                  value={this.state.maxDistance}
                  min="1"
                  max="99999"
                />
                <text>{this.state.maxDistance}KM</text>
                <text>{this.state.error}</text>
                <br></br>
                <br></br>

                <p>Profile Picture</p>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }
}
export default withRouter(ViewProfile);
