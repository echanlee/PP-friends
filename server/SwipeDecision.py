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