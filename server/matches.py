import mysql.connector
from mysql.connector import errorcode
from connect import connectToDB




def matchUser(userId):
    try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)
            sql = "SELECT DISTINCT p.userId, p.firstname \
                from ppFriends.Conversation c join ppFriends.Profile p \
                on (c.userOne = p.userId or c.userTwo = p.userId) where userId != %s"
            cursor.execute(sql, (userId,))
            userIds = []
            firstnames = []
            
            for pos in cursor.fetchall():
                if pos[1] not in userIds:
                    userIds.append(pos[0])
                    firstnames.append(pos[1])
            currentName = currentUserName(userId, cursor)
            d = {"response": "Success", "userIds": userIds, "firstnames": firstnames, "currentName": currentName}
            return d

    except mysql.connector.Error as err:
        return {"response": err.msg }

def currentUserName(userId, cursor):
    sql = f"SELECT firstname FROM Profile WHERE userId = {userId}"
    cursor.execute(sql)
    name = cursor.fetchone()[0]
    return name

def getConversationIds(currentUser, friendUser):
     try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)
            sql = f"SELECT conversationId FROM Conversation WHERE userOne = {currentUser} AND userTwo = {friendUser}"
            cursor.execute(sql)
            currentId = cursor.fetchone()[0]

            sql = f"SELECT conversationId FROM Conversation WHERE userOne = {friendUser} AND userTwo = {currentUser}"
            cursor.execute(sql)
            friendId = cursor.fetchone()[0]

            d = {"response": "Success", "currentConvoId": currentId, "friendConvoId": friendId}
            return d

     except mysql.connector.Error as err:
        return {"response": err.msg }


