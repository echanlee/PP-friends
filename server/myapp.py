from flask import Flask, request, render_template
from flask_cors import CORS
from register import registerUser
from profile import updateProfile

app = Flask(__name__)
CORS(app)


@app.route('/')
def home():
    return 'testing'


@app.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        return registerUser(request.form['email'], request.form['password'])


@app.route('/profile', methods=['POST'])
def profile():
    if profile.method == 'POST':
        return updateProfile(request.form['username'], request.form['age'],
                             request.form['bio'], request.form['gender'], request.form['education'],
                             request.form['interests'], request.form['genderPreference'])


if __name__ == '__main__':
    app.debug = True
    app.run()
