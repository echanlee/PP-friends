import React, { Component } from "react";
import questions from "./questions";
import QuestionBox from "./QuestionBtn";
import "./Questionnaire.css";
import { withRouter } from "react-router-dom";
import { getCookie } from "../cookies";

class Questionnaire extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: getCookie("userId"),
      questionBank: [],
      response: [],
      error:"",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    console.log(this.state.response.length)
    event.preventDefault();
    if (this.checkResponses()) {
      //checks if all questions have been answered
      console.log(this.state.response.length)
      const id = this.state.id;
      const myRequest = new Request("https://pp-friends.herokuapp.com/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses: this.state.response, userId: id }),
      });

      const matchRequest = new Request("https://pp-friends.herokuapp.com/potentialMatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses: this.state.response, userId: id }),
      });
      fetch(myRequest)
        .then((res) => res.json())
        .then((res) => {
          if (res.response === "Success") {
            console.log(this.state.response.length)
            console.log(res)
            //Once the first questionnaire API call is a success, the second matching call is nested to ensure that the two calls
            //happen in succession
            fetch(matchRequest)
              .then((res) => res.json())
              .then((res) => {
                if (res.response === "Success") {
                  this.props.history.push({
                    pathname: "/main",
                  });
                } else {
                  this.setState({
                    error: res.response,
                  });
                }
              });
          } else {
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
    } else {
      alert("Please answer all questions");
    }
  }

  checkResponses(){
    var countanswer=0;
    this.state.response.map(answer=>{
      if(answer == 0 || answer == 1){
        countanswer++
      }
    })
    return countanswer==16
}

  getQuestions = () => {
    questions().then((question) => {
      this.setState({
        questionBank: question,
      });
    });
  };
  componentDidMount() {
    this.getQuestions();
  }
  storeAnswer = (answer, ID) => {
    this.state.response[ID - 1] = answer;
  };
  render() {
    if (this.state.id === "") {
      this.props.history.push({
        pathname: "/login",
      });
      return null;
    }

    return (
      <div>
        <div class="ppQuestionnaire">
          <h1>PP Friends Questionnaire</h1>
          <img src="question-penguin.svg"></img>
          <h2>Let's get to know you!</h2>
          <h2>Please answer all questions before submitting</h2>
        </div>
        <div className="boxed">
          <br></br>
          <br></br>
          {this.state.questionBank.length > 0 &&
            this.state.questionBank.map(({ question, answers, questionId }) => (
              <div>
                <QuestionBox
                  question={question}
                  options={answers}
                  ID={questionId}
                  key={questionId}
                  selected={(answer) => this.storeAnswer(answer, questionId)}
                />
                <br></br>
              </div>
            ))}
        </div>
        <br></br>
        <button class="submitButton" onClick={this.handleSubmit}>
          Get Started!
        </button>
        <h4 class="err">{this.state.error}</h4>
      </div>
    );
  }
}

export default withRouter(Questionnaire);
