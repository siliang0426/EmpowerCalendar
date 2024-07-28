from flask import Flask, jsonify, request, session
from pymongo import MongoClient
from dotenv import load_dotenv
from flask_cors import CORS, cross_origin
import os
import bcrypt
import requests

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SESSION_SECRET')
CORS(app)
mongo_url = os.getenv('DB_CONNECTION_STRING')
client = MongoClient(mongo_url)
db = client['ProjectEmpowerDB']
user_collection = db['Users']

@app.route('/')
def home():
    return "This is our app!"


@app.route('/auth/register', methods=['POST'])
def sign_up():
    try:
        data = request.get_json()
        if not data:
            return 'No input data provided', 400

        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        password = data.get('password')

        if not all([first_name, last_name, email, password]):
            return 'Missing data', 400
        
        registered_user = user_collection.find_one({"email": email})
        if registered_user:
            return "This email is already registered with us", 400

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        user_collection.insert_one({"first_name": first_name, "last_name": last_name,
        "email": email,"password": hashed_password})
        
        return 'User created successfully', 200
    except Exception as e:
        print(f"An error occurred: {e}", flush=True)   
        return 'Server encountered an error. Please try again later', 500


@app.route('/auth/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return 'Email and password are required', 400

        user = user_collection.find_one({'email': email})
        if not user or not bcrypt.checkpw(password.encode('utf-8'), user['password']):
            return 'Invalid credentials', 400

        session['email'] = email
        return 'Login successful', 200
    except Exception as e:
        print(f"An error occurred: {e}", flush=True)    
        return 'Server encountered an error. Please try again later', 500


@app.route('/auth/logout', methods=['DELETE'])
def logout():
    try:
        session.pop('email',None)
        return 'User Logout successfully', 200
    except Exception as e:
        print(f"An error occurred: {e}", flush=True)    
        return 'Server encountered an error. Please try again later', 500


@app.route('/auth/check-login', methods=['GET'])
def check_login():
    try:
        if 'email' in session:
            return jsonify({'loggedIn': True}), 200
        return jsonify({'loggedIn': False}), 200
    except Exception as e:
        print(f"An error occurred: {e}", flush=True)    
        return 'Server encountered an error. Please try again later', 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)