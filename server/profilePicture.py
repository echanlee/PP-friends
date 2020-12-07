import os, uuid
import mysql.connector
from mysql.connector import errorcode
from server.connect import connectToDB

def saveImage(image, userId, newUser = False):
    if not newUser:
        deletePreviousImage(userId)
    if(image.filename != ''):
        filename = uuid.uuid4().hex 
        extension = os.path.splitext(image.filename)[1]
        fullname= filename + extension
        image.save(os.path.join("../public/profilePictures", fullname))
        return "profilePictures/"+fullname
    return None

def deletePreviousImage(userId, testing = False):
    try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)
            sql = f"SELECT picture FROM Profile WHERE userId = {userId}"
            cursor.execute(sql)
            result = cursor.fetchone()[0]
            connection.commit()
            if result is not None:
                if not testing:
                    try:
                        os.remove("../public/"+result)
                    except:
                        pass
                    return None
                return "../public/"+result
    except mysql.connector.Error as err:

        return {"response": err.msg }
    