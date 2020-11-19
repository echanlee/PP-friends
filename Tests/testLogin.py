import unittest
from server.login import loginUser

class TestLogin(unittest.TestCase):
    def test_blank_email_blank_password(self):
        email = ''
        password=''
        exp_login = {"response": "No account with that Email"}
        login = loginUser(email,password)
        self.assertEqual(exp_login, login)
    
    def test_blank_email_invalid_password(self):
        email = ''
        password= '-1'
        exp_login = {"response": "No account with that Email"}
        login = loginUser(email,password)
        self.assertEqual(exp_login, login)
    
    def test_blank_email_valid_password(self):
        email = ''
        password= 'test'
        exp_login = {"response": "No account with that Email"}
        login = loginUser(email,password)
        self.assertEqual(exp_login, login)

    def test_invalid_email_blank_password(self):
        email = '-1'
        password= ''
        exp_login = {"response": "No account with that Email"}
        login = loginUser(email,password)
        self.assertEqual(exp_login, login)
    
    def test_invalid_email_invalid_password(self):
        email = '-1'
        password= '-1'
        exp_login = {"response": "No account with that Email"}
        login = loginUser(email,password)
        self.assertEqual(exp_login, login)

    def test_invalid_email_valid_password(self):
        email = '-1'
        password= 'test'
        exp_login = {"response": "No account with that Email"}
        login = loginUser(email,password)
        self.assertEqual(exp_login, login)

    def test_valid_email_blank_password(self):
        email = 'nadine@gmail.com'
        password= ''
        exp_login = {"response": "Incorrect Password"}
        login = loginUser(email,password)
        self.assertEqual(exp_login, login)

    def test_valid_email_invalid_password(self):
        email = 'nadine@gmail.com'
        password= '-1'
        exp_login = {"response": "Incorrect Password"}
        login = loginUser(email,password)
        self.assertEqual(exp_login, login)

    def test_valid_email_valid_password(self):
        email = 'test@test.com'
        password= 'password'
        exp_login = {"response": "Success","id":16}
        login = loginUser(email,password)
        self.assertEqual(exp_login, login)

if __name__ == '__main__':
    unittest.main()