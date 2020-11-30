import mysql.connector
from mysql.connector import errorcode
from connect import connectToDB

def getMessagedUsers(userId, cursor):
    sql = f"SELECT distinct c.userTwo, p.firstname, c.messageId, c.timeStamp, m.fromUser, m.content FROM Conversation c \
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
        messaged_user_ids.append(pos[0])
        messaged_user_names.append(pos[1])
        message_ids.append(pos[2])
        timeStamp.append(pos[3])
        messageSender.append(pos[4])
        messageContent.append(pos[5])
    return messaged_user_ids, messaged_user_names, message_ids, timeStamp, messageSender, messageContent
    

def getNotMessagedUsers(userId, cursor):
    sql = f"SELECT distinct c.userTwo, p.firstname FROM Conversation c \
                join Profile p on c.userTwo = p.userId WHERE userOne = {userId} and ISNULL(c.messageId)"
    cursor.execute(sql, )
    res = cursor.fetchall()
    not_messaged_user_ids = []
    not_messaged_user_names = []
    for pos in res:
        not_messaged_user_ids.append(pos[0])
        not_messaged_user_names.append(pos[1])
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

def unmatch(currentUser, friendUser):
    try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)
            change_potentialMatch = f"UPDATE PotentialMatch SET matchDecision = 0 WHERE currentUser = %s AND shownUser = %s"
            delete_conversation = f"DELETE from Conversation WHERE userOne = %s and userTwo = %s"
            delete_messages = f"DELETE from Messages WHERE fromUser = %s and toUser = %s"
            insert_unmatch = f"INSERT into Unmatch (userOne, userTwo) values (%s, %s)"

            cursor.execute(change_potentialMatch, (currentUser, friendUser))
            cursor.execute(change_potentialMatch, (friendUser, currentUser))

            cursor.execute(delete_conversation, (currentUser, friendUser))
            cursor.execute(delete_conversation, (friendUser, currentUser))

            cursor.execute(delete_messages, (currentUser, friendUser))
            cursor.execute(delete_messages, (friendUser, currentUser))

            cursor.execute(insert_unmatch, (currentUser, friendUser))
            cursor.execute(insert_unmatch, (friendUser, currentUser))

            connection.commit()
            cursor.close()

            return matchUser(currentUser)

    except mysql.connector.Error as err:
        return {"response": err.msg } 

