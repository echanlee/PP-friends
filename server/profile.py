import mysql.connector
from mysql.connector import errorcode
from connect import connectToDB


def createProfile(name, age, bio, gender, education, interests, genderPreference, maxDistance, id):
    try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)

            sql = '''INSERT INTO Profile (userId, firstname, age, description, gender, \
                workplace, interests, genderPreference, maxDistance) 
                VALUES (%s, %s, %s,%s,%s,%s,%s, %s, %s);'''
            values = (id, name, age, bio, gender, education,
                      interests, genderPreference, maxDistance)
            cursor.execute(sql, values)
            connection.commit()
            cursor.close()
            return {"response": "Success"}

    except mysql.connector.Error as err:
        return {"response": err.msg}

    return {"response": "Something went wrong creating profile"}

def updateProfile(name, age, bio, gender, education, interests, genderPreference, maxDistance, id):
    try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)
            sql = '''UPDATE Profile SET firstname = %s, age = %s, description = %s, gender = %s, \
                workplace = %s, interests = %s, genderPreference = %s, maxDistance = %s \
                 WHERE userId = %s;'''
            values = (name, age, bio, gender, education,
                      interests, genderPreference, maxDistance, id)
            cursor.execute(sql, values)
            connection.commit()
            cursor.close()
            return {"response": "Success"}

    except mysql.connector.Error as err:
        print("update profile got errro")
        return {"response": err.msg}

    return {"response": "Something went wrong creating profile"}

def getProfile(id):
    try:
        connection = connectToDB()
        print('get profile')
        if(connection != False):
            print('me here')
            cursor = connection.cursor(buffered=True)
            sql = 'SELECT firstname, age, description, gender, workplace, interests, genderPreference, maxDistance \
                FROM Profile where userId = %s'
            cursor.execute(sql, (id,))
            result = cursor.fetchone()
            print(result)
            d = {"response": "Success", "name": result[0], "age": result[1],\
                 "bio": result[2], "gender": result[3], "education": result[4],\
                      "interests": result[5], "genderPreference": result[6], "maxDistance": result[7]}
            connection.commit()
            cursor.close()
            print(d)
            return d

    except mysql.connector.Error as err:
        return {"response": err.msg}

    return {"response": "Something went when fetching profile data"}
