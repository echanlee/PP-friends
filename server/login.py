import mysql.connector
from mysql.connector import errorcode
from connect import connectToDB

def loginUser(email, password):

    try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)
            passcursor = connection.cursor(buffered=True)

            if(invalidEmail(email, cursor)):
                return {"response": "No account with that Email"}
            
            if(invalidPassword(email, password, passcursor)):
                return {"response": "Incorrect Password"}
            cursor.close()
        
    except mysql.connector.Error as err:
        print("sql connector issue")
        return {"response": err.msg }
    
    return {"response": "Success"}


def invalidEmail(email, cursor): 
    checkEmailQuery = 'SELECT * FROM Users WHERE email = "'+ email +'"'
    cursor.execute(checkEmailQuery)
    if(cursor.rowcount == 1):
        return False
    return True

def invalidPassword(email, password, cursor): 
    checkPasswordQuery = 'SELECT password FROM Users WHERE email = "'+ email +'"'
    cursor.execute(checkPasswordQuery)
    dbPassword = cursor.fetchone()

    if(dbPassword[0] == password):
        return False
    return True