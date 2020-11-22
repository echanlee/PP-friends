import mysql.connector
from mysql.connector import errorcode
from connect import connectToDB

def updatePassword(userID, oldPassword, newPassword):
    try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)

            if(confirmOldPassword(userID, oldPassword, cursor)):
                print("test old password")
                return {"response": "Your current password is incorrect"}
                
            updatePasswordSql = "UPDATE Users SET password = %s WHERE id = %s"
            values = (newPassword, userID, )
            cursor.execute(updatePasswordSql, values)
            connection.commit()
            cursor.close()
            return {"response": "Success"}

    except mysql.connector.Error as err:
        return {"response": err.msg}

    return {"response": "Something went wrong updating password"}

def confirmOldPassword(userID, oldPassword, cursor):
    checkPasswordQuery = "SELECT password FROM Users WHERE id = %s"
    value = (userID,)
    cursor.execute(checkPasswordQuery, value)
    result = cursor.fetchone()[0]
    print(result)
    if (result != oldPassword):
        return True
    return False

    