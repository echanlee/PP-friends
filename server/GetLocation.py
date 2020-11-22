import mysql.connector
from mysql.connector import errorcode
from connect import connectToDB

def getLocation(userID, longitude, latitude):
    try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)
            updateLocationSql = "UPDATE Users SET longitude = %s , latitude = %s WHERE id = %s"
            
            values = (longitude, latitude, userID,)

            cursor.execute(updateLocationSql, values)

            connection.commit()
            cursor.close()
            return {"response": "Success"}

    except mysql.connector.Error as err:

        return {"response": err.msg}

    return {"response": "Something went wrong with getting user location"}
