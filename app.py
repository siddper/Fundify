from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import json
from datetime import datetime
import os
import groq
from dotenv import load_dotenv
from flask_mail import Mail, Message

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# NOTE: For production, use environment variables for sensitive data.
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

# More permissive CORS configuration for development
CORS(app, origins=["http://127.0.0.1:5500"], supports_credentials=True)

# Flask-Mail config
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')  # fundifyteam@gmail.com
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')  # App password or Gmail password
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER', 'fundifyteam@gmail.com')
mail = Mail(app)

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    type = db.Column(db.String(32), nullable=False)
    date = db.Column(db.String(32), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    store = db.Column(db.String(120), nullable=False)
    method = db.Column(db.String(32), nullable=False)

    user = db.relationship('User', backref=db.backref('transactions', lazy=True))

class Preset(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    type = db.Column(db.String(32), nullable=False)
    date = db.Column(db.String(32), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    store = db.Column(db.String(120), nullable=False)
    method = db.Column(db.String(32), nullable=False)

    user = db.relationship('User', backref=db.backref('presets', lazy=True))

def create_db():
    with app.app_context():
        db.create_all()

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    if not name or not email or not password:
        return jsonify({'success': False, 'error': 'All fields are required.'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'success': False, 'error': 'Email is already registered.'}), 400
    pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(name=name, email=email, password_hash=pw_hash)
    db.session.add(user)
    db.session.commit()
    return jsonify({'success': True}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'success': False, 'error': 'All fields are required.'}), 400
    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({'success': False, 'error': 'Invalid email or password.'}), 401
    return jsonify({'success': True, 'user': {'name': user.name, 'email': user.email}})

@app.route('/presets', methods=['GET'])
def get_presets():
    user_email = request.args.get('email')
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({'success': False, 'error': 'User not found.'}), 404
    
    presets = Preset.query.filter_by(user_id=user.id).all()
    preset_list = [{
        'id': p.id,
        'name': p.name,
        'type': p.type,
        'date': p.date,
        'amount': p.amount,
        'store': p.store,
        'method': p.method
    } for p in presets]
    return jsonify({'success': True, 'presets': preset_list})

@app.route('/presets', methods=['POST'])
def add_preset():
    data = request.json
    user_email = data.get('email')
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({'success': False, 'error': 'User not found.'}), 404

    new_preset = Preset(
        user_id=user.id,
        name=data.get('name'),
        type=data.get('type'),
        date=data.get('date'),
        amount=float(data.get('amount')),
        store=data.get('store'),
        method=data.get('method')
    )
    db.session.add(new_preset)
    db.session.commit()
    
    return jsonify({
        'success': True, 
        'presets': {
            'id': new_preset.id,
            'name': new_preset.name,
            'type': new_preset.type,
            'date': new_preset.date,
            'amount': new_preset.amount,
            'store': new_preset.store,
            'method': new_preset.method
        }
    }), 201

@app.route('/presets/<int:preset_id>', methods=['DELETE'])
def delete_preset(preset_id):
    preset = Preset.query.get(preset_id)
    if not preset:
        return jsonify({'success': False, 'error': 'Preset not found.'}), 404
    
    # Optional: Check if the preset belongs to the current user
    # This requires passing user identity with the request (e.g., in headers)
    
    db.session.delete(preset)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/quick-preset', methods=['POST'])
def quick_preset():
    if not GROQ_API_KEY:
        return jsonify({'success': False, 'error': 'GROQ_API_KEY environment variable not set. Please create a .env file with your key.'}), 500

    data = request.json
    user_prompt = data.get('prompt')
    user_email = data.get('email')

    if not user_prompt or not user_email:
        return jsonify({'success': False, 'error': 'Prompt and email are required.'}), 400
    
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({'success': False, 'error': 'User not found.'}), 404

    try:
        client = groq.Groq(api_key=GROQ_API_KEY)
        
        system_prompt = f"""
        You are an intelligent preset parser. Your task is to analyze the user's text and extract preset details for a recurring transaction.
        Your response MUST be a valid JSON object and nothing else. Today is {datetime.now().strftime('%A, %m/%d/%Y')}.

        You must categorize the user's input into one of three statuses: "success", "clarification_needed", or "error".

        1.  **SUCCESS (`status: "success"`)**:
            Use this status if all required information (`name`, `type`, `amount`, `store`) is clearly present in the user's text.
            The JSON structure MUST be:
            `{{"status": "success", "data": {{"name": "...", "type": "...", "date": "...", "amount": ..., "store": "...", "method": "..."}}}}`
            - `name`: A short, descriptive name for the preset (e.g., "Monthly Rent", "Lunch at Chipotle"). You must infer a sensible name from the user's prompt.
            - `type`: CRITICAL: This value MUST be either 'Withdrawal' or 'Deposit'. Do not use any other value. If the user implies spending money, use 'Withdrawal'. If they imply receiving money, use 'Deposit'.
            - `date`: Must be in 'MM/DD/YYYY' format. Use today's date if not specified.
            - `amount`: Must be a number.
            - `store`: The merchant name or source of income.
            - `method`: CRITICAL: This value MUST be one of: 'Credit', 'Debit', 'Cash', 'Check'. Map user terms like 'card' or 'credit card' to 'Credit'. Map 'debit card' to 'Debit'. If no method is specified, use 'Unknown'.

        2.  **CLARIFICATION NEEDED (`status: "clarification_needed"`)**:
            Use this status if the user's text looks like a transaction but is missing the `amount` or `store`.
            You MUST ask a friendly question to get the missing information.
            The JSON structure MUST be:
            `{{"status": "clarification_needed", "message": "A friendly question asking for the missing details."}}`
            - **Do not** guess or fill in missing `amount` or `store`. You must ask for clarification. If a name isn't obvious, you can also ask for it.

        3.  **ERROR (`status: "error"`)**:
            Use this status if the user's input is ambiguous, nonsensical, or cannot be interpreted as a financial transaction.
            The JSON structure MUST be:
            `{{"status": "error", "message": "I couldn't understand that as a preset. Could you please rephrase it?"}}`
        """

        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            model="llama3-8b-8192",
            temperature=0.2,
            max_tokens=256,
            top_p=1,
            stop=None,
            stream=False,
            response_format={"type": "json_object"},
        )

        ai_response_str = chat_completion.choices[0].message.content
        
        try:
            ai_response = json.loads(ai_response_str)
        except json.JSONDecodeError:
            return jsonify({'success': False, 'error': 'AI response was not in a valid JSON format.'}), 500

        status = ai_response.get("status")
        if status == "success":
            preset_data = ai_response.get("data")
            if not preset_data or not all(k in preset_data for k in ['name', 'type', 'date', 'amount', 'store', 'method']):
                 return jsonify({'success': False, 'error': 'AI response was missing required preset data.'}), 500

            new_preset = Preset(
                user_id=user.id,
                name=preset_data.get('name'),
                type=preset_data.get('type'),
                date=preset_data.get('date'),
                amount=float(preset_data.get('amount')),
                store=preset_data.get('store'),
                method=preset_data.get('method')
            )
            db.session.add(new_preset)
            db.session.commit()

            return jsonify({
                'success': True, 
                'presets': {
                    'id': new_preset.id,
                    'name': new_preset.name,
                    'type': new_preset.type,
                    'date': new_preset.date,
                    'amount': new_preset.amount,
                    'store': new_preset.store,
                    'method': new_preset.method
                }
            })
        elif status == "clarification_needed":
            return jsonify({'success': False, 'clarification_needed': True, 'message': ai_response.get('message')})
        elif status == "error":
            return jsonify({'success': False, 'error': ai_response.get('message')})
        else:
            return jsonify({'success': False, 'error': 'AI could not process the request. Unhandled status.'}), 500

    except Exception as e:
        return jsonify({'success': False, 'error': f"An error occurred: {str(e)}"}), 500

@app.route('/quick-transaction', methods=['POST'])
def quick_transaction():
    if not GROQ_API_KEY:
        return jsonify({'success': False, 'error': 'GROQ_API_KEY environment variable not set. Please create a .env file with your key.'}), 500

    data = request.json
    user_prompt = data.get('prompt')
    user_email = data.get('email')

    if not user_prompt or not user_email:
        return jsonify({'success': False, 'error': 'Prompt and email are required.'}), 400

    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({'success': False, 'error': 'User not found.'}), 404

    try:
        client = groq.Groq(api_key=GROQ_API_KEY)
        today_date = datetime.now()
        
        system_prompt = f"""
        You are an intelligent transaction parser. Your task is to analyze the user's text and extract transaction details.
        Your response MUST be a valid JSON object and nothing else. Today is {today_date.strftime('%A, %m/%d/%Y')}.

        You must categorize the user's input into one of three statuses: "success", "clarification_needed", or "error".

        1.  **SUCCESS (`status: "success"`)**:
            Use this status if all required information (`type`, `date`, `amount`, `store`) is clearly present in the user's text.
            The JSON structure MUST be:
            {{"status": "success", "data": {{"type": "...", "date": "...", "amount": ..., "store": "...", "method": "..."}}}}
            - `type`: CRITICAL: This value MUST be exactly either 'Withdrawal' or 'Deposit'. Do not use any other value, and do NOT include any variations, synonyms, or brand names. If the user implies spending money, use 'Withdrawal'. If they imply receiving money, use 'Deposit'. Do NOT use any other words or phrases.
            - `date`: Must be in 'MM/DD/YYYY' format. Use today's date if not specified.
            - `amount`: Must be a number.
            - `store`: The merchant name or source of income.
            - `method`: CRITICAL: This value MUST be exactly one of: 'Credit', 'Debit', 'Cash', 'Check'. 
              - You MUST NEVER use any other value, and you MUST NEVER use any card brands (such as 'Visa', 'Mastercard', 'Amex', 'Discover', etc.) or any other variations. 
              - If the receipt or text mentions a card brand, you MUST map it to 'Credit' (for credit cards) or 'Debit' (for debit cards), but you MUST NOT use the brand name itself. 
              - If the method is not clear, use your best reasoning to choose from ONLY these four options. 
              - If you are unsure, default to 'Credit' for card payments, but NEVER use a brand name.

        2.  **CLARIFICATION NEEDED (`status: "clarification_needed"`)**:
            Use this status if the user's text looks like a transaction but is missing the `amount` or `store`.
            You MUST ask a friendly question to get the missing information.
            The JSON structure MUST be:
            {{"status": "clarification_needed", "message": "A friendly question asking for the missing details."}}
            - **Do not** guess or fill in missing `amount` or `store`. You must ask for clarification.

        3.  **ERROR (`status: "error"`)**:
            Use this status if the user's input is ambiguous, nonsensical, or cannot be interpreted as a financial transaction (e.g., "hello there", "what is the weather").
            The JSON structure MUST be:
            {{"status": "error", "message": "I couldn't understand that as a transaction. Could you please rephrase it?"}}
        """

        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            model="llama3-8b-8192",
            temperature=0.2,
            max_tokens=256,
            top_p=1,
            stop=None,
            stream=False,
            response_format={"type": "json_object"},
        )

        ai_response_str = chat_completion.choices[0].message.content
        
        try:
            ai_response = json.loads(ai_response_str)
        except json.JSONDecodeError:
            return jsonify({'success': False, 'error': 'AI response was not in a valid JSON format.'}), 500

        if ai_response.get("status") == "clarification_needed":
            return jsonify({'success': False, 'clarification_needed': True, 'message': ai_response.get('message')})

        if ai_response.get("status") == "error":
            return jsonify({'success': False, 'error': ai_response.get('message')})

        if ai_response.get("status") == "success":
            tx_data = ai_response.get("data")
            if not tx_data or not all(k in tx_data for k in ['type', 'date', 'amount', 'store', 'method']):
                return jsonify({'success': False, 'error': 'AI response was missing required transaction data.'}), 500
            
            new_tx = Transaction(
                user_id=user.id,
                type=tx_data.get('type'),
                date=tx_data.get('date'),
                amount=float(tx_data.get('amount')),
                store=tx_data.get('store'),
                method=tx_data.get('method')
            )
            db.session.add(new_tx)
            db.session.commit()
            return jsonify({'success': True})

        return jsonify({'success': False, 'error': 'AI could not process the request. Unhandled status.'}), 500

    except Exception as e:
        return jsonify({'success': False, 'error': f"An error occurred: {str(e)}"}), 500

@app.route('/transactions', methods=['POST'])
def add_transaction():
    data = request.json
    user_email = data.get('email')  # Or use user_id if you have authentication
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({'success': False, 'error': 'User not found.'}), 404

    tx = Transaction(
        user_id=user.id,
        type=data.get('type'),
        date=data.get('date'),
        amount=float(data.get('amount')),
        store=data.get('store'),
        method=data.get('method')
    )
    db.session.add(tx)
    db.session.commit()
    return jsonify({
        'success': True, 
        'transaction': {
            'id': tx.id,
            'type': tx.type,
            'date': tx.date,
            'amount': tx.amount,
            'store': tx.store,
            'method': tx.method
        }
    }), 201

@app.route('/transactions', methods=['GET'])
def get_transactions():
    user_email = request.args.get('email')
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({'success': False, 'error': 'User not found.'}), 404
    transactions = Transaction.query.filter_by(user_id=user.id).all()
    tx_list = [{
        'id': tx.id,
        'type': tx.type,
        'date': tx.date,
        'amount': tx.amount,
        'store': tx.store,
        'method': tx.method
    } for tx in transactions]
    return jsonify({'success': True, 'transactions': tx_list})

@app.route('/transactions/<int:transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    transaction = Transaction.query.get(transaction_id)
    if not transaction:
        return jsonify({'success': False, 'error': 'Transaction not found.'}), 404
    
    db.session.delete(transaction)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/transactions/<int:transaction_id>', methods=['PUT'])
def update_transaction(transaction_id):
    transaction = Transaction.query.get(transaction_id)
    if not transaction:
        return jsonify({'success': False, 'error': 'Transaction not found.'}), 404

    data = request.json
    # Add validation for required fields
    required_fields = ['type', 'date', 'amount', 'store', 'method']
    if not all(field in data for field in required_fields):
        return jsonify({'success': False, 'error': 'Missing required fields.'}), 400

    transaction.type = data['type']
    transaction.date = data['date']
    transaction.amount = float(data['amount'])
    transaction.store = data['store']
    transaction.method = data['method']
    
    db.session.commit()
    return jsonify({'success': True})

@app.route('/transactions/bulk-delete', methods=['POST'])
def bulk_delete_transactions():
    data = request.json
    ids_to_delete = data.get('ids')
    if not ids_to_delete or not isinstance(ids_to_delete, list):
        return jsonify({'success': False, 'error': 'A list of transaction IDs is required.'}), 400

    try:
        Transaction.query.filter(Transaction.id.in_(ids_to_delete)).delete(synchronize_session=False)
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/transactions/bulk-copy', methods=['POST'])
def bulk_copy_transactions():
    data = request.json
    ids_to_copy = data.get('ids')
    if not ids_to_copy or not isinstance(ids_to_copy, list):
        return jsonify({'success': False, 'error': 'A list of transaction IDs is required.'}), 400

    try:
        transactions_to_copy = Transaction.query.filter(Transaction.id.in_(ids_to_copy)).all()
        new_transactions = []
        for tx in transactions_to_copy:
            new_tx = Transaction(
                user_id=tx.user_id,
                type=tx.type,
                date=tx.date,
                amount=tx.amount,
                store=tx.store,
                method=tx.method
            )
            db.session.add(new_tx)
            new_transactions.append(new_tx)
        
        db.session.commit()

        new_tx_list = [{
            'id': tx.id,
            'type': tx.type,
            'date': tx.date,
            'amount': tx.amount,
            'store': tx.store,
            'method': tx.method
        } for tx in new_transactions]

        return jsonify({'success': True, 'transactions': new_tx_list})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/ai-search', methods=['POST'])
def ai_search():
    if not GROQ_API_KEY:
        return jsonify({'error': 'GROQ_API_KEY not configured'}), 500

    data = request.json
    query = data.get('query')
    transactions = data.get('transactions')

    if not query or not transactions:
        return jsonify({'error': 'Query and transactions are required'}), 400

    try:
        client = groq.Groq(api_key=GROQ_API_KEY)
        
        # Prepare a simplified string representation of transactions for the prompt
        tx_string = ""
        for i, tx in enumerate(transactions):
            tx_string += f"ID: {tx['id']}, Date: {tx['date']}, Type: {tx['type']}, Amount: {tx['amount']}, Store/Source: {tx['store']}, Method: {tx['method']}\n"

        system_prompt = f"""
        You are a powerful AI search assistant embedded in a personal finance app. 
        Your primary function is to parse a user's natural language query and identify the corresponding transactions from a provided list.

        **User's Query:** "{query}"

        **Transaction List:**
        {tx_string}

        **Your Task:**
        1.  Analyze the user's query to extract key entities like names, dates, amounts, transaction types (deposit/withdrawal), and payment methods.
        2.  Ignore conversational filler words (e.g., "show me", "find", "a transaction from"). Focus on the core concepts. For the query "a transaction from sid", the keyword is "sid". For "what did I buy at chipotle", the keyword is "chipotle".
        3.  A transaction must match ALL the key concepts extracted from the query. For example, if the query is "sid deposit", you must find transactions where the `Store/Source` is "sid" AND the `Type` is "deposit".
        4.  Your response MUST be a valid JSON object. This object must contain a single key, "matching_ids", which holds an array of the integer IDs of the transactions that precisely match the query's criteria.
        5.  If no transactions match the criteria, or if the query is too ambiguous to be understood, return an empty array: `{{"matching_ids": []}}`.
        6.  Do not provide explanations or any text other than the JSON object.

        **Example:**
        - Query: "lunch last week for $15"
        - You identify transactions with "lunch" in the description/store, dated within the last 7 days, and with an amount of $15.
        - Output: `{{"matching_ids": [id1, id2, ...]}}`
        """

        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt}
            ],
            model="llama3-8b-8192",
            temperature=0,
            max_tokens=1024,
            response_format={"type": "json_object"},
        )

        ai_response_str = chat_completion.choices[0].message.content
        ai_response = json.loads(ai_response_str)
        
        if "matching_ids" not in ai_response or not isinstance(ai_response["matching_ids"], list):
             return jsonify({'error': 'AI response was in an invalid format.'}), 500

        return jsonify(ai_response)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/export-email', methods=['POST'])
def export_email():
    data = request.json
    email = data.get('email')
    image_data = data.get('image')
    if not email or not image_data:
        return jsonify({'success': False, 'error': 'Missing email or image.'}), 400
    try:
        # image_data is a data URL: 'data:image/png;base64,...'
        import base64, re
        match = re.match(r'data:image/(png|jpg|jpeg);base64,(.*)', image_data)
        if not match:
            return jsonify({'success': False, 'error': 'Invalid image data.'}), 400
        img_bytes = base64.b64decode(match.group(2))
        msg = Message('Your Fundify Summary Screenshot', recipients=[email])
        msg.body = 'Hello, Fundify user. Attached below is your Fundify Summary. It has key metrics, graphs, and statistics about your transactions.'
        msg.attach('fundify-summary.png', 'image/png', img_bytes)
        mail.send(msg)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    create_db()
    app.run(debug=True, port=8000) 