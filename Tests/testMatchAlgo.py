import unittest
from server.potentialMatch import *
from server.connect import connectToDB

class TestMatchingAlgorithm(unittest.TestCase):
    #testing existing match method for cases where it returns output vs no output
    def test_existing_matches(self):
        connection = connectToDB()
        cursor = connection.cursor(buffered=True)
        userId = 20
        exp_res = ([18, 19, 18, 19])
        res = findExistingMatches(cursor, userId)
        self.assertEqual(exp_res, res)

    def test_no_existing_matches(self):
        connection = connectToDB()
        cursor = connection.cursor(buffered=True)
        userId = 1
        exp_res = ([])
        res = findExistingMatches(cursor, userId)
        self.assertEqual(exp_res, res)

    #functionality test for gender preference method
    def test_get_both_gender_preference(self):
        connection = connectToDB()
        cursor = connection.cursor(buffered=True)
        userId = 6
        exp_res = 'Both'
        res = getGenderPreference(userId, cursor, connection)
        self.assertEqual(exp_res, res)
    
    def test_get_male_gender_preference(self):
        connection = connectToDB()
        cursor = connection.cursor(buffered=True)
        userId = 17
        exp_res = 'Male'
        res = getGenderPreference(userId, cursor, connection)
        self.assertEqual(exp_res, res)
    
    def test_get_female_gender_preference(self):
        connection = connectToDB()
        cursor = connection.cursor(buffered=True)
        userId = 7
        exp_res = 'Female'
        res = getGenderPreference(userId, cursor, connection)
        self.assertEqual(exp_res, res)
    
    #functionality test for getting potential ID based on preference method
    def test_get_potential_ids_male_genderPreference(self):
        connection = connectToDB()
        cursor = connection.cursor(buffered=True)
        userId = 17
        genderPreference = 'Male'
        exp_res = ([15, 18, 19, 20, 22, 23, 39, 72, 73, 74, 75, 76, 91, 113, 144, 146, 150, 151, 161, 202, 237])
        res = getPotentialIds(userId, genderPreference, cursor, connection)
        self.assertEqual(exp_res, res)

    #testing questionnaire responses for single, multiple and user with no questionnaire answered
    def test_get_questionnaire_responses(self):
        connection = connectToDB()
        cursor = connection.cursor(buffered=True)
        userId = [7]
        exp_res = [(7,'1','0','0','0','0','0','0','0','0','1','1','0','0','0','0','0')]
        res = getQuestionnaireResponses(userId, cursor, connection)
        self.assertEqual(exp_res, res)

    def test_get_questionnaire_responses_multiple(self):
        connection = connectToDB()
        cursor = connection.cursor(buffered=True)
        userId = [7,8]
        exp_res = [(7,'1','0','0','0','0','0','0','0','0','1','1','0','0','0','0','0'),
                    (8,'0','0','0','0','0','0','1','0','1','1','0','0','0','1','0','1')]
        res = getQuestionnaireResponses(userId, cursor, connection)
        self.assertEqual(exp_res, res)
    
    def test_get_questionnaire_responses_none(self):
        connection = connectToDB()
        cursor = connection.cursor(buffered=True)
        userId = [0]
        exp_res = []
        res = getQuestionnaireResponses(userId, cursor, connection)
        self.assertEqual(exp_res, res)
    
    #potential matches test cases, checking when users are compatible and incompatible
    def test_get_potentialMatches_compatible(self):
        connection = connectToDB()
        cursor = connection.cursor(buffered=True)
        userId = 8
        responses = [(7,'1','0','0','0','0','0','0','0','0','1','1','0','0','0','0','0')]
        exp_res = [(8,7)]
        res = getPotentialMatches(userId, responses, cursor, connection, 0.5)
        self.assertEqual(exp_res, res)

    def test_get_potentialMatches_incompatible(self):
        connection = connectToDB()
        cursor = connection.cursor(buffered=True)
        userId = 8
        responses = [(7,'1','0','0','0','0','0','0','0','0','1','1','0','0','0','0','0')]
        exp_res = []
        res = getPotentialMatches(userId, responses, cursor, connection, 1.0)
        self.assertEqual(exp_res, res)

    def test_get_potentialMatches_multiple_compatible(self):
        connection = connectToDB()
        cursor = connection.cursor(buffered=True)
        userId = 9
        responses = [(7,'1','0','0','0','0','0','0','0','0','1','1','0','0','0','0','0'),
                    (8,'0','0','0','0','0','0','1','0','1','1','0','0','0','1','0','1')]
        exp_res = [(9,7), (9,8)]
        res = getPotentialMatches(userId, responses, cursor, connection, 0.5)
        self.assertEqual(exp_res, res)

    def test_get_potentialMatches_multiple_incompatible(self):
        connection = connectToDB()
        cursor = connection.cursor(buffered=True)
        userId = 9
        responses = [(7,'1','0','0','0','0','0','0','0','0','1','1','0','0','0','0','0'),
                    (8,'0','0','0','0','0','0','1','0','1','1','0','0','0','1','0','1')]
        exp_res = []
        res = getPotentialMatches(userId, responses, cursor, connection, 1.0)
        self.assertEqual(exp_res, res)

    #the main function itself has error handling in case of typeErrors due to users skipping the questionnaire
    def test_findMatches_emptyQuestionnaire_TypeError(self):
        userId = 6
        exp_res = {"response": "Questionnaire was not filled out", "id": 6, "Number of Matches": 0}
        res = findPotentialMatches(userId)
        self.assertEqual(exp_res, res)
if __name__ == '__main__':
    unittest.main()