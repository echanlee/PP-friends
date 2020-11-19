import mysql.connector
from mysql.connector import errorcode
from connect import connectToDB

def getPreviewMessages(messageId, cursor):
    sql = f"SELECT messageId, fromUser, content from Messages where messageId in {messageId}"
    cursor.execute(sql)
    res = cursor.fetchall()
    d = {}
    for pair in res:
        d[pair[0]] = [pair[1], pair[2]]
    return d

def matchUser(userId):
    print("trying to match user")
    try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)

            sql = f"SELECT distinct c.conversationId, c.userTwo, p.firstname, c.messageId, c.timeStamp FROM Conversation c \
                join Profile p on c.userTwo = p.userId WHERE userOne = {userId}"
            cursor.execute(sql)
            res = cursor.fetchall()

            not_messaged_user_ids = []
            not_messaged_user_names = []
            messaged_user_ids = []
            messaged_user_names = []
            message_ids = []
            timeStamp = []
            print(res)
            for pos in res:
                if not pos[3]:
                    not_messaged_user_ids.append(pos[1])
                    not_messaged_user_names.append(pos[2])
                    
                else:
                    messaged_user_ids.append(pos[1])
                    messaged_user_names.append(pos[2])
                    messageIds.append(pos[3])
                    timeStamp.append(pos[4])
            print("here")
            currentName = currentUserName(userId, cursor)
            print("huh", messaged_user_ids)
            messageSender = []
            messageContent = []
            if messaged_user_ids:
                messageContentMatch = getPreviewMessages(messaged_user_ids, cursor)
                messageSender = []
                messageContent = []
                for message_id in message_ids:
                    messageSender.append(messageContentMatch[message_id][0])
                    messageContent.append(messageContentMatch[message_id][1])

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


