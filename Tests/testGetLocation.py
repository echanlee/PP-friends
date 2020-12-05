import unittest
from server.GetLocation import getLocation

class TestLocation(unittest.TestCase):
    def test_given_location(self):
        userId = 89
        longitude = '41.2398547'
        latitude = '-72.24238327'
        exp_location = {"response": "Success"}
        location = getLocation(userId, longitude, latitude)
        self.assertEqual(exp_location, location)

if __name__ == '__main__':
    unittest.main()