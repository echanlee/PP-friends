import mysql.connector
from mysql.connector import errorcode
from mysql.connector.constants import ClientFlag

config = {
    'user': 'root',
    'password': 'Msci342!',
    'host': '35.239.244.129',
    'database': 'ppFriends',
    'client_flags': [ClientFlag.SSL],
    'ssl_ca': 'ssl/server-ca.pem',
    'ssl_cert': 'ssl/client-cert.pem',
    'ssl_key': 'ssl/client-key.pem',
    'ssl_verify_cert': 'True'
}

def connectToDB():
    try:
        connection = mysql.connector.connect(**config)
        return connection
        if connection.is_connected():
            return connection
        return False
    except Exception as e:
        return str(e)
