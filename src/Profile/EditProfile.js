import React from "react";
import "./profile.css";
import { withRouter, Link } from "react-router-dom";
import { getCookie } from "../cookies";
import Header from "../Header/Header";

class EditProfile extends React.Component {
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
      updateStatus: "",

      profilePicture: null,
    };

    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
          bio: res.bio,
          gender: res.gender,
          genderPreference: res.genderPreference,
          education: res.education,
          interests: res.interests,
          maxDistance: res.maxDistance,
          birthday: res.birthday,
          profilePicture: res.profilePicture,
          updatedMessage: "",
        })
      )
      .catch((error) => {
        console.error(error);
      });
  }

  handleUpdate = (event) => {
    event.preventDefault();
    if (this.completedInput()) {
      this.checkAge();
      if (this.state.age > 18 && this.state.age < 100) {
        const id = this.props?.location?.state?.id;
        const myForm = new FormData(document.getElementById("profileForm"));
        myForm.append("id", id);
        myForm.append("age", this.state.age);
        const myRequest = new Request("http://127.0.0.1:5000/editprofile", {
          method: "POST",
          body: myForm,
        });

        fetch(myRequest)
          .then((res) => res.json())
          .then((res) => {
            if (res.response === "Success") {
              this.setState({
                updatedMessage: (
                  <p>You have successfully updated your profile!</p>
                ),
                profilePicture: res.imageURL,
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
      }
    } else {
      alert("Please fill in all fields");
    }
  };

  completedInput = () => {
    const inputs = [
      "name",
      "birthday",
      "bio",
      "gender",
      "genderPreference",
      "education",
      "interests",
    ];
    for (var i = 0; i < inputs.length; i++) {
      if (!this.state[inputs[i]]) return false;
    }
    return true;
  };

  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  removePicture = () => {
    document.querySelector("input[type=file]").value = "";
    this.setState({
      profilePicture: null,
    });
  };

  checkAge = () => {
    const birthday = new Date(this.state.birthday);
    var today = new Date();

    var age = today.getFullYear() - birthday.getFullYear();
    if (
      today.getMonth() < birthday.getMonth() ||
      (today.getMonth() === birthday.getMonth() &&
        today.getDate < birthday.getDate())
    ) {
      age -= 1;
    }

    if (age < 18) {
      alert("You need to be above 18 to register");
    } else if (age > 100) {
      alert("Please make sure you have entered a valid birthday");
    } else if (age >= 18 && age <= 100) {
    } else {
      alert("Please input valid birthday");
    }
    this.state.age = age;
  };

  render() {
    const id = this.state.id;

    if (id === "") {
      this.props.history.push({
        pathname: "/login",
      });
      return null;
    }
    return (
      <div>
        <Header id={this.state.userId} />
        <div className="Profile">
          <form id="profileForm" onSubmit={this.handleUpdate}>
            <h1>Update My Profile 👋</h1>
            <img src="ppFriendsLogo.png"></img>
            <div class="row">
              <div class="column left">
                <div class="profilepic">
                  <p>Profile Picture</p>
                  <br></br>
                  {this.state.profilePicture && (
                    <img src={this.state.profilePicture}></img>
                  )}
                  <p>Upload New image:</p>
                  <input
                    type="file"
                    id="img"
                    name="img"
                    accept="image/*"
                  ></input>
                  <br></br>
                  <text class="removepic" onClick={this.removePicture}>
                    Remove picture
                  </text>
                  <div class="updateProfileButton">
                    <input type="submit" value="Save Profile" />
                    {this.state.updatedMessage}
                  </div>
                </div>
              </div>
              <div class="column right">
                <div class="rectangle2">
                  <label for="User">Name 😀</label>
                  <input
                    type="text"
                    name="name"
                    value={this.state.name}
                    onChange={this.handleChange}
                    maxlength="30"
                  />

                  <br></br>
                  <br></br>

                  <label for="Birthday">Birthday 🎂</label>

                  <input
                    type="date"
                    name="birthday"
                    value={this.state.birthday}
                    min="1920-01-01"
                    placeholder="YYYY-MM-DD"
                    onChange={this.handleChange}
                  />

                  <br></br>
                  <br></br>

                  <label for="Gender">Gender 👫</label>

                  <select
                    name="gender"
                    onChange={this.handleChange}
                    value={this.state.gender}
                  >
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
                    fieldValue={this.state.genderPreference}
                    onChange={this.handleChange}
                    value={this.state.genderPreference}
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Both">Both</option>
                  </select>

                  <br></br>
                  <br></br>
                  <br></br>

                  <label for="Education">Education/Work 💻</label>

                  <input
                    type="text"
                    name="education"
                    value={this.state.education}
                    onChange={this.handleChange}
                    maxlength="30"
                  />

                  <br></br>
                  <br></br>

                  <label for="Interests">Your interests 🎨</label>

                  <textarea
                    type="text"
                    name="interests"
                    value={this.state.interests}
                    onChange={this.handleChange}
                    maxlength="255"
                  />

                  <br></br>
                  <br></br>

                  <label for="Bio">Bio 😶</label>
                  <textarea
                    type="text"
                    name="bio"
                    value={this.state.bio}
                    onChange={this.handleChange}
                    maxlength="255"
                    contenteditable="true"
                  />

                  <br></br>
                  <br></br>

                  <label for="Distance">Max Distance 🌎</label>
                  <input
                    type="range"
                    name="maxDistance"
                    value={this.state.maxDistance}
                    onChange={this.handleChange}
                    min="1"
                    max="500"
                  />
                  <text>{this.state.maxDistance}KM</text>
                  <br></br>
                  <br></br>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(EditProfile);
