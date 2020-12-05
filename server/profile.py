import mysql.connector
from mysql.connector import errorcode
from connect import connectToDB
from datetime import date
from profilePicture import saveImage


def createProfile(name, birthday, bio, gender, education, interests, genderPreference, maxDistance, age, id, image):
    try:
        connection = connectToDB()
        if(connection != False):
            imageURL = saveImage(image, id, newUser = True)
            cursor = connection.cursor(buffered=True)
            sql = '''INSERT INTO Profile (userId, firstname,description, gender, workplace, interests, genderPreference, maxDistance, Birthday, age, picture) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);'''
            
            values = (id, name, bio, gender, education,
                      interests, genderPreference, maxDistance, birthday, age, imageURL)

            cursor.execute(sql, values)

            connection.commit()
            cursor.close()
            return {"response": "Success"}

    except mysql.connector.Error as err:
        return {"response": err.msg}

    return {"response": "Something went wrong creating profile"}

def updateProfile(name, birthday, bio, gender, education, interests, genderPreference, maxDistance, age, id, image):
    try:
        connection = connectToDB()
        if(connection != False):
            
            imageUrl = saveImage(image, id)
            cursor = connection.cursor(buffered=True)
            sql = '''UPDATE Profile SET firstname = %s, age = %s, description = %s, gender = %s, \
                workplace = %s, interests = %s, genderPreference = %s, maxDistance = %s, Birthday = %s \
                , picture = %s WHERE userId = %s;'''
            values = (name, age, bio, gender, education,
                      interests, genderPreference, maxDistance, birthday, imageUrl, id)
            cursor.execute(sql, values)
            connection.commit()
            cursor.close()
            return {"response": "Success",
                    "imageURL": imageUrl}

    except mysql.connector.Error as err:
        return {"response": err.msg}

    return {"response": "Something went wrong creating profile"}

def getProfile(id):
    try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)
            sql = 'SELECT firstname, age, description, gender, workplace, interests, genderPreference, Birthday, maxDistance, picture \
                FROM Profile where userId = %s'
            cursor.execute(sql, (id,))
            result = cursor.fetchone()
            if not result:
                return {"response": "invalid userId"}
            d = {"response": "Success", "name": result[0], "age": result[1],\
                 "bio": result[2], "gender": result[3], "education": result[4],\
                      "interests": result[5], "genderPreference": result[6], \
                       "birthday": result[7].strftime('%Y-%m-%d'), "maxDistance": result[8],\
                        "profilePicture": result[9]}
            connection.commit()
            cursor.close()
            return d

    except mysql.connector.Error as err:
        return {"response": err.msg}

    return {"response": "Something went when fetching profile data"}
