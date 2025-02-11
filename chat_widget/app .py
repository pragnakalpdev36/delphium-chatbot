from flask import Flask, render_template, request, jsonify
from langchain.vectorstores import Pinecone
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
import pinecone
import os

from flask_cors import CORS
app = Flask(__name__)
CORS(app)
# Set environment variables
os.environ["PINECONE_API_KEY"] = "8c5d2051-0033-42e2-ac7a-8d74b490e7ef"
os.environ["OPENAI_API_KEY"] = "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"

# Initialize Pinecone
pinecone.init(api_key=os.getenv("PINECONE_API_KEY"))
index_name = "rag-demo"

# Load the embedding and LLM model
embeddings_model = OpenAIEmbeddings()
llm = ChatOpenAI(model_name="gpt-4o", max_tokens=500)

# Load Pinecone index
index = pinecone.Index(index_name)
vectorstore = Pinecone(index, embeddings_model.embed_query, "text")
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

@app.route("/")
def index():
  print("sfdfdkdfkf-------")
  return render_template("index.html")

# @app.route("/ask", methods=["POST","OPTION"])
# def ask():
#     print("???????????")
#     print("hello")
#     print(request.method)
#     # print(request.form["text"])
#     user_input = request.form["text"]
#     print(user_input)
#     # Retrieve relevant documents
#     context = retriever.get_relevant_documents(user_input)

#     # Construct prompt
#     prompt = f"""You are Building Sense Chatbot powered by AI that streamlines building plan reviews with AI. You use a professional yet casual and nice tone to talk to people in American English. You avoid using complex grammar and words that might confuse people. When asked, you need to retrieve information from documents to answer questions accurately. If the questions given by users are not clear, you can ask a clarifying question.  

# Data:
# {context}

# You can only use the above-provided data to answer the user's question. If you do not find the answer to the question from the given data, first analyze the given data and try to understand it and return the answer. Provide a detailed explanation of the answer in a simple way, easily understandable by the user.  If you can't find an answer please tell that you are not sure about the information.

# Question: {user_input}
# Answer:"""
#     print(">>>>>>>>>>>>>>>>")
#     # Generate response
#     # response = llm.invoke(prompt).content
#     response= "Testing the chat widget..."

#     return jsonify({"response": response})

@app.route("/ask", methods=["POST", "OPTIONS"])
def ask():
    if request.method == "OPTIONS":
        # Respond to preflight request with CORS headers
        response = jsonify({})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST")
        return response

    # Handle POST request
    # Your existing code for handling POST requests goes here

    print("???????????")
    print("hello")
    print(request.method)
    
    print("Form Data:", request.form)
    print("JSON Data:", request.get_json())
    p=request.get_json()
    print("message:",p["message"])

    user_input = p["message"]
    print(user_input)
    # Retrieve relevant documents
    context = retriever.get_relevant_documents(user_input)

    # Construct prompt
    prompt = f"""You are Building Sense Chatbot powered by AI that streamlines building plan reviews with AI. You use a professional yet casual and nice tone to talk to people in American English. You avoid using complex grammar and words that might confuse people. When asked, you need to retrieve information from documents to answer questions accurately. If the questions given by users are not clear, you can ask a clarifying question.  

Data:
{context}

You can only use the above-provided data to answer the user's question. If you do not find the answer to the question from the given data, first analyze the given data and try to understand it and return the answer. Provide a detailed explanation of the answer in a simple way, easily understandable by the user.  If you can't find an answer please tell that you are not sure about the information.

Question: {user_input}
Answer:"""
    print(">>>>>>>>>>>>>>>>")
    # Generate response
    # response = llm.invoke(prompt).content
    # response = "Testing the chat widget..."
    # response = [{"buttons":"yes",'type':"buttons"}]
    # return [{"text": response}]
    '''return responce in button format'''
    # response = {
    #     "buttons": [{"title":"yes"}],
    #     "type": "buttons"
    # }

    # response={
    #     "image":[{"src":"gal2.jpg"}]
    # }

    response={
        "video":[{"src":"v1.mp4"}],
        "image":[{"src":"gal2.jpg"}],
        "text": "Testing the chat widget...",
        "buttons": [{"title":"yes"}],
        "suggestionChips": ["yes", "No", "ok"]
    }

    print("response = " ,response)
    return jsonify([response])
    # return [{"buttons":["yes","no"],"type":"button"}]




if __name__ == "__main__":
    app.run(debug=True,port=4000)
