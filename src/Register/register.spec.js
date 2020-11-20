import React from 'react';
import Register from './Register'
import "@testing-library/jest-dom/extend-expect";
import {BrowserRouter as Router} from 'react-router-dom';
import { render, fireEvent, act, getByPlaceholderText, getByTestId } from '@testing-library/react';

const testCheckPasswords = jest.fn((password,confirmPassword)=> {
    if (password.length === 0) {
      alert("Please add password");
      return false;
    } else if (confirmPassword !== password) {
      alert("Please make sure passwords match");
      return false;
    }
    return true;
  }
)
describe('Register',()=>{
    describe("check passwords inputted",()=>{
        it('input blank passwords', async ()=>{            
            const text=testCheckPasswords("","")
            expect(text).toBe(false);
        })
        it('input invalid passwords', async ()=>{            
            const text=testCheckPasswords("test","test1")
            expect(text).toBe(false);
        })
        it('input valid passwords', async()=>{
            const text=testCheckPasswords("test","test")
            expect(text).toBeTruthy()
        })
    })
    describe("with valid inputs",()=>{
        it('calls the onSubmit', async ()=>{            
            const mockOnSubmit=jest.fn()
            const{getByTestId}=render(<form onSubmit={mockOnSubmit} data-testid="form"/>)      

            await act(async ()=>{
                fireEvent.submit(getByTestId('form'))
            })
            expect(mockOnSubmit).toHaveBeenCalledTimes(1)
        })
    })

    describe("updates the state",()=>{
        it('changing values', async ()=>{            
            const{getByPlaceholderText}=render(
                <Router>
                    <Register/>
                </Router>
            )
            const email = getByPlaceholderText("Email Address")
            const pw=getByPlaceholderText("Enter password")
            const checkpw =getByPlaceholderText("Re-enter password")

            await act(async () =>{
                fireEvent.change(email,{target:{value:"email@test.com"}})
                fireEvent.change(pw,{target:{value:"test"}})
                fireEvent.change(checkpw,{target:{value:"test"}})
            })

            expect(email.value).toBe("email@test.com")
            expect(pw.value).toBe("test")
            expect(checkpw.value).toBe("test")
        })
    })

})