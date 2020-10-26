
from flask import Flask, request, render_template
from flask_cors import CORS
from register import registerUser
from profile import updateProfile
from login import loginUser
import SwipeDecision

app = Flask(__name__)
CORS(app)


@app.route('/')
def home():
    return 'testing'


@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
      return loginUser(request.form['email'], request.form['password'])

@app.route('/profile', methods=['POST'])
def profile():
    if request.method == 'POST':
        return updateProfile(request.form['name'], request.form['age'],
                             request.form['bio'], request.form['gender'], request.form['education'],
                             request.form['interests'], request.form['genderPreference'], request.form['id'])


@app.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        return registerUser(request.form['email'], request.form['password'])

@app.route('/getPotentialFriends', methods=['POST'])
def getFriends():
    if request.method == 'POST':
        return SwipeDecision.getPotentialMatchList(request.form['userId'])

@app.route('/displayProfile', methods=['POST'])
def displayProfile():
    if request.method == 'POST':
        return SwipeDecision.showProfile(request.form['userId'])

@app.route('/swipe', methods=['POST'])
def inputSwipe():
    if request.method == 'POST':
        return SwipeDecision.swipeDecision(request.form['currentUserId'], request.form['shownUserId'], request.form['match'])
        
if __name__ == '__main__':
    app.debug = True
    app.run()
