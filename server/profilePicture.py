import os, uuid
import mysql.connector
from mysql.connector import errorcode
from server.connect import connectToDB

def saveImage(image, userId, newUser = False):
    if(image.filename != ''):
        if not newUser:
            deletePreviousImage(userId)
        filename = uuid.uuid4().hex 
        extension = os.path.splitext(image.filename)[1]
        fullname= filename + extension
        image.save(os.path.join("../public/profilePictures", fullname))
        return "profilePictures/"+fullname
    return None

def deletePreviousImage(userId):
    try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)
            sql = f"SELECT picture FROM Profile WHERE userId = {userId}"
            cursor.execute(sql)
            result = cursor.fetchone()[0]
            connection.commit()
            if result is not None:
                os.remove("../public/"+result)
            return None
    except mysql.connector.Error as err:

        return {"response": err.msg }

    print("FUck")
    