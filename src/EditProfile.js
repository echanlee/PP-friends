import React from "react";
import "./profile.css"
import {withRouter, Link} from 'react-router-dom'

  class EditProfile extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        userId: this.props?.location?.state?.id,
        name: "",
        age: "null",
        bio: "",
        gender: "Female",
        genderPreference: "Female",
        education: "",
        interests: "",
        error: "",
        maxDistance: 10,
        updateStatus: "",
      };

      this.handleUpdate = this.handleUpdate.bind(this);
      this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount(){
        const myRequest = new Request('http://127.0.0.1:5000/viewprofile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({"userId": this.state.userId}),
            });
            fetch(myRequest)
                .then(response => response.json())
                .then(res => 
                        this.setState({
                            name: res.name,
                            age: res.age, 
                            bio: res.bio,
                            gender: res.gender,
                            genderPreference: res.genderPreference,
                            education: res.education, 
                            interests: res.interests,
                            maxDistance: res.maxDistance,
                        })
            ).catch((error) => {
                console.error(error)
        })
      }

    handleUpdate = (event) => {
      event.preventDefault();
      if(this.completedInput()) {
        const id = this.props?.location?.state?.id;
        const myForm = new FormData (document.getElementById("profileForm"));
        myForm.append("id", id);
        const myRequest = new Request("http://127.0.0.1:5000/editprofile", {
          method: "POST",
          body: myForm,
        });

        fetch(myRequest)
        .then((res) =>
          res.json())
        .then((res) => {
          if(res.response === "Success"){
            this.setState({
                updateStatus: "Profile Just Updated!"
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
      else 
        alert("Please fill in all fields");
    };

    completedInput = () => {
      const inputs = ['name', 'age', 'bio', 'gender', 'genderPreference', 'education', 'interests'];
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

    render() {
      return (
          
        <div className="Profile">
            <Link to={{pathname: '/main', state: {id: this.state.userId}}}>Back to Swiping!</Link>
          <form id="profileForm" onSubmit={this.handleUpdate}>
            <h1>My Profile</h1>

            <p>Name:</p>

            <input type="text" name="name" value = {this.state.name} onChange={this.handleChange} maxlength="30" />

            <p>Age:</p>

            <input
              type="number"
              name="age"
              min="18"
              max="100"
              onChange={this.handleChange}
              value = {this.state.age}
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
            <text>{this.state.updateStatus}</text>
          </form>
          <text>{this.state.error}</text>
        </div>
      );
    }
  }

export default withRouter(EditProfile);
