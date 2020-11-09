import React from "react";
import "./profile.css"
import {withRouter} from 'react-router-dom'

  class ProfileForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        name: "",
        birthday: "",
        bio: "",
        gender: "Female",
        genderPreference: "Female",
        education: "",
        interests: "",
        error: "",
        maxDistance: 10,
        age: 0,
      };

      
      this.handleUpdate = this.handleUpdate.bind(this);
      this.handleChange = this.handleChange.bind(this);
    }

    handleUpdate = (event) => {
      event.preventDefault();
      if (this.completedInput()){
          this.checkAge();
          if (this.state.age > 18 && this.state.age < 100){
            const id = this.props?.location?.state?.id;
            const myForm = new FormData (document.getElementById("profileForm"));
            myForm.append("id", id);
            myForm.append("age", this.state.age);
            const myRequest = new Request("http://127.0.0.1:5000/createprofile", {
              method: "POST",
              body: myForm,
            });

            fetch(myRequest)
            .then((res) =>
            res.json())
            .then((res) => {
              if(res.response === "Success"){
                this.props.history.push({
                  pathname: "/questionnaire",
                  state: {id: id},
                });
              }
              else {
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
        } 
      else{ 
        alert("Please fill in all fields");
      }
    };

    completedInput = () => {
      const inputs = ['name', 'birthday', 'bio', 'gender', 'genderPreference', 'education', 'interests'];
      for(var i =0; i <inputs.length; i++) {
        if(!this.state[inputs[i]])
          return false;
      }
      return true;
    }

    handleChange = (event) => {
      const target = event.target;
      const value = target.value;
      const name = target.name;

      this.setState({
        [name]: value,
      });
    }

    checkAge = () => {
      const birthday = new Date(this.state.birthday);
      var today = new Date();

      var age = today.getFullYear() - birthday.getFullYear()
      if (today.getMonth() < birthday.getMonth() || (today.getMonth() === birthday.getMonth() && today.getDate < birthday.getDate())){
        age -= 1
      }
        
      if (age < 18) {
        alert("You need to be above 18 to register");
      } else if (age > 100) {
        alert("Please make sure you have entered a valid birthday");
      } else if (age >= 18 && age <= 100){
      }else{
        alert("Please input valid birthday")
      }
      this.state.age = age;
    }

    render() {
      return (
        <div className="Profile">
          <form id="profileForm" onSubmit={this.handleUpdate}>
            <h1>My Profile</h1>

            <p>Name:</p>

            <input type="text" name="name" value = {this.state.name} onChange={this.handleChange} maxlength="30" />

            <p>Birthday:</p>

            <input type="date" name="birthday"
              value={this.state.birthday}
              min="1920-01-01" 
              placeholder = "YYYY-MM-DD"
              onChange={this.handleChange}
              />

            <p>Your Gender:</p>

            <select
              name = "gender"
              onChange= {this.handleChange}
              value = {this.state.gender}
            >
              <option value="Female">Female</option>
              <option value ="Male">Male</option>
              <option value ="Other">Other</option>
            </select>

            <p>Your Preferred Gender for friends:</p>
            <select
              name = "genderPreference"
              fieldValue={this.state.genderPreference}
              onChange={this.handleChange}
              value = {this.state.genderPreference}
            >
              <option value="Female">Female</option>
              <option value ="Male">Male</option>
              <option value ="Both">Both</option>
            </select>

            <p>Education/Work:</p>
            <input type="text" name="education" value = {this.state.education} onChange={this.handleChange} maxlength="30"/>

            <p>Your interests:</p>
            <input type="text" name="interests" value ={this.state.interests} onChange={this.handleChange} maxlength="255" />

            <p>Bio:</p>
            <input type="text" name="bio" value = {this.state.bio} onChange={this.handleChange} maxlength="255"/>

            <p>Max Distance:</p>
            <input type="range" name="maxDistance" value = {this.state.maxDistance} onChange={this.handleChange} min="1" max="99999"/>
            <text>{this.state.maxDistance}KM</text><br></br>

            <input type="submit" value="Update" />
          </form>
          <text>{this.state.error}</text>
        </div>
      );
    }
  }

export default withRouter(ProfileForm);