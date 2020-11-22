import mysql.connector
from mysql.connector import errorcode
from connect import connectToDB

def sameEmail(userID, newEmail, cursor):
    getOldEmailQuery = "SELECT email FROM Users WHERE id = %s"

    cursor.execute(getOldEmailQuery, (userID,))

    result = cursor.fetchone()[0]

    if(result == newEmail):
        return True
    return False

def invalidEmail(email, cursor): 
    checkEmailQuery = 'SELECT * FROM Users WHERE email = "'+ email +'"'
    cursor.execute(checkEmailQuery)
    if(cursor.rowcount > 0):
        return True
    return False

def updateEmail(userID, newEmail):
    try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)

            if(sameEmail(userID, newEmail, cursor)):
                return{"response": "New email is the same as old email in use"}

            elif(invalidEmail(newEmail, cursor)):
                return {"response": "Email address is already in use"}
                
            updateEmailSql = "UPDATE Users SET email = %s WHERE id = %s"
            values = (newEmail, userID, )
            cursor.execute(updateEmailSql, values)
            connection.commit()
            cursor.close()
            return {"response": "Success"}

    except mysql.connector.Error as err:
        return {"response": err.msg}

    return {"response": "Something went wrong updating email"}
