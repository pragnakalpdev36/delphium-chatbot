from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
import json
import datetime
import os
from dotenv import load_dotenv
import uuid
from boto3.dynamodb.conditions import Attr
import traceback
from mangum import Mangum  # Import Mangum for AWS Lambda

# Load environment variables from .env file
load_dotenv(".env")

app = Flask(__name__)
CORS(app)

# AWS Credentials and Configuration
aws_access_key_id = os.getenv('ACCESS_KEY_ID')
aws_secret_access_key=os.getenv('SECRET_ACCESS_KEY')
region_name=os.getenv('REGION')
agentId=os.getenv('BEDROCK_AGENT_ID')
agentAliasId=os.getenv('BEDROCK_AGENT_ALIAS_ID')

# Initialize AWS Bedrock client
bedrock = boto3.client(
    "bedrock-agent-runtime",
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key,
    region_name=region_name
    )

# Initialize DynamoDB resource
dynamodb = boto3.resource(
    "dynamodb",
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key,
    region_name=region_name
    )

def query_bedrock_knowledgebase_agent(user_message, user_id):
    """
    Queries the Bedrock Knowledge Base Agent with user input and returns the response.
    
    :param user_message: The user's input message.
    :param user_id: A unique identifier for the user session.
    :return: Response text from the Bedrock agent.
    """
    try:
        response = bedrock.invoke_agent(
            agentId=agentId,
            agentAliasId=agentAliasId,
            sessionId=user_id,
            inputText=user_message
        )
        response_text = ""
        for event in response["completion"]:
            if "chunk" in event:
                chunk_data = event["chunk"]["bytes"].decode("utf-8")
                response_text += chunk_data  
        return response_text
    except Exception as e:
        return str(e)

def store_conversation(user_id, user_message, bot_reply):
    """
    Stores the conversation history in the DynamoDB table 'ChatHistory'.
    
    :param user_id: The ID of the user.
    :param user_message: The user's input message.
    :param bot_reply: The bot's response.
    """
    table = dynamodb.Table("ChatHistory")
    id_is = str(uuid.uuid4()) # Generate a unique ID for the conversation entry
    current_date = str(datetime.date.today().isoformat())  # Get the current date
    # Insert conversation data into DynamoDB
    table.put_item(
        Item={
            'id': id_is,
            'user_id': user_id,
            'user_query': user_message,
            'timestamp': datetime.datetime.utcnow().isoformat(),
            'date': current_date,
            'bot_response': bot_reply
        }
    )

def handler(event, context):
    """
    AWS Lambda handler function to process API Gateway requests.
    
    :param event: The event data from API Gateway.
    :param context: The AWS Lambda context object.
    :return: A JSON response with the bot's reply.
    """
    try:
        body = json.loads(event.get('body', '{}'))
        user_id = event.get('user', 'guest')
        user_message = event.get('message', '')

        # Validate input
        if not user_message:
            return {
                'statusCode': 400,
                'body': 'Message is required'
            }

        # Query Bedrock Knowledge Base Agent
        bot_reply = query_bedrock_knowledgebase_agent(user_message, user_id)

        # Store conversation for non-guest users
        if user_id != 'guest':
            store_conversation(user_id, user_message, bot_reply)

        # Return response compatible with API Gateway
        return {
            'statusCode': 200,
            'body': bot_reply,
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': str(e)
        }