import unittest
from server.profilePicture import deletePreviousImage
import os.path
from os import path

class TestProfilePicture(unittest.TestCase):
    def test_delete_previous_profile_picture(self):
        userId = 181
        image_url = "../public/profilePictures/e4f5d6b30e8241b5a1241fd98137560d.png"
        result = deletePreviousImage(userId, testing=True)
        self.assertEqual(image_url, result)


if __name__ == '__main__':
    unittest.main()