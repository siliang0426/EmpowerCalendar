from flask import Flask, jsonify, request, session
from pymongo import MongoClient
from dotenv import load_dotenv
from flask_cors import CORS, cross_origin
import os
import bcrypt
import requests
from google.oauth2 import id_token
from google.auth.transport import requests
import json
from openai import OpenAI
import logging

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SESSION_SECRET')
CORS(app, support_credentials=True)
mongo_url = os.getenv('DB_CONNECTION_STRING')
client = MongoClient(mongo_url)
db = client['ProjectEmpowerDB']
user_collection = db['Users']

GOOGLE_OAUTH_CLIENT_ID = os.getenv("GOOGLE_OAUTH_CLIENT_ID")
GOOGLE_OAUTH_CLIENT_SECRET = os.getenv("GOOGLE_OAUTH_CLIENT_SECRET")

openai_api_key = os.getenv('OPENAI_API_KEY')
openai_client = OpenAI(api_key=openai_api_key)

@app.route('/auth/google', methods=['POST'])
@cross_origin(supports_credentials=True)
def google_auth():
    token = request.json.get('token')

    if not token:
        return jsonify({'error': 'Missing token'}), 400

    try:
        id_info = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_OAUTH_CLIENT_ID)

        email = id_info['email']
        registered_user = user_collection.find_one({"email": email})

        if not registered_user:
            first_name = id_info['given_name']
            last_name = id_info['family_name']
            user_collection.insert_one({"first_name": first_name, "last_name": last_name, "email": email })
        else:
            first_name = registered_user['first_name']
            last_name = registered_user['last_name']

        session['email'] = email
        ret_user = {
                "first_name": first_name,
                "last_name": last_name,
                "email": email,
            }
        return jsonify({"message": "Login successful!", "user": ret_user}), 200
    except ValueError as e:
        print(str(e), flush=True)
        return "Server encountered an error upon this request. Please try again later.", 500


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
@cross_origin(supports_credentials=True)
def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return 'Email and password are required', 400

        user = user_collection.find_one({'email': email})
        if not user:
            return 'Invalid credentials', 400

        if 'password' not in user:
            return 'You should log in with google instead!', 400
        
        if not bcrypt.checkpw(password.encode('utf-8'), user['password']):
            return 'Invalid credentials', 400 
        
        session['email'] = email
        ret_user = {
            "first_name": user['first_name'],
            "last_name": user['last_name'],
            "email": email,
        }
        return jsonify({"message": "Login successful!", "user": ret_user}), 200
    except Exception as e:
        print(f"An error occurred: {e}", flush=True)    
        return 'Server encountered an error. Please try again later', 500


@app.route('/auth/logout', methods=['DELETE'])
@cross_origin(supports_credentials=True)
def logout():
    try:
        session.pop('email',None)
        return 'User Logout successfully', 200
    except Exception as e:
        print(f"An error occurred: {e}", flush=True)    
        return 'Server encountered an error. Please try again later', 500


@app.route('/auth/check-login', methods=['GET'])
@cross_origin(supports_credentials=True)
def check_login():
    try:
        if 'email' in session:
            user = user_collection.find_one({'email': session['email']})
            if not user:
                return "Malformed session! Please clear cookies and log in again.", 500
            print(user, flush=True)
            ret_user = {
                "first_name": user['first_name'],
                "last_name": user['last_name'],
                "email": user['email'],
            }
            return jsonify({'loggedIn': True, 'user': ret_user}), 200
        return jsonify({'loggedIn': False}), 200
    except Exception as e:
        print(f"An error occurred: {e}", flush=True)    
        return 'Server encountered an error. Please try again later', 500


@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get('input')
    
    # return jsonify({'response to front': str(user_input)}), 200

    if user_input:
        api_chat_completion = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are very sarcastic and funny, you are very mean as well."},
                {"role": "user", "content": user_input}
            ]
        )
        
        logging.info(api_chat_completion.choices[0].message)
        return jsonify({'response': str(api_chat_completion.choices[0].message.content)}), 200
    return jsonify({'response': "Failed"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)