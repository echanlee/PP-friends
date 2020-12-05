import "@testing-library/jest-dom/extend-expect";

const testCompletedInput = jest.fn((inputs)=>{
    for(var i =0; i <inputs.length; i++) {
      if(!inputs[i])
        return false;
    }
    return true;
});

const testCheckPasswords = jest.fn((inputs) => {
    const newPassword = inputs[1];
    const confirmPassword = inputs[2];
    const oldPassword = inputs[0];
    if (newPassword.length === 0) {
      alert("Please add password");
      return false;
    } else if (confirmPassword != newPassword) {
      alert("Please make sure the new passwords match");
        
      return false;
    } else if ((confirmPassword == newPassword) && (newPassword == oldPassword)){
        alert("Your new password is the same as your old password")
        return false;
    }
    return true;
});

describe('Update Password',()=>{
    describe("with valid inputs",()=>{
        it('completed input returns true', async ()=>{
            const inputs = ['old_pw', 'new_pw', 're-entered_new_pw'];
            expect(testCompletedInput(inputs)).toBeTruthy
        })
    })
    describe("with incomplete inputs",()=>{
        it('incompleted input returns false', async ()=>{
            const inputs = ['old_pw', 'new_pw', ''];
            expect(testCompletedInput(inputs)).toBe(false)
        })
    })
    describe("check passwords",()=>{
        it('blank passwords', async ()=>{            
            const text=testCheckPasswords("","", "")
            expect(text).toBe(false);
        })
        it('unmatched new passwords', async ()=>{            
            const text=testCheckPasswords("test","test1", "abc")
            expect(text).toBe(false);
        })
        it('same old and new passwords', async ()=>{            
            const text=testCheckPasswords("test","test", "test")
            expect(text).toBe(false);
        })
        it('valid entry', async()=>{
            const text=testCheckPasswords("test", "abc", "abc")
            expect(text).toBeTruthy()
        })
    })
})