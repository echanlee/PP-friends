import mysql.connector
from mysql.connector import errorcode
from connect import connectToDB

def findPotentialMatches(id):
    try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)
            
            genderPreference = getGenderPreference(id, cursor, connection)
            if genderPreference == "":
                return {"response": "No Matches", "id": id, "Number of Matches": 0}

            potentialIds = getPotentialIds(id, genderPreference, cursor, connection)
            if len(potentialIds) == 0:
                return {"response": "No Matches", "id": id, "Number of Matches": 0}

            responses = getQuestionnaireResponses(potentialIds, cursor, connection)
            if len(responses) == 0:
                return {"response": "No Matches", "id": id, "Number of Matches": 0}

            matchList = getPotentialMatches(id, responses, cursor, connection, 0.8)
            if len(matchList) == 0:
                return {"response": "No Matches", "id": id, "Number of Matches": 0}

            sql = "INSERT INTO PotentialMatch (currentUser, shownUser) VALUES (%s, %s)"
            values = matchList

            cursor.executemany(sql, values)
            connection.commit()
            cursor.close()

            return {"response": "Success", "numOfMatches":len(matchList)}
    
    except mysql.connector.Error as err: 
        return {"response": err.msg}

    #error handling in case there are no questionnaire entries in the database for a user
    except TypeError: 
        return {"response": "Questionnaire was not filled out", "id": id, "Number of Matches": 0}

    return {"response": "Something went wrong"}

def getGenderPreference(id, cursor, connection):
    sql = f"SELECT genderPreference FROM Profile Where userId = {id};"
    cursor.execute(sql)

    if (cursor.rowcount <1):
        return ""
    genderPreference = cursor.fetchone()
    return genderPreference[0]

def getPotentialIds(id, genderPreference, cursor, connection):
    if (genderPreference == "Both"):
        sql = f"SELECT userId FROM Profile Where userId <> {id};"
        cursor.execute(sql)
    else:
        sql = "SELECT userId FROM Profile Where gender = %s AND userId <> %s;"
        values = (genderPreference, id)
        cursor.execute(sql, values)

    idList = [ids[0] for ids in cursor.fetchall()]
    return idList

def getQuestionnaireResponses(idList, cursor, connection):
    #a tuple containing multiple values must be comma separated for the DBAPI paramstyle in python
    formattedList = ','.join(map(str, idList))
    sql = f"SELECT * FROM Questionnaire where userId IN ({formattedList})" 
    cursor.execute(sql)

    responseTuple = cursor.fetchall()
    return responseTuple

#uses a threshold of 80% compatibility to determine a match
def getPotentialMatches(id, responses, cursor, connection, compatibilityThreshold):
    sql = f"SELECT * FROM Questionnaire where userId = {id}"
    cursor.execute(sql) 

    currentUserResponse = cursor.fetchone()
    matchList = []
    for response in responses:
        compatibilityPercentage = 0
        for i in range (1, len(currentUserResponse)):
            if response[i] == currentUserResponse[i]:
                compatibilityPercentage += 1
        
        #appends tuple of current user and matched user 
        if (compatibilityPercentage/(len(currentUserResponse) - 1)) >= compatibilityThreshold:
            matchList.append((currentUserResponse[0], response[0]))

    return matchList