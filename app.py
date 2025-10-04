import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

# --- Initialization ---
app = Flask(__name__)
CORS(app) # Allows your frontend to communicate with this backend

# --- API Key Configuration ---
# Securely load the API key from an environment variable
try:
    API_KEY = os.environ.get("GOOGLE_API_KEY")
    if not API_KEY:
        print("Warning: GOOGLE_API_KEY environment variable not set.")
    genai.configure(api_key=API_KEY)
except Exception as e:
    print(f"Error configuring Google AI: {e}")

# --- API Routes ---

@app.route('/barangay/data', methods=['GET'])
def get_barangay_data():
    """
    API endpoint to provide statistics and announcements for the dashboard.
    In a real application, this data would come from a database.
    """
    # Placeholder data (replace with your database queries)
    dashboard_data = {
        "stats": {
            "population": 10250,
            "households": 2500,
            "blotterCases": 15,
            "permitsIssued": 128
        },
        "announcements": [
            {
                "title": "Community Cleanup Drive",
                "date": "October 11, 2025",
                "description": "All residents are invited to join the cleanup drive this Saturday at 6:00 AM.",
                "icon": "fa-broom",
                "iconColor": "icon-blue"
            },
            {
                "title": "Free Vaccination Program",
                "date": "October 15, 2025",
                "description": "Free anti-polio vaccination for children aged 0-5 at the Barangay Hall.",
                "icon": "fa-syringe",
                "iconColor": "icon-green"
            }
        ]
    }
    return jsonify(dashboard_data)

@app.route('/api/google-chat', methods=['POST'])
def handle_chat():
    """
    API endpoint for the AI chatbot. Receives a message from the user,
    sends it to the Google AI, and returns the AI's response.
    """
    if not API_KEY:
        return jsonify({'error': 'The AI service is not configured on the server.'}), 500
        
    user_message = request.json.get('message')
    if not user_message:
        return jsonify({'error': 'No message provided.'}), 400
    
    try:
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(user_message)
        return jsonify({'reply': response.text})
    except Exception as e:
        print(f"Error during Google AI API call: {e}")
        return jsonify({'error': 'An error occurred while communicating with the AI service.'}), 500

# --- Server Start ---
if __name__ == '__main__':
    # The server runs on port 5000 by default. Render will handle this automatically.
    app.run(debug=False)
