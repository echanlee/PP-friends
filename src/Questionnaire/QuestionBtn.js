import React from "react";
import "./Questionnaire.css";

const QuestionBox = ({ question, options, ID, selected }) => {
  return (
    <div class="questionBox">
      <div class="Questions">
        {ID}. {question}
      </div>
      {options.map((text, index) => (
        <label class="container">
          <input
            type="radio"
            value={text}
            name={ID}
            onClick={() => {
              selected(index);
            }}
          />
          {text}
          <span class="checkmark"></span>
        </label>
      ))}
    </div>
  );
};

export default QuestionBox;
