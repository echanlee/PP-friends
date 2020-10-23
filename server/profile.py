import mysql.connector
from mysql.connector import errorcode
from connect import connectToDB


def updateProfile(username, age, bio, gender, education, interests, genderPreference):
    try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)

            sql = "INSERT INTO Profile (firstname, age, description, gender, workplace, interests, genderPreference) VALUES (%s, %s,%s,%s,%s,%s);"
            values = (username, age, bio, gender, education,
                      interests, genderPreference)
            cursor.execute(sql, values)
            id = cursor.lastrowid
            connection.commit()
            cursor.close()

    except mysql.connector.Error as err:
        return {"response": err.msg}

    return {"response": "Success",
            "ID": id}
