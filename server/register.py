import mysql.connector
from mysql.connector import errorcode
from connect import connectToDB

def registerUser(email, password):
    try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)

            if(invalidEmail(email, cursor)):
                return {"response": "Email address is already in use"}

            sql = "INSERT INTO Users (location, email, password) VALUES ('', %s, %s);"
            values = (email, password)
            cursor.execute(sql, values)
            id = cursor.lastrowid
            connection.commit()
            cursor.close()
        

    except mysql.connector.Error as err:
        return {"response": err.msg }

    return {"response": "Success",
            "ID": id}


def invalidEmail(email, cursor): 
    checkEmailQuery = 'SELECT * FROM Users WHERE email = "'+ email +'"'
    cursor.execute(checkEmailQuery)
    if(cursor.rowcount > 0):
        return True
    return False
    