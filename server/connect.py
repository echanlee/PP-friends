import mysql.connector
from mysql.connector import errorcode

def connectToDB():
    try:
        connection = mysql.connector.connect(
            host="mansci045.uwaterloo.ca",
            database="testing",
            user="developer",
            password="Temp1234"
        )
        if connection.is_connected():
            return connection
        return False
    except:
        return False
    