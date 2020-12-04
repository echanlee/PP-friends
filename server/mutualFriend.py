import mysql.connector
from mysql.connector import errorcode
from connect import connectToDB

def getMutualFriends(id):
    try:
        connection = connectToDB()
        if(connection != False):
            cursor = connection.cursor(buffered=True)

            matchIds = getMatchIds(id, cursor, connection)
            if len(matchIds) == 0:
                return {"response": "Success", "mutualFriendAmount": 0}

            mutualFriendIds = getMutualFriendIds(id, matchIds, cursor, connection)
            if len(matchIds) == 0:
                return {"response": "Success", "mutualFriendAmount": 0}

            mutualFriendNames = getMutualFriendNames(mutualFriendIds, cursor, connection)
            return {"response": "Success", "mutualFriendAmount": len(mutualFriendIds), "mutualFriendNames": mutualFriendNames}

    except mysql.connector.Error as err:
        return {"response": err.msg}
    
    return {"response": "Something went wrong"}

#gets the list of IDs that the user has matched with 
def getMatchIds(id, cursor, connection):
    sql = f"SELECT userTwo FROM Conversation WHERE userOne = {id};"
    cursor.execute(sql) 

    idList = [ids[0] for ids in cursor.fetchall()]
    return idList

#gets mutual friends which are friends of friends that the user has not 
#matched with 
def getMutualFriendIds(id, matchesIdList, cursor, connection):
    #a tuple containing multiple values must be comma separated for the DBAPI paramstyle in python
    formattedList = ','.join(map(str, matchesIdList))
    sql = f"SELECT DISTINCT userTwo FROM Conversation WHERE userOne IN ({formattedList}) AND userTwo <> {id} AND userTwo NOT IN ({formattedList});"
    cursor.execute(sql)

    mutualFriendsList = [ids[0] for ids in cursor.fetchall()]
    return mutualFriendsList

# gets the names of friends to be outputted in the json response
def getMutualFriendNames(mutualFriendsIdList, cursor, connection):
    formattedList = ','.join(map(str, mutualFriendsIdList))
    sql = f"SELECT firstname FROM Profile WHERE userId IN ({formattedList})"
    cursor.execute(sql)

    mutualFriendNames = [names[0] for names in cursor.fetchall()]
    return mutualFriendNames