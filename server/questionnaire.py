import mysql.connector
from mysql.connector import errorcode
from connect import connectToDB

def addQuestionnaire(response, id):
    try:
        connection = connectToDB()
        if (connection != False):
            cursor = connection.cursor(buffered=True)
            if(checkResponse(id,cursor)):
                return{"response":"Success"}
            sql = '''INSERT INTO Questionnaire(userId, response1, response2, response3, response4, response5, response6, response7, response8, response9, response10, response11, response12, response13, response14, response15, response16)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s,%s, %s, %s, %s, %s, %s, %s, %s, %s);'''
            values = (id, response[0], response[1], response[2], response[3], response[4], response[5], response[6], response[7], response[8],
                    response[9], response[10], response[11], response[12], response[13], response[14], response[15])
            cursor.execute(sql, values)
            connection.commit()
            cursor.close()
            return {"response":"Success"}


    except mysql.connector.Error as err:
        return {"response": err.msg}

    return {"response": "Something went wrong with receiving the questionnaire responses"}

def checkResponse(id, cursor):
    checkResponseQuery = 'SELECT * FROM Questionnaire WHERE userId= "' +id+'"'
    cursor.execute(checkResponseQuery)
    if(cursor.rowcount >0):
        return True
    return False
def editQuestionnaire(response, id):
    try:
        connection = connectToDB()
        if (connection != False):
            cursor = connection.cursor(buffered=True)

            sql = '''UPDATE Questionnaire SET response1 = %s, response2 = %s, response3 = %s, response4 = %s, response5 = %s, response6 = %s, \
                    response7 = %s, response8 = %s, response9 = %s, response10 = %s, response11 = %s, response12 = %s, response13 = %s, response14 = %s, \
                    response15 = %s, response16 = %s \
                    WHERE userId = %s;'''
            values = (response[0], response[1], response[2], response[3], response[4], response[5], response[6], response[7], response[8],
                    response[9], response[10], response[11], response[12], response[13], response[14], response[15], id)
            cursor.execute(sql, values)
            connection.commit()
            cursor.close()
            return {"response":"Success"}

    except mysql.connector.Error as err:
        return {"response": err.msg}

    return {"response": "Something went wrong with updating the questionnaire responses"}
