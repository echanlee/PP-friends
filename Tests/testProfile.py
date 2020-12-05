import unittest
from server.profile import getProfile
from server.matches import matchUser

class TestProfile(unittest.TestCase):
    def test_get_valid_profile(self):
        userId = 11
        exp_profile = {"response": "Success", "name": 'Melody Lui', "age": 23,\
                 "bio": 'I love coding :)', "birthday":'1997-04-01', "gender": 'Female', "education": 'Student',\
                      "interests": 'Coding', "genderPreference": 'Female', "maxDistance": 243
                      }
        profile = getProfile(userId)
        self.assertEqual(exp_profile, profile)

    def test_get_invalid_profile(self):
        userId = -1
        exp_profile = {"response": "invalid userId"}
        profile = getProfile(userId)
        self.assertEqual(exp_profile, profile)

    def test_get_profile_with_picture(self):
        userId = 181
        exp_profile = {"response": "Success", "name": 'Potato', "age": 21,\
                 "bio": 'I really love the potatoes ', "birthday":'1999-09-09', "gender": 'Female', "education": 'Potato University',\
                      "interests": 'Eating potatoes', "genderPreference": 'Both', "maxDistance": 235, \
                        "profilePicture" : "profilePictures/e4f5d6b30e8241b5a1241fd98137560d.png",
                      }
        profile = getProfile(userId)
        self.assertEqual(exp_profile, profile)

    def test_get_profile_without_picture(self):
        userId = 180
        exp_profile = {"response": "Success", "name": 'test', "age": 30,\
                 "bio": 'test', "birthday":'1990-01-01', "gender": 'Female', "education": 'test',\
                      "interests": 'test', "genderPreference": 'Female', "maxDistance": 10, \
                        "profilePicture" : None,
                      }
        profile = getProfile(userId)
        self.assertEqual(exp_profile, profile)

if __name__ == '__main__':
    unittest.main()