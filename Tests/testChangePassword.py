import unittest
from server.updatePassword import updatePassword

class TestPassword(unittest.TestCase):

    def test_incorrect_password(self):
        userID = 5
        oldPassword = '111'
        newPassword = '123'
        exp_pw = {"response": "Your current password is incorrect"}
        changePassword = updatePassword(userID, oldPassword, newPassword)
        self.assertEqual(exp_pw, changePassword)
    
    def test_success_change(self):
        userID = 3
        oldPassword = '123'
        newPassword = '111'
        exp_pw = {"response": "Success"}
        changePassword = updatePassword(userID, oldPassword, newPassword)
        self.assertEqual(exp_pw, changePassword)

if __name__ == '__main__':
    unittest.main()
