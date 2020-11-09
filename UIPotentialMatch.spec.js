import React from "react";
import ReactDOM from "react-dom";
import { shallow } from "enzyme";
import { cleanup, render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

const button1 = getByTestId("letsTalkButton");
expect(button1).toHaveStyle({
  backgroundColor: "#e96a6a",
  display: "none",
});

const button2 = getByTestId("notInterestedButton");
expect(button2).toHaveStyle({
  backgroundColor: "#3680a3",
  display: "none",
});

fireEvent.mouseOver(button1);
expect(button1).toHaveStyle(`
background-color: #e25959;
color: white;
border: 3px solid;
`);

fireEvent.mouseOver(button2);
expect(button2).toHaveStyle(`
background-color: #22779e;
color: white;
border: 3px solid;`);
