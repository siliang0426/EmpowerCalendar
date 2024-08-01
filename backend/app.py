from flask import Flask, jsonify, request, session, redirect, url_for
from pymongo import MongoClient
from dotenv import load_dotenv
from flask_cors import CORS, cross_origin
import os
import bcrypt
import requests
from google.oauth2 import id_token
from google.auth.transport import requests
from google_auth_oauthlib.flow import InstalledAppFlow
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
import json
import openai

load_dotenv()

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

app = Flask(__name__)
app.secret_key = os.getenv('SESSION_SECRET')
CORS(app, support_credentials=True)
mongo_url = os.getenv('DB_CONNECTION_STRING')
client = MongoClient(mongo_url)
db = client['ProjectEmpowerDB']
user_collection = db['Users']

GOOGLE_OAUTH_CLIENT_ID=os.getenv("GOOGLE_OAUTH_CLIENT_ID")
GOOGLE_OAUTH_CLIENT_SECRET=os.getenv("GOOGLE_OAUTH_CLIENT_SECRET")


@app.route('/auth/google', methods=['POST'])
@cross_origin(supports_credentials=True)
def google_auth():
    token = request.json.get('token')
    

    if not token:
        return jsonify({'error': 'Missing token'}), 400

    try:

        id_info = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_OAUTH_CLIENT_ID)

        # print(id_info, flush=True)
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
                "email": email
            }
        return jsonify({"message": "Login successful!", "user": ret_user}), 200
    except ValueError as e:
        print(str(e), flush=True)
        return "Server encountered an error upon this request. Please try again later.", 500

@app.route('/auth/google/calendar', methods=['GET'])
@cross_origin(supports_credentials=True)
def google_auth_calendar():

    scopes = ['https://www.googleapis.com/auth/calendar']
    flow = InstalledAppFlow.from_client_secrets_file('client_secret.json', scopes=scopes)
    flow.redirect_uri = url_for('google_auth_calendar_callback', _external=True)
    authorization_url, state = flow.authorization_url(access_type='offline', include_granted_scopes='true')
    session['state'] = state
    session['redirect_uri'] = flow.redirect_uri
    # print(flow.redirect_uri, flush=True)
    return jsonify({'authorization_url': authorization_url}), 200

@app.route('/auth/google/calendar/callback', methods=['GET'])
@cross_origin(supports_credentials=True)
def google_auth_calendar_callback():
    state = session.get('state')
    redirect_uri = session.get('redirect_uri')
    if not state or not redirect_uri:
        return jsonify({'error': 'Missing state or redirect URI in session'}), 400

    flow = InstalledAppFlow.from_client_secrets_file('client_secret.json', scopes=['https://www.googleapis.com/auth/calendar'], state=state)
    flow.redirect_uri = redirect_uri

    flow.fetch_token(authorization_response=request.url)

    if not flow.credentials:
        return jsonify({'error': 'Failed to fetch token'}), 500

    credentials = flow.credentials
    email = session.get('email')
    if email:
        user_collection.update_one(
            {"email": email},
            {"$set": {"credentials": credentials.to_json()}}
        )
        # print(email, flush=True)
        return redirect('http://localhost:3000/home?status=calendar_access_granted')
    return jsonify({'error': 'User not found'}), 400


@app.route('/user/calendar', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_calendar_embed_url():
    email = session.get('email')
    if not email:
        return jsonify({'error': 'Unauthorized'}), 401

    user = user_collection.find_one({"email": email})
    print(user, flush=True)
    if not user or 'credentials' not in user:
        return jsonify({'error': 'User not authorized or missing credentials'}), 400

    try:
        credentials = Credentials.from_authorized_user_info(user['credentials'])
        calendar_id = 'primary'  # Replace with your calendar ID if needed
        embed_url = f"https://calendar.google.com/calendar/embed?src={calendar_id}&ctz=YOUR_TIMEZONE"  # Adjust timezone if needed

        return jsonify({'calendar_embed_url': embed_url}), 200
    except Exception as e:
        print(f"Error fetching calendar embed URL: {str(e)}", flush=True)
        return jsonify({'error': 'Failed to fetch calendar embed URL'}), 500


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
            # print(user, flush=True)
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


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)