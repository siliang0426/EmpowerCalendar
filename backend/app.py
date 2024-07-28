from flask import Flask, jsonify, request
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

mongo_url = os.getenv('MONGO_URL')
client = MongoClient(mongo_url)
db = client.mydatabase

@app.route('/')
def home():
    return "This is our app!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)