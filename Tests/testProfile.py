import unittest
from server.profile import getProfile
from server.matches import matchUser

class TestProfile(unittest.TestCase):
    def test_get_valid_profile(self):
        userId = 11
        exp_profile = {"response": "Success", "name": 'Melody Lui', "age": 23,\
                 "bio": 'I love coding :)', "birthday":'1997-04-01', "gender": 'Female', "education": 'Student',\
                      "interests": 'Coding', "genderPreference": 'Female', "maxDistance": 48510
                      }
        profile = getProfile(userId)
        self.assertEqual(exp_profile, profile)

    def test_get_invalid_profile(self):
        userId = -1
        exp_profile = {"response": "invalid userId"}
        profile = getProfile(userId)
        self.assertEqual(exp_profile, profile)

if __name__ == '__main__':
    unittest.main()