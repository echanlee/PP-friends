from flask import Flask, request, render_template, send_from_directory
from flask_socketio import SocketIO, send, join_room, leave_room, emit
from flask_cors import CORS, cross_origin
from server.register import registerUser
import server.profile
import os
import server.matches
from server.login import loginUser
import server.SwipeDecision
from server.questionnaire import updateQuestionnaire
from server.potentialMatch import findPotentialMatches
import server.messages
from server.GetLocation import getLocation
import server.updateEmail
import server.updatePassword

app = Flask(__name__, static_folder='../build', static_url_path='')
cors = CORS(app)

app.config['SECRET_KEY'] = 'mysecret'

socketIo = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def home():
    return send_from_directory(app.static_folder, 'index.html')

# Error handling in case the url path does not exist, takes them back to main page
@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/login', methods=['POST'])
@cross_origin()
def login():
    if request.method == 'POST':
      return loginUser(request.form['email'], request.form['password'])

@app.route('/createprofile', methods=['POST'])
def create_profile():
    if request.method == 'POST':
        return server.profile.createProfile(request.form['name'], request.form['birthday'],
                             request.form['bio'], request.form['gender'], request.form['education'],
                             request.form['interests'], request.form['genderPreference'], request.form['maxDistance'],  
                             request.form['age'], request.form['id'])

@app.route('/viewprofile', methods=['POST'])
def viewProfile():
    if request.method == 'POST':
        param = request.get_json('userId')
        return server.profile.getProfile(param['userId'])

@app.route('/editprofile', methods=['POST'])
def edit_profile():
    if request.method == 'POST':
        return server.profile.updateProfile(request.form['name'], request.form['birthday'],
                             request.form['bio'], request.form['gender'], request.form['education'],
                             request.form['interests'], request.form['genderPreference'], request.form['maxDistance'],  
                             request.form['age'], request.form['id'])

@app.route('/matches', methods=['POST'])
def get_matches():
    if request.method == 'POST':
        param = request.get_json('userId')
        response = server.matches.matchUser(param['userId'])
        return response

@app.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        return registerUser(request.form['email'], request.form['password'])

@app.route('/updateEmail', methods=['POST'])
def update_Email():
    if request.method == 'POST':
        return server.updateEmail.updateEmail(request.form['id'], request.form['email'])

@app.route('/updatePassword', methods=['POST'])
def update_Password():
    if request.method == 'POST':
        return server.updatePassword.updatePassword(request.form['id'], request.form['oldPassword'], request.form['newPassword'])

@app.route('/getPotentialFriends', methods=['POST'])
def getFriends():
    if request.method == 'POST':
        return server.SwipeDecision.getPotentialMatchList(request.form['userId'])

@app.route('/displayProfile', methods=['POST'])
def displayProfile():
    if request.method == 'POST':
        return server.SwipeDecision.showProfile(request.form['userId'])

@app.route('/swipe', methods=['POST'])
def inputSwipe():
    if request.method == 'POST':
        return server.SwipeDecision.swipeDecision(request.form['currentUserId'], request.form['shownUserId'], request.form['match'])

@app.route('/questionnaire', methods=['POST'])
def questionnaire():
    if request.method == 'POST':
        param = request.get_json('responses')
        return updateQuestionnaire(param['responses'], param['userId']) 

@app.route('/potentialMatch', methods=['POST'])
def potentialMatch():
    if request.method == 'POST':
        param = request.get_json('responses')
        return findPotentialMatches(param['userId'])

@app.route('/location', methods=['POST'])
def storeLocation():
    if request.method == 'POST':
        param = request.get_json('userID')
        return getLocation(param['userID'], param['longitude'], param['latitude'])
        
@app.route('/conversationId', methods=['POST'])
def conversationId():
    if request.method == 'POST':
        param = request.get_json('userId')
        return server.matches.getConversationIds(param['userId'], param['friendId'])     

@app.route('/getMessages', methods=['POST'])
def getMessages():
    if request.method == 'POST':
        param = request.get_json('convoId')
        return server.messages.getMessages(param['convoId'])   

@app.route('/sendMessage', methods=['POST'])
def sendMessage():
    if request.method == 'POST':
        param = request.get_json('convoId')
        return server.messages.sendMessage(param['convoId'], param['friendConvoId'], param['currentId'], param['friendId'], param['message']) 

@socketIo.on('connect')
def on_Connect():
    return None

@socketIo.on("message")
def handleMessage(data):
    msg = data['msg']
    room = data['room']
    send(msg, room=room)
    return None

@socketIo.on("room")
def handleMessage(room):
    join_room(room)
    return None

@socketIo.on("leaveRoom")
def handleMessage(room):
    leave_room(room)
    return None

# if __name__ == '__main__':
#     app.debug = True
#     app.run()
#     socketIo.run(app)

# makes app run on the standard port
if __name__ == "__main__":
    socketIo.run(
        app,
        host=os.getenv('IP', '174.129.240.180'),
        port=int(os.getenv('PORT', 1080)),
        debug=False
    )
