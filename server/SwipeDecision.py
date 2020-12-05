import mysql.connector
from mysql.connector import errorcode
from connect import connectToDB
from potentialMatch import findPotentialMatches 


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

            connection.commit()
            cursor.close()
            return {"response": "Success", 
            "potentialListId": potentialListId}
    
    except mysql.connector.Error as err:
        return {"response": err.msg }

    return{"response": "Something went wrong"}

def calculateDistance(long1, lat1, long2, lat2):
    p = pi/180
    a = 0.5 - cos((lat2-lat1)*p)/2 + cos(lat1*p) * cos(lat2*p) * (1-cos((long2-long1)*p))/2
    distance = 12742 * asin(sqrt(a))
    return distance

def getMatchWithinMaxDistance(potentialMatchList, currentUserLongitude, currentUserLatitude, currentUserMaxDistance):
    newPotentialMatchList = []

    for pmatch in range(len(potentialMatchList)):
        if(potentialMatchList[pmatch][1] != None):
            potentialMatchLongitude = float(potentialMatchList[pmatch][1])
            potentialMatchLatitude = float(potentialMatchList[pmatch][2])
            potentialMatchMaxDistance = float(potentialMatchList[pmatch][3])

            distance = calculateDistance(potentialMatchLongitude, potentialMatchLatitude,currentUserLongitude, currentUserLatitude)
    
            if ((distance <= currentUserMaxDistance) and (distance <= potentialMatchMaxDistance)):
                newPotentialMatchList.append(potentialMatchList[pmatch][0])     
        else:
            newPotentialMatchList.append(potentialMatchList[pmatch][0])

    return newPotentialMatchList

def showProfile(shownUserId):
    try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)
            shownUserProfileQuery = "SELECT firstname, interests, description, age, gender, workPlace, picture FROM Profile WHERE userId = %s"
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
                profile = row[6]
                
            connection.commit()
            cursor.close()

            return {"response": "Success", 
            "firstName": firstName, 
            "interests": interests, 
            "description": description, 
            "age": age, 
            "gender": gender,
            "workPlace": workPlace,
            "profilePicture": profile}
    
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