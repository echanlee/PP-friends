import React from 'react';


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
      console.log(myForm);
      
      const myRequest = new Request('http://127.0.0.1:5000/login', {
        method: 'POST',
        body: new FormData(myForm),
      });

      fetch(myRequest)
        .then(res => res.json())
        .then(res => { 
          console.log(res); 
            if(res.response === "Success")
              alert("Successfully logged in");
              //will need to redirect to a new page
            this.setState({
              error: res.response
            });
        })
        .catch((error) => {
          console.log("ERROR connecting to backend");
          this.setState({
            error: "Error connecting to backend"
          });
        });
  }

  render() {
    return (
      <div className = "Login" >
        <header> Welcome to PP Friends</header>
        <form id = "loginForm" onSubmit={this.handleSubmit}>
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

            <input type="submit" value="Submit" /><br></br>

            <text>{this.state.error}</text>
 
        </form>
      </div>
    );
  }
}

export default Login;