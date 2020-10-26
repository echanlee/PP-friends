import mysql.connector
from mysql.connector import errorcode
from connect import connectToDB


def insertConvo(userOne, userTwo):
    try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)
            sql = "IF EXISTS (SELECT * from PotentialMatch p1 where \
                (currentUser = %s and matchDecision = 1 and potentialUser = %s) AND \
                    (SELECT * from PotentialMatch p2 where currentUser = %s and matchDecision = 1 and potentialUser = %s) \
                    THEN (INSERT INTO Conversation (userOne, userTwo) VALUES (%s, %s), INSERT INTO Conversation (userTwo, userOne) Values (%s, %s))"
            cursor.execute(sql, (userOne, userTwo, userTwo, userOne, userOne, userTwo, userTwo, userOne, ))
            return


    except mysql.connector.Error as err:
        return {"response": err.msg }

def matchUser(userId):
    try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)
            sql = "SELECT firstname from Profile where userId in \
                (SELECT distinct userTwo from Conversation where userOne = %s)"
            cursor.execute(sql, (int(userId),))
            result = [pos[0] for pos in cursor.fetchall()]
            return {"response": "Success",
            "potentialUserIds": result}


    except mysql.connector.Error as err:
        return {"response": err.msg }

    