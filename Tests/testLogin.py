import unittest
from server.login import loginUser

class TestLogin(unittest.TestCase):
    def test_blank_invalid_email(self):
        #email tests
        email_values=['','-1']
        #password tests
        password_values=['','-1','password']

        for i in email_values:
            for j in password_values:
                exp_login={"response":"No account with that Email"}
                login=loginUser(i,j)
                self.assertEqual(exp_login,login)

    def test_blank_invalid_password(self):
        #email tests
        email='test@test.com'
        #password tests
        password_values=['','-1']


        for j in password_values:
            exp_login={"response":"Incorrect Password"}
            login=loginUser(email,j)
            self.assertEqual(exp_login,login)

    def test_valid_email_password(self):
        #email tests
        email='test@test.com'
        #password tests
        password='password'

        exp_login={"response":"Success","id":16}
        login=loginUser(email,password)
        self.assertEqual(exp_login,login)

if __name__ == '__main__':
    unittest.main()