import mysql.connector
from mysql.connector import errorcode
from connect import connectToDB

def getMessagedUsers(userId, cursor):
    sql = f"SELECT distinct c.conversationId, c.userTwo, p.firstname, c.messageId, c.timeStamp, m.fromUser, m.content FROM Conversation c \
                join Messages m on c.messageId = m.messageId join Profile p on c.userTwo = p.userId WHERE c.userOne = {userId}"
    cursor.execute(sql, )
    res = cursor.fetchall()
    messaged_user_ids = []
    messaged_user_names = []
    message_ids = []
    timeStamp = []
    messageSender = []
    messageContent = []
    for pos in res:
        messaged_user_ids.append(pos[1])
        messaged_user_names.append(pos[2])
        message_ids.append(pos[3])
        timeStamp.append(pos[4])
        messageSender.append(pos[5])
        messageContent.append(pos[6])
    return messaged_user_ids, messaged_user_names, message_ids, timeStamp, messageSender, messageContent
    

def getNotMessagedUsers(userId, cursor):
    sql = f"SELECT distinct c.conversationId, c.userTwo, p.firstname FROM Conversation c \
                join Profile p on c.userTwo = p.userId WHERE userOne = {userId} and ISNULL(c.messageId)"
    cursor.execute(sql, )
    res = cursor.fetchall()
    not_messaged_user_ids = []
    not_messaged_user_names = []
    for pos in res:
        not_messaged_user_ids.append(pos[1])
        not_messaged_user_names.append(pos[2])
    return not_messaged_user_ids, not_messaged_user_names

def matchUser(userId):
    try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)

            currentName = currentUserName(userId, cursor)
            messaged_user_ids, messaged_user_names, message_ids, timeStamp, messageSender, messageContent = getMessagedUsers(userId, cursor)
            not_messaged_user_ids, not_messaged_user_names = getNotMessagedUsers(userId, cursor)
            userIds = not_messaged_user_ids + messaged_user_ids

            d = {"response": "Success", "userIds": userIds, "currentName": currentName, 
                "notMessagedUserIds": not_messaged_user_ids, "messagedUserIds": messaged_user_ids, 
                "notMessagedUserNames": not_messaged_user_names, "messagedUserNames": messaged_user_names, 
                "messageIds": message_ids, "messageSender": messageSender, "messageContent": messageContent, "timeStamp": timeStamp}
            print(d)
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


