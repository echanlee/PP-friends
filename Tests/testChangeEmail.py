import unittest
from server.updateEmail import updateEmail

class TestEmail(unittest.TestCase):

    def test_current_email(self):
        userID = 5
        email = 'asdf@asdf'
        exp_email = {"response": "New email is the same as old email in use"}
        changeEmail = updateEmail(userID, email)
        self.assertEqual(exp_email, changeEmail)
    
    def test_in_use_email(self):
        userID = 3
        email = 'asdf@asdf'
        exp_email = {"response": "Email address is already in use"}
        changeEmail = updateEmail(userID, email)
        self.assertEqual(exp_email, changeEmail)
    
    def test_valid_email(self):
        userID = 9
        email = 'aaa@1234567'
        exp_email = {"response": "Success"}
        changeEmail = updateEmail(userID, email)
        self.assertEqual(exp_email, changeEmail)    

if __name__ == '__main__':
    unittest.main()