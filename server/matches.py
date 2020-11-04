import mysql.connector
from mysql.connector import errorcode
from connect import connectToDB




def matchUser(userId):
    try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)
            sql = "SELECT c.conversationId, p.userId, p.firstname \
                from ppFriends.Conversation c join ppFriends.Profile p \
                on (c.userOne = p.userId or c.userTwo = p.userId) where userId != %s"
            cursor.execute(sql, (userId,))
            conversationIds = []
            userIds = []
            firstnames = []
            for pos in cursor.fetchall():
                conversationIds.append(pos[0])
                userIds.append(pos[1])
                firstnames.append(pos[2])
            return {"response": "Success", "conversationIds": conversationIds, "userIds": userIds, "firstnames": firstnames}

    except mysql.connector.Error as err:
        return {"response": err.msg }

    