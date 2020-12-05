import unittest
from server.matches import matchUser, getNotMessagedUsers, getMessagedUsers, unmatch, undo_unmatch
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
        exp_res = ([133, 134], ['testmelo2', 'testmelo3'])
        res = getNotMessagedUsers(userId, cursor)
        self.assertEqual(exp_res, res)
    
    def test_getMessagedUsers_not_exist(self):
        connection = connectToDB()
        cursor = connection.cursor(buffered=True)
        userId = 134
        exp_res = ([], [])
        res = getNotMessagedUsers(userId, cursor)
        self.assertEqual(exp_res, res)

    # testing result of unmatching with users current users has not messaged yet
    def test_unmatch_not_messaged(self):
        userOne = 148
        userTwo = 166
        exp_res = {'response': 'Success', 'userIds': [], 'currentName': 'die', 'notMessagedUserIds': [], 'messagedUserIds': [], 'notMessagedUserNames': [], 'messagedUserNames': [], 'messageIds': [], 'messageSender': [], 'messageContent': [], 'timeStamp': []}
        res = unmatch(userOne, userTwo)
        self.assertEqual(exp_res, res)
        undo_unmatch(userOne, userTwo)

    # testing result of unmatching with users current users has already messaged
    def test_unmatch_messaged(self):
        userOne = 239
        userTwo = 240
        exp_res = {'response': 'Success', 'userIds': [], 'currentName': 'testmelo5', 'notMessagedUserIds': [], 'messagedUserIds': [], 'notMessagedUserNames': [], 'messagedUserNames': [], 'messageIds': [], 'messageSender': [], 'messageContent': [], 'timeStamp': []}
        res = unmatch(userOne, userTwo)
        self.assertEqual(exp_res, res)
        undo_unmatch(userOne, userTwo)

    # testing unmatching with users current user has already unmatched with
    def test_unmatch_already_unmatched(self):
        userOne = 11
        userTwo = 220
        exp_res = {'response': 'Success', 'userIds': [12, 10], 'currentName': 'Melody Lui', 'notMessagedUserIds': [], 'messagedUserIds': [12, 10], 'notMessagedUserNames': [], 'messagedUserNames': ['Melody the 3rd', 'Santa Claus'], 'messageIds': [745, 542], 'messageSender': [12, 11], 'messageContent': ['test @11:51', 'v sad'], 'timeStamp': [datetime.datetime(2020, 12, 5, 16, 51, 59), datetime.datetime(2020, 12, 5, 3, 28, 19)]}
        res = unmatch(userOne, userTwo)
        self.assertEqual(exp_res, res)
        undo_unmatch(userOne, userTwo)

    # testing unmatching with users the current user has never matched with
    def test_unmatch_not_matched(self):
        userOne = 10
        userTwo = 220
        exp_res = {'response': 'Success', 'userIds': [11], 'currentName': 'Santa Claus', 'notMessagedUserIds': [], 'messagedUserIds': [11], 'notMessagedUserNames': [], 'messagedUserNames': ['Melody Lui'], 'messageIds': [543], 'messageSender': [11], 'messageContent': ['v sad'], 'timeStamp': [datetime.datetime(2020, 12, 5, 3, 28, 19)]}
        res = unmatch(userOne, userTwo)
        self.assertEqual(exp_res, res)

if __name__ == '__main__':
    unittest.main()