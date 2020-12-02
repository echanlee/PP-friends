import mysql.connector
from mysql.connector import errorcode
from connect import connectToDB
from potentialMatch import findPotentialMatches 
from math import cos, asin, sqrt, pi


def getPotentialMatchList(currentUserId):
    try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)
            findPotentialMatches(currentUserId)
            PotentialMatchQuery = "SELECT shownUser FROM PotentialMatch WHERE currentUser = %s and matchDecision IS NULL"
            userID = (currentUserId,)    
            cursor.execute(PotentialMatchQuery, userID)
            potentialListId = [i[0] for i in cursor.fetchall()]

            newPotentialMatchList = []

            if(len(potentialListId) != 0):

                findLocation = "SELECT longitude, latitude FROM Users WHERE id = %s"
                cursor.execute(findLocation, userID)
                currentUserLocation = cursor.fetchall()

                if(currentUserLocation[0][0] != None):
                    for i in currentUserLocation:
                        currentUserLongitude = float(i[0])
                        currentUserLatitude = float(i[1])

                    for pmatch in range(len(potentialListId)):
                        ID = (potentialListId[pmatch],)
                        cursor.execute(findLocation, ID)
                        potentialMatchLocation = cursor.fetchall()  

                        if(potentialMatchLocation[0][0] != None):

                            for i in potentialMatchLocation:
                                potentialMatchLongitude = float(i[0])
                                potentialMatchLatitude = float(i[1])
                                
                            p = pi/180
                            a = 0.5 - cos((currentUserLatitude-potentialMatchLatitude)*p)/2 + cos(potentialMatchLatitude*p) * cos(currentUserLatitude*p) * (1-cos((currentUserLongitude-potentialMatchLongitude)*p))/2
                            distance = 12742 * asin(sqrt(a)) 

                            findMaxDistance = "SELECT maxDistance FROM Profile WHERE userId = %s"
                            cursor.execute(findMaxDistance, userID)
                            maxDistance = cursor.fetchone()[0]

                            if (distance <= maxDistance):
                                newPotentialMatchList.append(potentialListId[pmatch])
                                
                            else:
                                pass
                        else:
                            newPotentialMatchList.append(potentialListId[pmatch])
                            
                else:
                    newPotentialMatchList = potentialListId
            else:
                newPotentialMatchList = potentialListId     
            connection.commit()
            cursor.close()
            return {"response": "Success", 
            "potentialListId": newPotentialMatchList}
    
    except mysql.connector.Error as err:
        return {"response": err.msg }

    return{"response": "Something went wrong"}

getPotentialMatchList(59)

def showProfile(shownUserId):
    try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)
            shownUserProfileQuery = "SELECT firstname, interests, description, age, gender, workPlace FROM Profile WHERE userId = %s"
            userID = (shownUserId,) 
            cursor.execute(shownUserProfileQuery, userID)
            if(cursor.rowcount<1):
                return {"response": "Error loading user profile"}
            result = cursor.fetchall()

            for row in result: 
                firstName = row[0]
                interests = row[1]
                description = row[2]
                age = row[3]
                gender = row[4]
                workPlace = row[5]
                
            connection.commit()
            cursor.close()

            return {"response": "Success", 
            "firstName": firstName, 
            "interests": interests, 
            "description": description, 
            "age": age, 
            "gender": gender,
            "workPlace": workPlace}
    
    except mysql.connector.Error as err:
        return {"response": err.msg }

    return{"response": "Something went wrong"}

def insertConvo(userOne, userTwo):
    try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)
            insertConvoRowsQuery = "INSERT INTO Conversation (userOne, userTwo) values \
                (%s, %s)"
            cursor.execute(insertConvoRowsQuery, (userOne, userTwo,))
            cursor.execute(insertConvoRowsQuery, (userTwo, userOne,))

            connection.commit()
            cursor.close()
        return
    except mysql.connector.Error as err:
        return {"response": err.msg }


def swipeDecision(currentUserId, shownUserId, userDecision):
    try:
        connection = connectToDB()
        if(connection != False):
            userDecisionCast = userDecision == 'true'
            cursor = connection.cursor(buffered=True)
            updateSwipeDecisionQuery = "UPDATE PotentialMatch SET matchDecision = %s WHERE shownUser = %s and currentUser = %s"
            insertRow = (userDecisionCast, shownUserId, currentUserId,)
            cursor.execute(updateSwipeDecisionQuery, insertRow)

            connection.commit()
            
            checkOppositeDecisionQuery = "SELECT matchDecision from PotentialMatch WHERE shownUser = %s and currentUser = %s"
            selectRow = (currentUserId, shownUserId,)
            cursor.execute(checkOppositeDecisionQuery, selectRow)
            res = cursor.fetchone()
            if res:
                res = res[0]
            else:
                res = 0

            cursor.close()
            if userDecision == 'true' and res:
                insertConvo(currentUserId, shownUserId)
        return {"response": "Success"}

    except mysql.connector.Error as err:
        return {"response": err.msg }

    return{"response": "Something went wrong"}