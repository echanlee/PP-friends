import mysql.connector
from mysql.connector import errorcode
from connect import connectToDB

def getMessages(conversationId):
    try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)
            sql = f"SELECT p.firstname, m.content, m.timeStamp \
                FROM Messages m, Profile p \
                WHERE conversationId = {conversationId} AND m.fromUser = p.userId \
                ORDER BY timeStamp"
            cursor.execute(sql)
            firstnames = []
            messages = []
            timeStamps = []
            
            for pos in cursor.fetchall():
                    firstnames.append(pos[0])
                    messages.append(pos[1])
                    timeStamps.append(pos[2])
            d = {"response": "Success", "fromNames": firstnames, "messages": messages, "timeStamps": timeStamps}
            connection.commit()
            cursor.close()
            return d

    except mysql.connector.Error as err:
        return {"response": err.msg }

def sendMessage(convoId, friendConvoId, currentId, friendId, message):
    try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)
            messageId = addToMessageTable(convoId, friendConvoId, currentId, friendId, message, cursor)
            updateConversationTable(convoId, messageId, cursor)
            updateConversationTable(friendConvoId, messageId + 1, cursor)
            connection.commit()
            cursor.close()
            return {"response": "Success"}

        

    except mysql.connector.Error as err:
        return {"response": err.msg }

    return{"response": "Something went wrong"}

def addToMessageTable(convoId, friendConvoId, currentId, friendId, message, cursor): 
    sql = f"INSERT INTO Messages (fromUser, toUser, conversationId, content, timeStamp) \
                VALUES ({currentId}, {friendId}, {convoId}, '{message}', CURRENT_TIMESTAMP), \
                ({currentId}, {friendId}, {friendConvoId}, '{message}', CURRENT_TIMESTAMP)"
    cursor.execute(sql)
    return cursor.lastrowid

def updateConversationTable(convoId, messageId, cursor):
    sql = f"UPDATE Conversation SET messageId = {messageId}, timeStamp = CURRENT_TIMESTAMP \
            WHERE conversationId = {convoId}"

    cursor.execute(sql)