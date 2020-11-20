import React from 'react';
import EditProfile from './EditProfile'
import "@testing-library/jest-dom/extend-expect";
import {BrowserRouter as Router} from 'react-router-dom';
import { render, fireEvent, act, getByPlaceholderText, getByTestId } from '@testing-library/react';

const completedInput = jest.fn((inputs)=>{
    for(var i =0; i <inputs.length; i++) {
      if(!inputs[i])
        return false;
    }
    return true;
});

const checkAge = jest.fn((birthday)=>{
    const bday = new Date(birthday)
    var today = new Date();
    var age = today.getFullYear() - bday.getFullYear()
    if (today.getMonth() < bday.getMonth() || (today.getMonth() === bday.getMonth() && today.getDate < bday.getDate())){
      age -= 1
    }
      
    if (age < 18) {
      return "You need to be above 18 to register";
    } else if (age > 100) {
      return "Please make sure you have entered a valid birthday";
    } else if (age >= 18 && age <= 100){
    } else {
      return"Please input valid birthday";
    }
    return age
})

describe('Edit Profile',()=>{
    describe("with valid inputs",()=>{
        it('completed input returns true', async ()=>{
            const inputs = ['Test Name', '1998-01-01', 'bio', 'Female', 'Both', 'education', 'interests'];
            expect(completedInput(inputs)).toBeTruthy
        })
    })
    describe("with incomplete inputs",()=>{
        it('incompleted input returns false', async ()=>{
            const inputs = ['Test Name', '1998-01-01', 'bio', 'Female', 'Both', 'education', ''];
            expect(completedInput(inputs)).toBe(false)
        })
    })
    describe("with incomplete inputs",()=>{
        it('incompleted input returns false', async ()=>{
            const inputs = ['Test Name', '1998-01-01', 'bio', 'Female', 'Both', 'education', ''];
            expect(completedInput(inputs)).toBe(false)
        })
    })
    describe("check age",()=>{
        it('less than 18 returns error', async ()=>{
            //less than 18
            const error="You need to be above 18 to register"
            expect(checkAge("2020-01-01")).toBe(error)
        })
        it('above 100 returns error', async ()=>{
            //above 100
            const error="Please make sure you have entered a valid birthday"
            expect(checkAge("1900-01-01")).toBe(error)
        })
    })
})