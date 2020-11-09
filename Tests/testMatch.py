import unittest
from server.profile import getProfile
from server.matches import matchUser

class TestMatch(unittest.TestCase):
    def test_get_matched_user(self):
        userId = 12
        exp_d = {"response": "Success", "userIds": [11], "firstnames": ["melo2"], "currentName": "melo3"}
        d = matchUser(userId)
        self.assertEqual(exp_d, d)
        
    def test_get_matched_user_empty(self):
        userId = 41
        exp_d = {"response": "Success", "userIds": [], "firstnames": [], "currentName": "melo6"}
        d = matchUser(userId)
        self.assertEqual(exp_d, d)

    def test_get_matched_user_multiple(self):
        userId = 11
        exp_d = {"response": "Success", "userIds": [12, 10], "firstnames": ["melo3","melo"], "currentName": "melo2"}
        d = matchUser(userId)
        self.assertEqual(exp_d, d)

if __name__ == '__main__':
    unittest.main() 