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
            PotentialMatchQuery = "SELECT shownUser, u.longitude, u.latitude, p.maxDistance FROM PotentialMatch pm, Users u, Profile p WHERE currentUser = %s and matchDecision IS NULL and u.id = pm.shownUser and p.userId = u.id"
            userID = (currentUserId,)    
            cursor.execute(PotentialMatchQuery, userID)
            potentialMatchList = cursor.fetchall()

            potentialListId = [i[0] for i in potentialMatchList]

            findLocation = "SELECT Users.longitude, Users.latitude, Profile.maxDistance FROM Users INNER JOIN Profile ON Users.id=Profile.userId WHERE Users.id = %s"
            cursor.execute(findLocation, userID)
            currentUserLocation = cursor.fetchone()
            if(currentUserLocation[0] != None):
                currentUserLongitude = float(currentUserLocation[0])
                currentUserLatitude = float(currentUserLocation[1])
                currentUserMaxDistance = float(currentUserLocation[2])

                if(len(potentialMatchList) != 0):
                    potentialListId = getMatchWithinMaxDistance(potentialMatchList, currentUserLongitude, currentUserLatitude, currentUserMaxDistance)  

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

def showProfile(currentUserId, shownUserId):
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
            
            #uses set intersection to compare matches of each user to get a mutual friends list
            currentUserMatchSet = getMatchIds(currentUserId, cursor, connection)
            shownUserMatchSet = getMatchIds(shownUserId, cursor, connection)
            mutualFriendIdList = currentUserMatchSet.intersection(shownUserMatchSet)

            # if the user does not have a any mutual friends, don't run the name query, and return the request
            if len(mutualFriendIdList) == 0:
                connection.commit()
                cursor.close()
                return {"response": "Success", 
                "firstName": firstName, 
                "interests": interests, 
                "description": description, 
                "age": age, 
                "gender": gender,
                "workPlace": workPlace,
                "profilePicture": profile,
                "mutualFriendAmount": 0,
                "mutualFriendNames": None}

            mutualFriendNames = getMutualFriendNames(mutualFriendIdList, cursor, connection)

            connection.commit()
            cursor.close()

            return {"response": "Success", 
            "firstName": firstName, 
            "interests": interests, 
            "description": description, 
            "age": age, 
            "gender": gender,
            "workPlace": workPlace,
            "profilePicture": profile,
            "mutualFriendAmount": len(mutualFriendIdList),
            "mutualFriendNames": mutualFriendNames}
    
    except mysql.connector.Error as err:
        return {"response": err.msg }

    return{"response": "Something went wrong"}

#gets all current matches that a user has
def getMatchIds(id, cursor, connection):
    sql = f"SELECT userTwo FROM Conversation WHERE userOne = {id};"
    cursor.execute(sql)

    idList = [ids[0] for ids in cursor.fetchall()]
    return set(idList)

# gets the names of friends to be outputted in the json response
def getMutualFriendNames(mutualFriendsIdList, cursor, connection):
    formattedList = ','.join(map(str, mutualFriendsIdList))
    sql = f"SELECT firstname FROM Profile WHERE userId IN ({formattedList})"
    cursor.execute(sql)

    mutualFriendNames = [names[0] for names in cursor.fetchall()]
    return mutualFriendNames

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