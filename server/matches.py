import mysql.connector
from mysql.connector import errorcode
from connect import connectToDB

def matchUser(userId):
    try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)
            sql = "SELECT firstname from Profile where userId in (SELECT distinct shownUser from PotentialMatch where currentUser = %s and matchDecision = True)"
            cursor.execute(sql, (int(userId),))
            result = [pos[0] for pos in cursor.fetchall()]
            return {"response": "Success",
            "potentialUserIds": result}


    except mysql.connector.Error as err:
        return {"response": err.msg }

    