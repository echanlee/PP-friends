import mysql.connector
from mysql.connector import errorcode
from connect import connectToDB
from datetime import date


def updateProfile(name, birthday_yr, birthday_mo, birthday_dt, bio, gender, education, interests, genderPreference, id):
    try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)

            sql = '''INSERT INTO Profile (userId, firstname,description, gender, workplace, interests, genderPreference, Birthday) 
                VALUES (%s, %s, %s,%s,%s,%s,%s, %s);'''
            
            birthday = date(int(birthday_yr), int(birthday_mo), int(birthday_dt))
            values = (id, name, bio, gender, education,
                      interests, genderPreference, birthday)
            cursor.execute(sql, values)

            today = date.today()
            age = today.year - birthday.year
            if today.month < birthday.month or (today.month == birthday.month and today.day < birthday.day):
                age -= 1

            UpdateAgeQuery = "UPDATE Profile SET Age = %s WHERE userId = %s"
            UpdateAge = (age, id,)
            cursor.execute(UpdateAgeQuery, UpdateAge)

            connection.commit()
            cursor.close()
            return {"response": "Success"}

    except mysql.connector.Error as err:
        return {"response": err.msg}

    return {"response": "Something went wrong creating profile"}