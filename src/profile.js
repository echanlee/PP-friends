import React from 'react';
import ReactDOM from 'react-dom';

class MyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      age: null,
      bio: '',
      gender: 'Female'
    };
  }


  myChangeHandler = (event) => {
    console.log(event.target.files[0])
    let nameField = event.target.name;
    let fieldVal = event.target.fieldValue;
    let errMsg = '';
    if (nameField === "age") {
      if (fieldVal != "" && !Number(fieldVal)) {
        errMsg = <strong>infieldValid input, please enter a number</strong>;
      }
    }
    this.setState({errormessage: errMsg});
    this.setState({[nameField]: fieldVal});
  }

  handleUpdate = (event)=> {
      event.preventDefault();
      alert("Your profile has been updated!")
  }
 
  handleChange = (event) => {
      this.setState({username: event.target.value});
      this.setState({age: event.target.value});
      this.setState({bio: event.target.value});
      this.setState({gender: event.target.value});
  }

  render() {
    return (
      <form onUpdate={this.handleUpdate}>
      <h1>My Profile</h1>

      <input type="file" name="file" onChange={this.myChangeHandler}/>

      
      <p>Username: </p>

      <input type='text' name='username' onChange={this.myChangeHandler}/>

      <p>Age:</p>
      <input type='text' name='age' onChange={this.myChangeHandler}/>

      <p>Your Gender:</p>
      <select fieldValue = {this.state.gender} onChange ={this.myChangeHandler}>
          <option fieldValue = "Female">Female</option>
          <option fieldValue = "Male">Male</option>
      </select>

      <p>Your Preferred Gender for friends:</p>
      <select fieldValue = {this.state.gender} onChange ={this.myChangeHandler}>
          <option fieldValue = "Female">Female</option>
          <option fieldValue = "Male">Male</option>
      </select>

      <p>Education/Work:</p>
      <input type='text' name='education' onChange={this.myChangeHandler}/>

      <p>Your interests</p>
      <input type='text' name='interests'onChange={this.myChangeHandler}/>

       <p>Bio:</p>
      <input type='text'name='bio' onChange={this.myChangeHandler} />

<button>Update!</button>

        </form>
    );
  }
}

ReactDOM.render(<MyForm />, document.getElementById('root'));


    
