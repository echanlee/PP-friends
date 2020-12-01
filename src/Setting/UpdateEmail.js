import React from "react";
import {withRouter, Link} from 'react-router-dom'
import {getCookie} from '../cookies';
import Header from '../Header/Header';
import "./UpdateEmail.css";


class UpdateEmail extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        userId: getCookie("userId"),
        email: "",
        error:"",
      };
      
      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      
    }
    
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
          [name]: value,
        });

    }
        
    handleSubmit = (event) => {
        event.preventDefault();
        
        if (this.state.email != ""){

            const id = this.state.userId;
            const myForm = new FormData (document.getElementById("newEmailForm"));
            myForm.append("id", id);

            const myRequest = new Request("http://127.0.0.1:5000/updateEmail", {
                method: "POST",
                body: myForm,
            });
  
            fetch(myRequest)
            .then((res) =>
            res.json())
            .then((res) => {
                this.setState({error: ""});
                if(res.response === "Success"){
                    alert("You have successfully changed your email")
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
          alert("Please enter a new email address");
        }
    };

    render() {
        return (
          <div>
            <Header id={this.state.userId}/>
            <div className="updateEmail">
            
            <form id="newEmailForm" onSubmit={this.handleSubmit}>
            <h1>Update Email</h1>
              <p>please enter your new email address:</p> 
              <input 
                name="email" 
                type="email" 
                value={this.state.email}
                placeholder="New Email Address"
                onChange={this.handleInputChange} 
              />
              <input name="UpdateEmail"type="submit" value="Update" /> 
              <text>{this.state.error}</text>
            </form>
            </div>
          </div>  
        );
    }
  
}
export default withRouter(UpdateEmail);