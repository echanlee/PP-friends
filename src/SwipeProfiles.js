import React from 'react';
import './Register.css';
import {browserHistory} from 'react-router';

class SwipeProfiles extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            firstName = '',
            description = '',
        };
    }

    this.handleSwipe = this.handleSwipe.bind(this);


    handleProfile(getProfile){
        
    }    
    
    
    
    handleSwipe(choice) {
        choice.preventDefault();
        if(this.checkPasswords()) {
          const myForm = document.getElementById('registerForm');
          
          const myRequest = new Request('http://', {
            method: 'POST',
            body: new FormData(myForm),
          });
          fetch(myRequest)
            .then(res => res.json())
            .then(res => { 
              if(res.response === "Success")
                  // browserHistory.push("profile");
              this.setState({
                error: res.response
              });
            })
            .catch((error) => {
              this.setState({
                error: "Error connecting to backend"
              });
            }
    
            );
        }
    }

    render(){
       return(
          <div className = "SwipeProfiles">
              


          </div>
        
       ) 
    }

    
} 