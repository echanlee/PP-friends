import React from "react";
import ReactDOM from "react-dom";
import { useEffect, useState } from "react";
import "./App.css";

function myApp() {
  const MyProfileForm = document.getElementById("profileForm");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/profile").then((response) =>
      response.json().then((data) => {})
    );
  }, []);

  class MyProfileForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        username: "",
        age: "null",
        bio: "",
        gender: "Female",
        genderPreference: "Female",
        education: "",
        interests: "",
      };
    }

    handleUpdate = (event) => {
      event.preventDefault();
      alert("Your profile has been updated!");
    };

    handleChange = (event) => {
      this.setState({ username: event.target.value });
      this.setState({ age: event.target.value });
      this.setState({ bio: event.target.value });
      this.setState({ gender: event.target.value });
      this.setState({ education: event.target.value });
      this.setState({ interests: event.target.value });
    };

    render() {
      return (
        <form onUpdate={this.handleUpdate}>
          <h1>My Profile</h1>

          <input
            type="file"
            name="profile-pic-file"
            onChange={this.myChangeHandler}
          />

          <p>Username:</p>

          <input type="text" name="username" onChange={this.myChangeHandler} />

          <p>Age:</p>

          <input
            type="number"
            name="age"
            min="18"
            max="100"
            onChange={this.myChangeHandler}
          />

          <p>Your Gender:</p>

          <select
            fieldValue={this.state.gender}
            onChange={this.myChangeHandler}
          >
            <option fieldValue="Female">Female</option>
            <option fieldValue="Male">Male</option>
            <option fieldValue="Other">Other</option>
          </select>

          <p>Your Preferred Gender for friends:</p>
          <select
            fieldValue={this.state.genderPreference}
            onChange={this.myChangeHandler}
          >
            <option fieldValue="Female">Female</option>
            <option fieldValue="Male">Male</option>
            <option fieldValue="Both">Both</option>
          </select>

          <p>Education/Work:</p>
          <input type="text" name="education" onChange={this.myChangeHandler} />

          <p>Your interests:</p>
          <input type="text" name="interests" onChange={this.myChangeHandler} />

          <p>Bio:</p>
          <input type="text" name="bio" onChange={this.myChangeHandler} />

          <button>Update!</button>
        </form>
      );
    }
  }

  ReactDOM.render(<MyProfileForm />, document.getElementById("root"));
}
