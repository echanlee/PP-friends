import React from "react";
import {withRouter, Link} from 'react-router-dom'
import {getCookie} from '../cookies';
import Header from '../Header/Header';
import "./setting.css";


class UpdatePassword extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        userId: getCookie("userId"),
        oldPassword: "",
        newPassword:"",
        confirmPassword:"",
        error: "",
      };
      
      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      
    }
    
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            error: "",
          [name]: value,
        });

    }

    completedInput = () => {
        const inputs = ['oldPassword', 'newPassword', 'confirmPassword'];
        for(var i =0; i <inputs.length; i++) {
          if(!this.state[inputs[i]])
            return false;
        }
        return true;
    }

    checkPasswords() {
        const newPassword = this.state.newPassword;
        const confirmPassword = this.state.confirmPassword;
        const oldPassword = this.state.oldPassword;
        if (newPassword.length === 0) {
          alert("Please add password");
          return false;
        } else if (confirmPassword != newPassword) {
          alert("Please make sure the new passwords match");
            
          return false;
        } else if ((confirmPassword == newPassword) && (newPassword == oldPassword)){
            alert("Your new password is the same as your old password")
            return false;
        }
        return true;
    }
        
    handleSubmit = (event) => {
        event.preventDefault();
        
        if (this.completedInput()){
            if (this.checkPasswords()){
                const id = this.state.userId;
                const myForm = new FormData (document.getElementById("newPasswordForm"));
                myForm.append("id", id);

                const myRequest = new Request("https://pp-friends.herokuapp.com/updatePassword", {
                    method: "POST",
                    body: myForm,
                });
  
                fetch(myRequest)
                .then((res) =>
                res.json())
                .then((res) => {
                    this.setState({error: ""});
                    if(res.response === "Success"){
                        this.setState({
                            error: "Successfully updated password!",
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
          alert("Please enter all fields");
        }
    };

    render() {
        return (
            <div className="updatePassword">
            <Header id={this.state.userId}/>
            <form id="newPasswordForm" onSubmit={this.handleSubmit}>
            <h1>Change Password</h1>
              <p>Please enter your current password</p> 
              <input 
                name="oldPassword" 
                type="password" 
                value={this.state.oldPassword}
                placeholder="current password"
                onChange={this.handleInputChange} 
              />
              <br></br>
              <p>Please enter your new password</p>
              <input
                name="newPassword"
                type="Password"
                value={this.state.newPassword}
                placeholder="new password"
                onChange={this.handleInputChange}
              />
              <br></br>
              <p>Please re-enter your new password</p>
              <input
                name="confirmPassword"
                type="password"
                value={this.state.confirmPassword}
                placeholder="Re-enter new password"
                onChange={this.handleInputChange}
              />
              <br></br>

                <br></br>
              <input type="submit" value="Update" /> <br></br>
              <text>{this.state.error}</text>
            </form>
            </div>
        );
    }
  
}
export default withRouter(UpdatePassword);