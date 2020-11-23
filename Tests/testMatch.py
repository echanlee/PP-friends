import unittest
from server.matches import matchUser, getNotMessagedUsers, getMessagedUsers
from server.connect import connectToDB
import datetime

class TestMatch(unittest.TestCase):
    def test_get_matched_user(self):
        userId = 12
        exp_d = {'currentName': 'melo3',
                    'messageContent': ['hihi'],
                    'messageIds': [328],
                    'messageSender': [12],
                    'messagedUserIds': [11],
                    'messagedUserNames': ['Melody Lui'],
                    'notMessagedUserIds': [],
                    'notMessagedUserNames': [],
                    'response': 'Success',
                    'timeStamp': [datetime.datetime(2020, 11, 21, 15, 41, 30)],
                    'userIds': [11]}
        d = matchUser(userId)
        self.assertEqual(exp_d, d)
        
    def test_get_matched_user_empty(self):
        userId = 41
        exp_d = {'currentName': 'melo6',
                'messageContent': [],
                'messageIds': [],
                'messageSender': [],
                'messagedUserIds': [],
                'messagedUserNames': [],
                'notMessagedUserIds': [],
                'notMessagedUserNames': [],
                'response': 'Success',
                'timeStamp': [],
                'userIds': []}
        d = matchUser(userId)
        self.assertEqual(exp_d, d)

    def test_get_matched_user_multiple(self):
        userId = 11
        exp_d = {'currentName': 'Melody Lui',
                'messageContent': ['hihi', 'hi'],
                'messageIds': [329, 337],
                'messageSender': [12, 10],
                'messagedUserIds': [12, 10],
                'messagedUserNames': ['melo3', 'soysauces'],
                'notMessagedUserIds': [],
                'notMessagedUserNames': [],
                'response': 'Success',
                'timeStamp': [datetime.datetime(2020, 11, 21, 15, 41, 30),
                    datetime.datetime(2020, 11, 21, 19, 47, 43)],
                'userIds': [12, 10]}
        d = matchUser(userId)
        self.assertEqual(exp_d, d)

    def test_getNotMessagedUsers_exist(self):
        connection = connectToDB()
        cursor = connection.cursor(buffered=True)
        userId = 133
        exp_res = ([132], ['testmelo'])
        res = getNotMessagedUsers(userId, cursor)
        self.assertEqual(exp_res, res)
    
    def test_getNotMessagedUsers_not_exist(self):
        connection = connectToDB()
        cursor = connection.cursor(buffered=True)
        userId = 134
        exp_res = ([],[])
        res = getNotMessagedUsers(userId, cursor)
        self.assertEqual(exp_res, res)

    def test_getMessagedUsers_exist(self):
        connection = connectToDB()
        cursor = connection.cursor(buffered=True)
        userId = 132
        exp_res = ([133], ['testmelo2'])
        res = getNotMessagedUsers(userId, cursor)
        print(res)
        self.assertEqual(exp_res, res)
    
    def test_getMessagedUsers_not_exist(self):
        connection = connectToDB()
        cursor = connection.cursor(buffered=True)
        userId = 134
        exp_res = ([], [])
        res = getNotMessagedUsers(userId, cursor)
        self.assertEqual(exp_res, res)


if __name__ == '__main__':
    unittest.main()