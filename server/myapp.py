from flask import Flask, request, render_template 
from flask_cors import CORS 
from register import registerUser

app = Flask(__name__) 
CORS(app)

@app.route('/')
def home():
  return 'testing'

@app.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
      return registerUser(request)
        

if __name__ == '__main__':
    app.debug = True
    app.run()