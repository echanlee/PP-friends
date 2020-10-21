import mysql.connector
from mysql.connector import errorcode


def registerUser(request):
    try:
        connection = mysql.connector.connect(
            host="localhost",
            database="mnsison",
            user="mnsison",
            password="Msci342!"
        )
        email = request.form['email']
        password = request.form['password']
        cursor = connection.cursor()

        
        if(not uniqueEmail(email, cursor)):
            return {"response": "Email address is already in use"}

        sql = "INSERT INTO Users (location, email, password) VALUES ('', '%s', '%s');"
        values = (email, password)

        cursor.execute(sql, values)

        connection.commit()
        cursor.close()
        connection.close()
        

    except mysql.connector.Error as err:
        return {"response": err.msg }

    return {"response": "Success"}


def uniqueEmail(email, cursor): 
    checkEmailQuery = "SELECT * FROM Users WHERE email = '%s'"
    dataEmail = (email)
    cursor.execute(checkEmailQuery, dataEmail)
    if(cursor.rowcount != 0):
        return False
    return True
    