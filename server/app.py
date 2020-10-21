import mysql.connector

cnx = mysql.connector.connect(user='mnsison', password='Msci342!',
                              host='mansci-db.uwaterloo.ca', database='mnsison'
                              )
print("connected")
cnx.close()