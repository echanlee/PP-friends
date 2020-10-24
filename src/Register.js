import React from 'react';
import './Register.css';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      confirmPassword: '',
      error: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    if(this.checkPasswords()) {
      const myForm = document.getElementById('registerForm');
      console.log(myForm);
      
      const myRequest = new Request('http://127.0.0.1:5000/register', {
        method: 'POST',
        body: new FormData(myForm),
      });

      fetch(myRequest)
        .then(res => res.json())
        .then(res => { 
          console.log(res); 
          if(res.response === "Success")
              //NAVIGATE TO NEW PAGE can use res.ID to get user id 
          this.setState({
            error: res.response
          });
        })
        .catch((error) => {
          console.log("ERROR connecting to backend");
          this.setState({
            error: "Error connecting to backend"
          });
        }

        );
    }
  }

  checkPasswords() {
    const password = this.state.password;
    const confirmPassword = this.state.confirmPassword;
    if(password.length === 0) {
      alert("Please add password");
      return false;
    }
    else if(confirmPassword !== password) {
      alert("Please make sure passwords match");
      return false;
    }
    return true;
  }
  
  render() {
    return (
      <div className = "Register" >
        <header> Register for PP Friends</header>
        <form id = "registerForm" onSubmit={this.handleSubmit}>
              <input
                  name="email"
                  type="email"
                  placeholder="Email Address*"
                /><br></br>
                <input
                  name="password"
                  type="password"
                  value = {this.state.password}
                  placeholder="Enter password*"
                  onChange={this.handleInputChange}
                /><br></br>
                 <input
                  name="confirmPassword"
                  type="password"
                  value = {this.state.confirmPassword}
                  placeholder="Re-enter password*"
                  onChange={this.handleInputChange}
                /><br></br>


            <input type="submit" value="Submit" /><br></br>

            <text>{this.state.error}</text>
 
        </form>
      </div>
    );
  }
}

export default Register;
