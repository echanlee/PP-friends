import mysql.connector
from mysql.connector import errorcode
from connect import connectToDB


def updateProfile(name, age, bio, gender, education, interests, genderPreference, id):
    try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)

            sql = '''INSERT INTO Profile (userId, firstname, age, description, gender, workplace, interests, genderPreference) 
                VALUES (%s, %s, %s,%s,%s,%s,%s, %s);'''
            values = (id, name, age, bio, gender, education,
                      interests, genderPreference)
            cursor.execute(sql, values)
            connection.commit()
            cursor.close()
            return {"response": "Success"}

    except mysql.connector.Error as err:
        return {"response": err.msg}

    return {"response": "Something went wrong creating profile"}
