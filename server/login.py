import mysql.connector
from mysql.connector import errorcode
from connect import connectToDB

def loginUser(email, password):
    try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)

            if(invalidEmail(email, cursor)):
                return {"response": "No account with that Email"}
            
            if(invalidPassword(email, password)):
                return {"response": "Incorrect Password"}
            cursor.close()
        

    except mysql.connector.Error as err:
        return {"response": err.msg }

    return {"response": "Success",
            "ID": id}


def invalidEmail(email, cursor): 
    checkEmailQuery = 'SELECT * FROM Users WHERE email = "'+ email +'"'
    cursor.execute(checkEmailQuery)
    if(cursor.rowcount > 0):
        return False
    return True

def invalidPassword(email, password): 
    checkPasswordQuery = 'SELECT passowrd FROM Users WHERE email = "'+ email +'"'
    if(checkPasswordQuery== password):
        return True
    else:
        return False