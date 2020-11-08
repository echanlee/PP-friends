import React from "react";
import "./profile.css"
import {withRouter} from 'react-router-dom'

  class ProfileForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        name: "",
        birthday_yr: "",
        birthday_mo: "",
        birthday_dt: "",
        bio: "",
        gender: "Female",
        genderPreference: "Female",
        education: "",
        interests: "",
        error: "",
        maxDistance: 10,
      };

      this.handleUpdate = this.handleUpdate.bind(this);
      this.handleChange = this.handleChange.bind(this);
    }

    handleUpdate = (event) => {
      event.preventDefault();
      if (this.completedInput()){
        if (this.checkValideDate()) {
          if (this.checkAge() > 18 && this.checkAge() < 100){

            const id = this.props?.location?.state?.id;
            const age = this.checkAge();
            console.log(id);
            const myForm = new FormData (document.getElementById("profileForm"));
            myForm.append("id", id);
            myForm.append("age", age);
            const myRequest = new Request("http://127.0.0.1:5000/profile", {
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
          else{
          }
        } 
        else{ 
          alert("Please enter a valid date");
        }
      }
      else{ 
        alert("Please fill in all fields");
      }
    };

    completedInput = () => {
      const inputs = ['name', 'birthday_yr','birthday_mo', 'birthday_dt', 'bio', 'gender', 'genderPreference', 'education', 'interests'];
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

    checkValideDate = () => {
      const birthday_yr = this.state.birthday_yr;
      const birthday_mo = this.state.birthday_mo;
      const birthday_dt = this.state.birthday_dt;

      if (birthday_mo == 4 || birthday_mo == 6 || birthday_mo == 9 || birthday_mo == 11){
        if (birthday_dt > 30){
          return false;
        }
        else{
          return true;
        }
      }else if(birthday_mo != 2){
          if (birthday_dt > 31){
            return false;
          }
          else{
            return true;
          }
      }else if (birthday_mo == 2){
        if(birthday_yr % 4 == 0 || (birthday_yr % 100 == 0 && birthday_yr % 400 == 0)){
          if(birthday_dt > 29){
            return false;
          }
          else{
            return true;
          }
        }else{
          if (birthday_dt > 28){
            return false;
          }
          else{
            return true;
          }
        }
      }else{
            return true;
      }

    }

    checkAge = () => {
      const birthday_yr = this.state.birthday_yr;
      const birthday_mo = this.state.birthday_mo;
      const birthday_dt = this.state.birthday_dt;

      var birthday = Date(birthday_yr, birthday_mo, birthday_dt);  
      var today = new Date();

      var age = today.getFullYear() - birthday_yr
      if (today.getMonth() + 1 < birthday.month || (today.getMonth() + 1 === birthday.month && today.getDate < birthday.day)){
        age -= 1
      }
        
      if (age < 18) {
        alert("You need to be above 18 to register");
      } else if (age > 100) {
        alert("Please make sure you have entered a valid birthday");
      }
      return age;
    }

    render() {
      return (
        <div className="Profile">
          <form id="profileForm" onSubmit={this.handleUpdate}>
            <h1>My Profile</h1>

            <p>Name:</p>

            <input type="text" name="name" value = {this.state.name} onChange={this.handleChange} maxlength="30" />

            <p>Birthday:</p>

            <input
              type="int"
              name="birthday_yr"
              min="1920"
              onChange={this.handleChange}
              value = {this.state.birthday_yr}
              placeholder="YYYY*"
            />

            <input
              type="int"
              name="birthday_mo"
              min="1"
              max="12"
              onChange={this.handleChange}
              value = {this.state.birthday_mo}
              placeholder="MM*"
            />
            
            <input
              type="int"
              name="birthday_dt"
              min="1"
              max="31"
              onChange={this.handleChange}
              value = {this.state.birthday_dt}
              placeholder="DD*"
            />

            <p>Your Gender:</p>

            <select
              name = "gender"
              onChange={this.handleChange}
              value = {this.state.gender}
            >
              <option value="Female">Female</option>
              <option value ="Male">Male</option>
              <option value ="Both">Both</option>
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
