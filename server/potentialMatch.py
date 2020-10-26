import mysql.connector
from mysql.connector import errorcode
from connect import connectToDB

def findPotentialMatches(id):
    try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)

            genderPreference = getGenderPreference(id, cursor, connection)
            potentialIds = getPotentialIds(id, genderPreference, cursor, connection)
            responses = getQuestionnaireResponses(potentialIds, cursor, connection)
            matchList = getPotentialMatches(id, responses, cursor, connection)

            sql = "INSERT INTO PotentialMatch (currentUser, shownUser) VALUES (%s, %s)"
            values = matchList

            cursor.executemany(sql, values)
            connection.commit()
            cursor.close()

            return {"response": "Success", "numOfMatches":len(matchList)}
    
    except mysql.connector.Error as err: 
        print("sql connector issue")
        return {"response": err.msg}

    return {"response": "Something went wrong"}

def getGenderPreference(id, cursor, connection):
    sql = "SELECT genderPreference FROM Profile Where userId = %d;"
    values = (id)
    cursor.execute(sql, values)

    if (cursor.rowcount <1):
        return ""
    genderPreference = cursor.fetchone()
    return genderPreference[0]

def getPotentialIds(id, genderPreference, cursor, connection):
    sql = "SELECT userId FROM Profile Where genderPreference = %s AND userId <> %d;"
    values = (genderPreference, id)
    cursor.execute(sql, values)

    if (cursor.rowcount <1):
        return -1
    idTuple = cursor.fetchall()
    idList = []
    for id in idTuple:
        idList.append(id[0])
    return idList

def getQuestionnaireResponses(idList, cursor, connection):
    #idk if string formatting a list will work for the query, hopefully it does
    sql = "SELECT * FROM Questionnaire where userId IN %s"
    values = (idList)
    cursor.execute(sql, values)

    if (cursor.rowcount <1):
        return -1
    responseTuple = cursor.fetchall()

#uses a threshold of 80% compatibility to determine a match
def getPotentialMatches(id, responses, cursor, connection):
    sql = "SELECT * FROM Questionnaire where userId = %d"
    values = (id) 
    cursor.execute(sql, values) 

    currentUserResponse = cursor.fetchall()
    matchList = []

    for response in responses:
        compatibilityPercentage = 0
        for i in range (1,17):
            if response[i] == currentUserResponse[i]:
                compatibilityPercentage += 1
        
        #appends tuple of current user and matched user 
        if (compatibilityPercentage/16) >= 0.8:
            matchList.append((currentUserResponse[0], response[0]))

    return matchList