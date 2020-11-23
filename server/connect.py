  
import mysql.connector
from mysql.connector import errorcode

def connectToDB():
    try:
        connection = mysql.connector.connect(
            host="35.239.244.129",
            database="ppFriends",
            user="root",
            password="Msci342!"
        )
        if connection.is_connected():
            return connection
        return False
    except Exception as e:
        return e