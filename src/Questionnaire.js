import React, {Component} from 'react';
import questions from './questions';
import QuestionBox from './QuestionBtn';
import './Questionnaire.css';
import {withRouter} from 'react-router-dom'

class Questionnaire extends Component {
  constructor(props){
    super(props);
    this.state = {
      questionBank: [],
      response:[]
    };
    this.handleSubmit =this.handleSubmit.bind(this);
  }

  handleSubmit(event){
    event.preventDefault();
    if(this.state.response.length >= 16){ //checks if all questions have been answered
      const id = this.props?.location?.state?.id;//test ID
      const myRequest = new Request ('http://127.0.0.1:5000/questionnaire',{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({"responses":this.state.response, 
                              "userId": id}),
      });

      fetch(myRequest)
      .then((res) =>
        res.json())
      .then((res) =>{
        if(res.response === "Success"){
          this.props
          .history.push({
            pathname: "/main",
            state: {id: id}
          });
        }
        else {
          this.setState({
            error: res.response,
          });
        }
      })
      .catch((error) =>{
        this.setState({
          error: "Error connecting to backend",
        });
      });
    }
    else{
      alert("Please answer all questions");
    }
  };

  getQuestions = () => {
    questions().then(question => {
      this.setState({
        questionBank: question
      });
    });
  };
  componentDidMount() {
    this.getQuestions();
  }
  storeAnswer = (answer) => {
    this.setState({
      response: this.state.response.concat(answer)});
  }
  render(){
    return(
      <div>
        <div>
          <h1>PP Friends Questionnaire</h1>
          <h4>Please answer all questions before submitting</h4>
        </div>
        {this.state.questionBank.length > 0 &&
          this.state.questionBank.map(({question,answers,questionId}) =>(
            <QuestionBox 
            question={question}
            options={answers}
            ID={questionId}
            key={questionId}
            selected={answer => this.storeAnswer(answer)}
            />
          ))
        }
        <div>
          <button onClick={this.handleSubmit}>Submit</button>
        </div>
      </div>
    );
  }
}

export default withRouter(Questionnaire);