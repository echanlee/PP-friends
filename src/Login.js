import React from 'react';
import './Register.css';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };

    handleClick(event){
      var apiBaseURL ="http://localhost:3000";
      var self = this;
      var payload ={
        "email": this.state.username,
        "password":this.state.password
      }
      axios.post(apiBaseUrl+'login', payload)
        .then(function (response) {
          console.log(response);
          if(response.data.code == 200){
            console.log("Login successfull");
            var uploadScreen=[];
            uploadScreen.push(<UploadScreen appContext={self.props.appContext}/>)
            self.props.appContext.setState({loginPage:[],uploadScreen:uploadScreen})
          }
          else if(response.data.code == 204){
            console.log("Username password do not match");
            alert("username password do not match")
          }
          else{
            console.log("Username does not exists");
            alert("Username does not exist");
          }
        })
          .catch(function (error) {
          console.log(error);
          });
          
      }
 
  render() {
    return (
      <div className = "Register" >
        <header> Welcome to PP Friends</header>
        <TextField
             hintText="Enter your Username"
             floatingLabelText="Username"
             onChange = {(event,newValue) => this.setState({username:newValue})}
             />
           <br/>
             <TextField
               type="password"
               hintText="Enter your Password"
               floatingLabelText="Password"
               onChange = {(event,newValue) => this.setState({password:newValue})}
               />
             <br/>
             <RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>

      </div>
    );
  }
}
}
export default Register;
