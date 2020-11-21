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
        <div>
          {" "}
          <div className="Profile">
            <form id="profileForm">
              <h1>View My Profile</h1>
              <img src="ppFriendsLogo.png"></img>
              <br></br>
              <br></br>

              <div class="formgroup">
                <label for="User">Name 😀</label>
                <input name={this.state.name} value={this.state.name} />
              </div>
              <br></br>
              <br></br>
              <div class="formgroup">
                <label for="Birthday">Birthday 🎂</label>
                <input
                  type="date"
                  name="birthday"
                  value={this.state.birthday}
                  placeholder="YYYY-MM-DD"
                />
              </div>

              <br></br>
              <br></br>
              <div class="formgroup">
                <label for="Gender">Gender 👫</label>
                <select name="gender" value={this.state.gender}>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <br></br>
              <br></br>
              <div class="formgroup">
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
              </div>

              <br></br>
              <br></br>
              <div class="formgroup">
                <label for="Education">Education/Work 💻</label>
                <input
                  name={this.state.education}
                  value={this.state.education}
                />
              </div>

              <br></br>
              <br></br>
              <div class="formgroup">
                <label for="Interests">Your interests 🎨</label>
                <input
                  name={this.state.interests}
                  value={this.state.interests}
                />
              </div>

              <br></br>
              <br></br>
              <div class="formgroup">
                <label for="Bio">Bio 😶</label>
                <input name={this.state.bio} value={this.state.bio} />
              </div>
              <br></br>
              <br></br>

              <div class="formgroup">
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
                <div class="rectangle">
                  <p>Profile Picture</p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(ViewProfile);
