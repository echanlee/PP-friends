import React, {useState} from "react";

const QuestionBox = ({question, options, ID, selected}) => {
  const [answer, setAnswer] =useState(options);
  return (
    <div >
      <div >{ID}. {question}</div>
      {answer.map((text, index) => (
        <button className = "answerBtn" key={index} onClick={() =>{
          setAnswer([text]);
          selected([index]);
        }}>
          {text}
        </button>
      ))}
    </div>
  )
}


export default QuestionBox;
