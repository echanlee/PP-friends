import unittest
from server.profile import getProfile
from server.matches import matchUser

class TestProfile(unittest.TestCase):
    def test_get_valid_profile(self):
        userId = 11
        exp_profile = {"response": "Success", "name": 'melo2', "age": 21,\
                 "bio": 'sad', "gender": 'Female', "education": 'loo',\
                      "interests": 'sad', "genderPreference": 'Female', "maxDistance": 10
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