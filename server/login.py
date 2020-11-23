import mysql.connector
from mysql.connector import errorcode
from server.connect import connectToDB

def loginUser(email, password):
    try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)

            if(invalidEmail(email, cursor, connection)):
                return {"response": "No account with that Email"}
            
            userId = getId(email, password, cursor, connection)
            connection.commit()
            cursor.close()
            if(userId == -1):
                return {"response": "Incorrect Password"}

            return {"response": "Success",
                    "id": userId}
            # need to return ID
    except mysql.connector.Error as err:
        return {"response": err.msg }
    
    return {"response": "Something went wrong"}


def invalidEmail(email, cursor, connection): 
    checkEmailQuery = 'SELECT * FROM Users WHERE email = "'+ email +'"'
    cursor.execute(checkEmailQuery)
    if(cursor.rowcount == 1):
        return False
    return True

def getId(email, password, cursor, connection): 
    sql = "SELECT id FROM Users WHERE email = %s AND password = %s;"
    values = (email, password)    
    cursor.execute(sql, values)
    
    if(cursor.rowcount <1):
        return -1
    userId = cursor.fetchone()
    return userId[0]