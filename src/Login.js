import "./Login.css";
import React from 'react';
import {withRouter, Link} from 'react-router-dom'


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
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

      const myForm = document.getElementById('loginForm');
      
      const myRequest = new Request('https://pp-friends.herokuapp.com/#/Login', {
        method: 'POST',
        body: new FormData(myForm),
      });

      fetch(myRequest)
        .then(res => res.json())
        .then(res => { 
            if(res.response === "Success") {
              this.props
                .history.push({
                  pathname: "/main",
                  state: {id: res.id}
                });
            }
            this.setState({
              error: res.response
            });
        })
        .catch((error) => {
          this.setState({
            error: "Error connecting to backend"
          });
        });
  }

  render() {
    return (
      <div className = "Login" >
        <div className = "logoBanner">
        <svg viewBox="0 0 500 200">
          <path id="curve" fill = "transparent" d="M73.2,200.6c4-6.1,65.5-96.8,178.6-95.6c111.3,1.2,170.8,90.3,175.1,97" />
          <text width="500">
          <textPath href="#curve">
            Making friendly connections.
          </textPath>
            </text>
        </svg>
        <img src="ppFriendsLogo.png"></img>
        </div>
        
        <h1> Purely Platonic</h1>
        <form id = "loginForm" onSubmit={this.handleSubmit}>
              <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                /><br></br>
                <input
                  name="password"
                  type="password"
                  value = {this.state.password}
                  placeholder="Enter password"
                  onChange={this.handleInputChange}
                /><br></br>

            <input type="submit" value="Submit" /><br></br>

            <text>{this.state.error}</text>
 
        </form>
        <Link to="/register">Create a new Account</Link>
      </div>
    );
  }
}

export default withRouter(Login);