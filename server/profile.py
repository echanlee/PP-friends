import mysql.connector
from mysql.connector import errorcode
from connect import connectToDB
from datetime import date


def updateProfile(name, birthday, bio, gender, education, interests, genderPreference, id, age):
    try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)

            sql = '''INSERT INTO Profile (userId, firstname,description, gender, workplace, interests, genderPreference, Birthday, age) 
                VALUES (%s, %s, %s,%s,%s,%s,%s, %s, %s);'''
            
            values = (id, name, bio, gender, education,
                      interests, genderPreference, birthday, age)
            cursor.execute(sql, values)

            connection.commit()
            cursor.close()
            return {"response": "Success"}

    except mysql.connector.Error as err:
        return {"response": err.msg}

    return {"response": "Something went wrong creating profile"}