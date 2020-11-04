import mysql.connector
from mysql.connector import errorcode
from connect import connectToDB


def getPotentialMatchList(currentUserId):
    try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)
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
            print(userOne, userTwo)
            insertConvoRowsQuery = "INSERT INTO Conversation (userOne, userTwo) \
                SELECT p1.currentUser, p1.shownUser FROM PotentialMatch p1 \
                WHERE (p1.currentUser = %s or p1.currentUser = %s) AND p1.matchDecision = 1 AND EXISTS \
                (SELECT * FROM PotentialMatch p2 \
                    WHERE p2.shownUser = p1.currentUser AND p2.currentUser = p1.shownUser AND p2.matchDecision = 1)"
            cursor.execute(insertConvoRowsQuery, (userOne, userTwo,))
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
            cursor.close()

            if userDecision == 'true':
                insertConvo(currentUserId, shownUserId)
        return {"response": "Success"}

    except mysql.connector.Error as err:
        return {"response": err.msg }

    return{"response": "Something went wrong"}