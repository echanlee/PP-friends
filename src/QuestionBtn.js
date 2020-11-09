import React, {useState} from "react";

const QuestionBox = ({question, options, ID, selected}) => {
  return (
    <div>
      <div >{ID}. {question}</div>
      {options.map((text, index) => (
        <p>
        <input type="radio" value={text} name={ID} onClick={() =>{
          selected(index);
        }}/>
          {text}
        </p>
      ))}
    </div>
  )
}


export default QuestionBox;
