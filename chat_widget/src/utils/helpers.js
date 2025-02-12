// import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
const AWS = require('aws-sdk');

export const createUserMessage = (message) => {
  // console.log("message-------", message);
  return {
    text: message,
    sender: "USER",
    messageType: "text",
    ts: new Date(),
    agentID:localStorage.getItem("agent_id"),
  };
};
// const rasaServerUrl="/ask"
export const getBotResponse = async ({
  rasaServerUrl,
  sender,
  message,
  metadata = {},
}) => {
  try {
    AWS.config.update({
        accessKeyId: "<aws_access_key>",
        secretAccessKey: "<aws_secret_key>",
        region: '<region>',
        httpOptions: { timeout: 500000 },
    });
    
    const lambda = new AWS.Lambda({
        apiVersion: '2015-03-31',
        endpoint: 'https://lambda.<region>.amazonaws.com',
    });
    if (message!=="/reset" && message!=="/restart" && message!=="/greet" && message!==""){
    const lambdaParams = {
        FunctionName: '<lambda_function_name>', // Replace with your actual Lambda function name
        InvocationType: 'RequestResponse', // Change to 'Event' if you don't need a response
        Payload: JSON.stringify({
            user: sender,
            message: message
        }),
    };

    const lambdaFetcher = async () => {
        try {
            const response = await lambda.invoke(lambdaParams).promise();
            return JSON.parse(response.Payload);
        } catch (error) {
            console.error("Lambda Invocation Error:", error);
            return null;
        }
    };
    
    const response = await lambdaFetcher()
    console.log("Lambda Response:", response);

    return response;
    }
    else{
      // if(message==="/reset"){
        const newUserId = uuidv4();
        console.log("Generated new uuid:", newUserId);
        localStorage.setItem("user_id", newUserId);
        localStorage.setItem("agent_id", newUserId);
        const lambdaParams = {
            FunctionName: 'ai-sales-agent-flask-app-prod-app', // Replace with your actual Lambda function name
            InvocationType: 'RequestResponse', // Change to 'Event' if you don't need a response
            Payload: JSON.stringify({
                user: newUserId,
                message: "Hi"
            }),
        };
    
        const lambdaFetcher = async () => {
            try {
                const response = await lambda.invoke(lambdaParams).promise();
                return JSON.parse(response.Payload);
            } catch (error) {
                console.error("Lambda Invocation Error:", error);
                return null;
            }
        };
        
        const response = lambdaFetcher()
      // }
      return {"body":"Hi, I'm Delphi! I'll help you discover how Delphinium can transform your Canvas experience. Can I ask what your role is?"};
    }

  } catch (error) {

    return [];
  }
};
