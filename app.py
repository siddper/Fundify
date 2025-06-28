# app.py - Fundify's backend server, manages user data and API endpoints

# Flask web framework and related extensions
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS

# Standard library imports
import json
from datetime import datetime, timedelta
import os
import random

# Third-party imports
import groq
from dotenv import load_dotenv
from flask_mail import Mail, Message
from sqlalchemy import Boolean, String, DateTime

# Load environment variables from .env file
load_dotenv()

# Initialize Flask application
app = Flask(__name__)

# Configure SQLAlchemy database connection
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Get Groq API key from environment variables
# NOTE: For production, use environment variables for sensitive data.
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

# Configure CORS for cross-origin requests
# More permissive CORS configuration for development
CORS(app, origins=["http://127.0.0.1:5501"], supports_credentials=True)

# Configure Flask-Mail for email functionality
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')  # fundifyteam@gmail.com
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')  # App password or Gmail password
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER', 'fundifyteam@gmail.com')

# Initialize Flask-Mail extension
mail = Mail(app)

# Initialize SQLAlchemy database and Bcrypt for password hashing
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

class User(db.Model):
    """User model representing application users with authentication and preferences"""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)  # User's full name
    email = db.Column(db.String(120), unique=True, nullable=False)  # Unique email for login
    password_hash = db.Column(db.String(128), nullable=False)  # Hashed password for security
    
    # Two-factor authentication fields
    two_factor_enabled = db.Column(db.Boolean, default=False)  # Whether 2FA is enabled
    two_factor_code = db.Column(db.String(8), nullable=True)  # Temporary 2FA code
    two_factor_expiry = db.Column(db.DateTime, nullable=True)  # When 2FA code expires
    
    # User preference flags
    disable_reminder_notifications = db.Column(db.Boolean, default=False)  # Opt out of reminder emails
    require_password_for_transactions = db.Column(db.Boolean, default=False)  # Require password for transaction actions
    disable_fundai_transactions = db.Column(db.Boolean, default=False)  # Disable FundAI transaction features
    disable_fundai_reminders = db.Column(db.Boolean, default=False)  # Disable FundAI reminder features

class Transaction(db.Model):
    """Transaction model representing user financial transactions"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Link to user who owns transaction
    
    # Transaction details
    type = db.Column(db.String(32), nullable=False)  # Transaction type (income/expense)
    date = db.Column(db.String(32), nullable=False)  # Transaction date in MM/DD/YYYY format
    amount = db.Column(db.Float, nullable=False)  # Transaction amount
    store = db.Column(db.String(120), nullable=False)  # Store or source of transaction
    method = db.Column(db.String(32), nullable=False)  # Payment method used

    # Relationship to User model - allows accessing user.transactions
    user = db.relationship('User', backref=db.backref('transactions', lazy=True))

class Preset(db.Model):
    """Preset model representing saved transaction templates for quick entry"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Link to user who owns preset
    name = db.Column(db.String(120), nullable=False)  # Name/label for the preset
    type = db.Column(db.String(32), nullable=False)  # Transaction type (income/expense)
    date = db.Column(db.String(32), nullable=False)  # Default date in MM/DD/YYYY format
    amount = db.Column(db.Float, nullable=False)  # Default transaction amount
    store = db.Column(db.String(120), nullable=False)  # Default store or source
    method = db.Column(db.String(32), nullable=False)  # Default payment method

    # Relationship to User model - allows accessing user.presets
    user = db.relationship('User', backref=db.backref('presets', lazy=True))

class Reminder(db.Model):
    """Reminder model representing scheduled financial reminders"""
    id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(120), nullable=False)  # Email of user who set reminder
    amount = db.Column(db.Float, nullable=False)  # Reminder amount
    date = db.Column(db.String(32), nullable=False)  # Reminder date in MM/DD/YYYY format
    time = db.Column(db.String(16), nullable=False)  # Reminder time (HH:MM format)
    description = db.Column(db.String(200), nullable=False)  # Description of what to remember

class Budget(db.Model):
    """Budget model representing monthly budget and goal tracking"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Link to user who owns budget
    month = db.Column(db.Integer, nullable=False)  # Month number (1-12)
    year = db.Column(db.Integer, nullable=False)  # Year for budget period
    budget_amount = db.Column(db.Float, default=0.0)  # Monthly budget limit
    goal_amount = db.Column(db.Float, default=0.0)  # Monthly savings goal
    
    # Relationship to User model - allows accessing user.budgets
    user = db.relationship('User', backref=db.backref('budgets', lazy=True))
    
    # Ensure unique budget per user per month
    __table_args__ = (db.UniqueConstraint('user_id', 'month', 'year', name='_user_month_year_uc'),)

# Create database tables
def create_db():
    with app.app_context():
        db.create_all()

# Register route - handles user registration
@app.route('/register', methods=['POST'])
def register():
    # Extract registration data from request
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    # Validate that all required fields are provided
    if not name or not email or not password:
        return jsonify({'success': False, 'error': 'All fields are required.'}), 400
    
    # Check if email is already registered to prevent duplicates
    if User.query.filter_by(email=email).first():
        return jsonify({'success': False, 'error': 'Email is already registered.'}), 400
    
    # Hash the password for secure storage
    pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    # Create new user instance with hashed password
    user = User(name=name, email=email, password_hash=pw_hash)
    
    # Add user to database session and commit changes
    db.session.add(user)
    db.session.commit()
    
    # Return success response with 201 Created status
    return jsonify({'success': True}), 201

# Login route - handles user login
@app.route('/login', methods=['POST'])
def login():
    # Extract login credentials from request
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    # Validate that both email and password are provided
    if not email or not password:
        return jsonify({'success': False, 'error': 'All fields are required.'}), 400
    
    # Find user by email and verify password
    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({'success': False, 'error': 'Invalid email or password.'}), 401

    # Handle two-factor authentication if enabled
    if user.two_factor_enabled:
        # Generate a random 4-digit verification code
        code = f'{random.randint(1000, 9999)}'
        user.two_factor_code = code
        # Set code expiry to 10 minutes from now
        user.two_factor_expiry = datetime.utcnow() + timedelta(minutes=10)
        db.session.commit()
        
        # Send verification code via email
        try:
            msg = Message('Your Fundify 2FA Code', recipients=[user.email])
            msg.body = f'Your Fundify 2-step verification code is: {code}\nThis code will expire in 10 minutes.'
            mail.send(msg)
        except Exception as e:
            print('2FA email error:', e)
            return jsonify({'success': False, 'error': 'Failed to send 2FA code.'}), 500
        
        # Return response indicating 2FA is required
        return jsonify({'success': False, 'two_factor_required': True, 'email': user.email})

    # Return success response for normal login (no 2FA)
    return jsonify({'success': True, 'user': {'name': user.name, 'email': user.email}})

# Get presets route - retrieves user's saved transaction templates
@app.route('/presets', methods=['GET'])
def get_presets():
    # Extract user email from query parameters
    user_email = request.args.get('email')
    
    # Find user in database by email
    user = User.query.filter_by(email=user_email).first()
    
    # Return error if user doesn't exist
    if not user:
        return jsonify({'success': False, 'error': 'User not found.'}), 404
    
    # Query all presets belonging to this user
    presets = Preset.query.filter_by(user_id=user.id).all()
    
    # Convert preset objects to dictionary format for JSON response
    preset_list = [{
        'id': p.id,
        'name': p.name,
        'type': p.type,
        'date': p.date,
        'amount': p.amount,
        'store': p.store,
        'method': p.method
    } for p in presets]
    
    # Return success response with list of presets
    return jsonify({'success': True, 'presets': preset_list})

# Add new preset route - creates a new transaction template for a user
@app.route('/presets', methods=['POST'])
def add_preset():
    # Extract data from request body
    data = request.json
    user_email = data.get('email')
    
    # Find user in database by email
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({'success': False, 'error': 'User not found.'}), 404

    # Create new preset object with user-provided data
    new_preset = Preset(
        user_id=user.id,
        name=data.get('name'),
        type=data.get('type'),
        date=data.get('date'),
        amount=float(data.get('amount')),
        store=data.get('store'),
        method=data.get('method')
    )
    
    # Save preset to database
    db.session.add(new_preset)
    db.session.commit()
    
    # Return success response with the created preset data
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

# Delete preset route - removes a specific transaction template
@app.route('/presets/<int:preset_id>', methods=['DELETE'])
def delete_preset(preset_id):
    # Find preset in database by ID
    preset = Preset.query.get(preset_id)
    if not preset:
        return jsonify({'success': False, 'error': 'Preset not found.'}), 404
    
    # Optional: Check if the preset belongs to the current user
    # This requires passing user identity with the request (e.g., in headers)
    
    # Remove preset from database
    db.session.delete(preset)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/quick-preset', methods=['POST'])
def quick_preset():
    # Check if GROQ API key is configured
    if not GROQ_API_KEY:
        return jsonify({'success': False, 'error': 'GROQ_API_KEY environment variable not set. Please create a .env file with your key.'}), 500

    # Extract data from request
    data = request.json
    user_prompt = data.get('prompt')
    user_email = data.get('email')

    # Validate required fields
    if not user_prompt or not user_email:
        return jsonify({'success': False, 'error': 'Prompt and email are required.'}), 400
    
    # Find user in database
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({'success': False, 'error': 'User not found.'}), 404

    try:
        # Initialize GROQ client
        client = groq.Groq(api_key=GROQ_API_KEY)
        
        # Define system prompt for AI to parse preset information
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

        # Make API call to GROQ for AI processing
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

        # Extract AI response
        ai_response_str = chat_completion.choices[0].message.content
        
        # Parse JSON response from AI
        try:
            ai_response = json.loads(ai_response_str)
        except json.JSONDecodeError:
            return jsonify({'success': False, 'error': 'AI response was not in a valid JSON format.'}), 500

        # Handle different response statuses from AI
        status = ai_response.get("status")
        if status == "success":
            # Extract preset data from successful AI response
            preset_data = ai_response.get("data")
            if not preset_data or not all(k in preset_data for k in ['name', 'type', 'date', 'amount', 'store', 'method']):
                 return jsonify({'success': False, 'error': 'AI response was missing required preset data.'}), 500

            # Create new preset in database
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

            # Return success response with created preset data
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
            # Return clarification request to user
            return jsonify({'success': False, 'clarification_needed': True, 'message': ai_response.get('message')})
        elif status == "error":
            # Return error message from AI
            return jsonify({'success': False, 'error': ai_response.get('message')})
        else:
            # Handle unexpected status
            return jsonify({'success': False, 'error': 'AI could not process the request. Unhandled status.'}), 500

    except Exception as e:
        # Handle any unexpected errors
        return jsonify({'success': False, 'error': f"An error occurred: {str(e)}"}), 500

@app.route('/quick-transaction', methods=['POST'])
def quick_transaction():
    # Check if GROQ API key is configured
    if not GROQ_API_KEY:
        return jsonify({'success': False, 'error': 'GROQ_API_KEY environment variable not set. Please create a .env file with your key.'}), 500

    # Extract request data
    data = request.json
    user_prompt = data.get('prompt')
    user_email = data.get('email')

    # Validate required fields
    if not user_prompt or not user_email:
        return jsonify({'success': False, 'error': 'Prompt and email are required.'}), 400

    # Find user in database
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({'success': False, 'error': 'User not found.'}), 404

    try:
        # Initialize GROQ client and get current date
        client = groq.Groq(api_key=GROQ_API_KEY)
        today_date = datetime.now()
        
        # Define system prompt for AI transaction parsing
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

        # Make API call to GROQ for transaction parsing
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

        # Extract AI response
        ai_response_str = chat_completion.choices[0].message.content
        
        # Parse JSON response from AI
        try:
            ai_response = json.loads(ai_response_str)
        except json.JSONDecodeError:
            return jsonify({'success': False, 'error': 'AI response was not in a valid JSON format.'}), 500

        # Handle clarification needed status
        if ai_response.get("status") == "clarification_needed":
            return jsonify({'success': False, 'clarification_needed': True, 'message': ai_response.get('message')})

        # Handle error status
        if ai_response.get("status") == "error":
            return jsonify({'success': False, 'error': ai_response.get('message')})

        # Handle success status - create transaction
        if ai_response.get("status") == "success":
            tx_data = ai_response.get("data")
            # Validate all required transaction fields are present
            if not tx_data or not all(k in tx_data for k in ['type', 'date', 'amount', 'store', 'method']):
                return jsonify({'success': False, 'error': 'AI response was missing required transaction data.'}), 500
            
            # Create new transaction in database
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

        # Handle unexpected status
        return jsonify({'success': False, 'error': 'AI could not process the request. Unhandled status.'}), 500

    except Exception as e:
        # Handle any unexpected errors
        return jsonify({'success': False, 'error': f"An error occurred: {str(e)}"}), 500

@app.route('/transactions', methods=['POST'])
def add_transaction():
    """
    Add a new transaction or multiple repeating transactions to the database.
    Supports both single transactions and repeating transactions with configurable intervals.
    """
    # Extract request data
    data = request.json
    user_email = data.get('email')
    
    # Find user by email
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({'success': False, 'error': 'User not found.'}), 404

    # Check if this is a repeating transaction
    is_repeating = data.get('is_repeating', False)

    try:
        if is_repeating:
            # Handle repeating transactions
            base_date_str = data.get('date')
            if not base_date_str:
                return jsonify({'success': False, 'error': 'Date is required for repeating transactions.'}), 400
            
            # Parse the base date and get repeat parameters
            base_date = datetime.strptime(base_date_str, '%m/%d/%Y')
            repeat_count = int(data.get('repeat_count', 1))
            repeat_gap_days = int(data.get('repeat_gap_days', 1))

            # Validate repeat parameters
            if repeat_count <= 0 or repeat_gap_days <= 0:
                return jsonify({'success': False, 'error': 'Repeat count and gap must be positive numbers.'}), 400

            # Create multiple transactions with calculated dates
            for i in range(repeat_count):
                current_date = base_date + timedelta(days=i * repeat_gap_days)
                tx = Transaction(
                    user_id=user.id,
                    type=data.get('type'),
                    date=current_date.strftime('%m/%d/%Y'),
                    amount=float(data.get('amount')),
                    store=data.get('store'),
                    method=data.get('method')
                )
                db.session.add(tx)
            db.session.commit()
            return jsonify({'success': True}), 201
        else:
            # Handle single transaction
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
            
            # Return the created transaction data for single transactions
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

    except (ValueError, TypeError) as e:
        # Handle data validation errors
        db.session.rollback()
        return jsonify({'success': False, 'error': f'Invalid data provided: {e}'}), 400
    except Exception as e:
        # Handle any other unexpected errors
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/transactions', methods=['GET'])
def get_transactions():
    # Get user email from query parameters
    user_email = request.args.get('email')
    
    # Find user by email in database
    user = User.query.filter_by(email=user_email).first()
    
    # Return error if user not found
    if not user:
        return jsonify({'success': False, 'error': 'User not found.'}), 404
    
    # Query all transactions for the user
    transactions = Transaction.query.filter_by(user_id=user.id).all()
    
    # Convert transactions to list of dictionaries for JSON response
    tx_list = [{
        'id': tx.id,
        'type': tx.type,
        'date': tx.date,
        'amount': tx.amount,
        'store': tx.store,
        'method': tx.method
    } for tx in transactions]
    
    # Return success response with transaction list
    return jsonify({'success': True, 'transactions': tx_list})

@app.route('/transactions/<int:transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    # Get transaction by ID from database
    transaction = Transaction.query.get(transaction_id)
    if not transaction:
        return jsonify({'success': False, 'error': 'Transaction not found.'}), 404
    
    # Delete transaction from database
    db.session.delete(transaction)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/transactions/<int:transaction_id>', methods=['PUT'])
def update_transaction(transaction_id):
    # Get transaction by ID from database
    transaction = Transaction.query.get(transaction_id)
    if not transaction:
        return jsonify({'success': False, 'error': 'Transaction not found.'}), 404

    # Get JSON data from request
    data = request.json
    # Validate that all required fields are present
    required_fields = ['type', 'date', 'amount', 'store', 'method']
    if not all(field in data for field in required_fields):
        return jsonify({'success': False, 'error': 'Missing required fields.'}), 400

    # Update transaction fields with new data
    transaction.type = data['type']
    transaction.date = data['date']
    transaction.amount = float(data['amount'])  # Convert amount to float
    transaction.store = data['store']
    transaction.method = data['method']
    
    # Save changes to database
    db.session.commit()
    return jsonify({'success': True})

@app.route('/transactions/bulk-delete', methods=['POST'])
def bulk_delete_transactions():
    # Get JSON data from request
    data = request.json
    # Extract list of transaction IDs to delete
    ids_to_delete = data.get('ids')
    
    # Validate that ids_to_delete is a non-empty list
    if not ids_to_delete or not isinstance(ids_to_delete, list):
        return jsonify({'success': False, 'error': 'A list of transaction IDs is required.'}), 400

    try:
        # Delete all transactions with IDs in the provided list
        Transaction.query.filter(Transaction.id.in_(ids_to_delete)).delete(synchronize_session=False)
        # Commit the changes to the database
        db.session.commit()
        # Return success response
        return jsonify({'success': True})
    except Exception as e:
        # Rollback database changes if an error occurs
        db.session.rollback()
        # Return error response with exception details
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/transactions/bulk-copy', methods=['POST'])
def bulk_copy_transactions():
    # Get JSON data from request
    data = request.json
    # Extract list of transaction IDs to copy
    ids_to_copy = data.get('ids')
    
    # Validate that ids_to_copy is a non-empty list
    if not ids_to_copy or not isinstance(ids_to_copy, list):
        return jsonify({'success': False, 'error': 'A list of transaction IDs is required.'}), 400

    try:
        # Fetch all transactions with IDs in the provided list
        transactions_to_copy = Transaction.query.filter(Transaction.id.in_(ids_to_copy)).all()
        new_transactions = []
        
        # Create new transaction objects for each transaction to be copied
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
        
        # Commit all new transactions to database
        db.session.commit()

        # Prepare list of new transaction data for response
        new_tx_list = [{
            'id': tx.id,
            'type': tx.type,
            'date': tx.date,
            'amount': tx.amount,
            'store': tx.store,
            'method': tx.method
        } for tx in new_transactions]

        # Return success response with new transaction data
        return jsonify({'success': True, 'transactions': new_tx_list})
    except Exception as e:
        # Rollback database changes if an error occurs
        db.session.rollback()
        # Return error response with exception details
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/ai-search', methods=['POST'])
def ai_search():
    # Check if GROQ API key is configured
    if not GROQ_API_KEY:
        return jsonify({'error': 'GROQ_API_KEY not configured'}), 500

    # Extract query and transactions from request data
    data = request.json
    query = data.get('query')
    transactions = data.get('transactions')

    # Validate required parameters
    if not query or not transactions:
        return jsonify({'error': 'Query and transactions are required'}), 400

    try:
        # Initialize GROQ client
        client = groq.Groq(api_key=GROQ_API_KEY)
        
        # Prepare a simplified string representation of transactions for the prompt
        tx_string = ""
        for i, tx in enumerate(transactions):
            tx_string += f"ID: {tx['id']}, Date: {tx['date']}, Type: {tx['type']}, Amount: {tx['amount']}, Store/Source: {tx['store']}, Method: {tx['method']}\n"

        # Define system prompt for AI search assistant
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

        # Make API call to GROQ for AI search completion
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt}
            ],
            model="llama3-8b-8192",
            temperature=0,
            max_tokens=1024,
            response_format={"type": "json_object"},
        )

        # Parse AI response
        ai_response_str = chat_completion.choices[0].message.content
        ai_response = json.loads(ai_response_str)
        
        # Validate AI response format
        if "matching_ids" not in ai_response or not isinstance(ai_response["matching_ids"], list):
             return jsonify({'error': 'AI response was in an invalid format.'}), 500

        # Return successful response with matching transaction IDs
        return jsonify(ai_response)

    except Exception as e:
        # Return error response if any exception occurs
        return jsonify({'error': str(e)}), 500

@app.route('/export-email', methods=['POST'])
def export_email():
    """
    Export a Fundify summary screenshot via email.
    
    Expects JSON payload with:
    - email: recipient email address
    - image: base64 encoded image data URL
    
    Returns JSON response indicating success/failure
    """
    # Extract email and image data from request
    data = request.json
    email = data.get('email')
    image_data = data.get('image')
    
    # Validate required fields
    if not email or not image_data:
        return jsonify({'success': False, 'error': 'Missing email or image.'}), 400
    
    try:
        # Parse base64 image data from data URL format
        # Expected format: 'data:image/png;base64,<base64_data>'
        import base64, re
        match = re.match(r'data:image/(png|jpg|jpeg);base64,(.*)', image_data)
        if not match:
            return jsonify({'success': False, 'error': 'Invalid image data.'}), 400
        
        # Decode base64 image data to bytes
        img_bytes = base64.b64decode(match.group(2))
        
        # Create email message with screenshot attachment
        msg = Message('Your Fundify Summary Screenshot', recipients=[email])
        msg.body = 'Hello, Fundify user. Attached below is your Fundify Summary. It has key metrics, graphs, and statistics about your transactions.'
        msg.attach('fundify-summary.png', 'image/png', img_bytes)
        
        # Send email
        mail.send(msg)
        return jsonify({'success': True})
        
    except Exception as e:
        # Return error response if email sending fails
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/ai-explain-score', methods=['POST'])
def ai_explain_score():
    """
    AI endpoint to explain a user's Fundify Score in plain English.
    
    Expects JSON payload with:
    - transactions: list of transaction objects
    - score: Fundify Score (0-100)
    - positives: list of positive factors
    - negatives: list of negative factors  
    - advice: list of advice items
    
    Returns JSON response with explanation text
    """
    # Check if GROQ API key is configured
    if not GROQ_API_KEY:
        return jsonify({'error': 'GROQ_API_KEY not configured'}), 500
    
    # Extract data from request
    data = request.json
    transactions = data.get('transactions', [])
    score = data.get('score')
    positives = data.get('positives', [])
    negatives = data.get('negatives', [])
    advice = data.get('advice', [])
    
    try:
        # Initialize GROQ client
        client = groq.Groq(api_key=GROQ_API_KEY)
        
        # Build transaction string for prompt (limit to 30 transactions to keep prompt size manageable)
        tx_string = ''
        for tx in transactions[:30]:
            tx_string += f"Date: {tx.get('date')}, Type: {tx.get('type')}, Amount: {tx.get('amount')}, Store: {tx.get('store')}, Method: {tx.get('method')}\n"
        
        # Construct AI prompt for score explanation
        prompt = f"""
        You are a financial assistant. The user has a Fundify Score of {score} out of 100, calculated from their recent transactions and financial behavior. Here are the key factors:
        Positives: {positives}
        Negatives: {negatives}
        Advice: {advice}
        Here are some of their recent transactions:
        {tx_string}

        In 3-5 sentences, explain in plain English why their score is what it is. Focus on the most important factors, and avoid repeating the full lists verbatim. Make it friendly and easy to understand.

        Respond ONLY with a valid JSON object: {{"explanation": "your explanation here"}}
        """
        
        # Make API call to GROQ
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a helpful financial assistant."},
                {"role": "user", "content": prompt}
            ],
            model="llama3-8b-8192",
            temperature=0.5,
            max_tokens=256,
            top_p=1,
            stop=None,
            stream=False,
            response_format={"type": "json_object"},
        )
        
        # Extract response content
        ai_response_str = chat_completion.choices[0].message.content
        
        # Parse JSON response, fallback to raw string if parsing fails
        try:
            ai_response = json.loads(ai_response_str)
            explanation = ai_response.get('explanation') or ai_response_str
        except Exception:
            explanation = ai_response_str
            
        return jsonify({'explanation': explanation})
        
    except Exception as e:
        # Log error and return error response
        print('AI endpoint error (explain-score):', e)
        return jsonify({'error': str(e)}), 500

@app.route('/ai-recommendations', methods=['POST'])
def ai_recommendations():
    # Check if GROQ API key is configured
    if not GROQ_API_KEY:
        return jsonify({'error': 'GROQ_API_KEY not configured'}), 500
    
    # Extract data from request
    data = request.json
    transactions = data.get('transactions', [])
    score = data.get('score')
    positives = data.get('positives', [])
    negatives = data.get('negatives', [])
    advice = data.get('advice', [])
    
    try:
        # Initialize GROQ client
        client = groq.Groq(api_key=GROQ_API_KEY)
        
        # Build transaction string from recent transactions (limit to 30)
        tx_string = ''
        for tx in transactions[:30]:
            tx_string += f"Date: {tx.get('date')}, Type: {tx.get('type')}, Amount: {tx.get('amount')}, Store: {tx.get('store')}, Method: {tx.get('method')}\n"
        
        # Construct AI prompt for personalized recommendations
        prompt = f"""
        You are a financial AI coach. The user has a Fundify Score of {score} out of 100. Here are their key positives: {positives}. Here are their negatives: {negatives}. Here is some advice: {advice}.
        Here are some of their recent transactions:
        {tx_string}

        Based on this, give 3-4 highly actionable, personalized recommendations to help them improve their score and financial health. Be specific and friendly. Do not repeat the advice list verbatim; add new, creative, or more detailed suggestions. These should be very short, concise, and effective, 1 sentence only

        Respond ONLY with a valid JSON object: {{"recommendations": ["recommendation 1", "recommendation 2", ...]}}
        """
        
        # Make API call to GROQ for AI recommendations
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a helpful financial coach."},
                {"role": "user", "content": prompt}
            ],
            model="llama3-8b-8192",
            temperature=0.7,
            max_tokens=256,
            top_p=1,
            stop=None,
            stream=False,
            response_format={"type": "json_object"},
        )
        
        # Extract response content from AI
        ai_response_str = chat_completion.choices[0].message.content
        
        # Parse JSON response, fallback to raw string if parsing fails
        try:
            ai_response = json.loads(ai_response_str)
            recommendations = ai_response.get('recommendations') or ai_response_str
        except Exception:
            recommendations = ai_response_str
            
        return jsonify({'recommendations': recommendations})
        
    except Exception as e:
        # Log error and return error response
        print('AI endpoint error (recommendations):', e)
        return jsonify({'error': str(e)}), 500

@app.route('/budget', methods=['GET'])
def get_budget():
    """
    Get budget information for a specific user and month/year.
    
    Query Parameters:
    - email: User's email address
    - month: Month number (1-12)
    - year: Year number
    
    Returns:
    - JSON response with budget data or error message
    """
    # Extract query parameters
    user_email = request.args.get('email')
    month = request.args.get('month', type=int)
    year = request.args.get('year', type=int)
    
    # Validate required parameters
    if not user_email:
        return jsonify({'success': False, 'error': 'Email required.'}), 400
    
    if not month or not year:
        return jsonify({'success': False, 'error': 'Month and year required.'}), 400
    
    # Find user by email
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({'success': False, 'error': 'User not found.'}), 404
    
    # Query for existing budget for the specified month/year
    budget = Budget.query.filter_by(user_id=user.id, month=month, year=year).first()
    
    # Return budget data if found, otherwise return default values
    if budget:
        return jsonify({
            'success': True,
            'budget': {
                'budget_amount': budget.budget_amount,
                'goal_amount': budget.goal_amount
            }
        })
    else:
        # Return default budget values when no budget exists
        return jsonify({
            'success': True,
            'budget': {
                'budget_amount': 0.0,
                'goal_amount': 0.0
            }
        })

@app.route('/budget', methods=['POST'])
def update_budget():
    """
    Update or create budget information for a specific user and month/year.
    
    Request Body:
    - email: User's email address
    - month: Month number (1-12)
    - year: Year number
    - budget_amount: Monthly budget amount (optional)
    - goal_amount: Monthly goal amount (optional)
    
    Returns:
    - JSON response with updated budget data or error message
    """
    # Extract data from request body
    data = request.json
    user_email = data.get('email')
    month = data.get('month')
    year = data.get('year')
    budget_amount = data.get('budget_amount')
    goal_amount = data.get('goal_amount')
    
    # Validate required parameters
    if not all([user_email, month, year]):
        return jsonify({'success': False, 'error': 'Email, month, and year are required.'}), 400
    
    # Ensure at least one budget value is provided
    if budget_amount is None and goal_amount is None:
        return jsonify({'success': False, 'error': 'At least one of budget_amount or goal_amount must be provided.'}), 400
    
    # Find user by email
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({'success': False, 'error': 'User not found.'}), 404
    
    # Query for existing budget for the specified month/year
    budget = Budget.query.filter_by(user_id=user.id, month=month, year=year).first()
    
    if budget:
        # Update existing budget with new values (only if provided)
        if budget_amount is not None:
            budget.budget_amount = float(budget_amount)
        if goal_amount is not None:
            budget.goal_amount = float(goal_amount)
    else:
        # Create new budget record for this month/year
        budget = Budget(
            user_id=user.id,
            month=month,
            year=year,
            budget_amount=float(budget_amount) if budget_amount is not None else 0.0,
            goal_amount=float(goal_amount) if goal_amount is not None else 0.0
        )
        db.session.add(budget)
    
    # Commit changes to database
    db.session.commit()
    
    # Return updated budget data
    return jsonify({
        'success': True,
        'budget': {
            'budget_amount': budget.budget_amount,
            'goal_amount': budget.goal_amount
        }
    })

# FundAI Chat Endpoint - Handles AI-powered financial conversations with users
@app.route('/fundai-chat', methods=['POST'])
def fundai_chat():
    """
    Handles AI-powered financial conversations with users using GROQ API.
    Processes user messages and provides personalized financial insights based on
    transaction data and reminders (if user has enabled access).
    """
    # Check if GROQ API key is configured for AI functionality
    if not GROQ_API_KEY:
        return jsonify({'success': False, 'error': 'GROQ_API_KEY not configured'}), 500
    
    # Extract user data from the request
    data = request.json
    user_message = data.get('message')  # The user's question or message to FundAI
    user_email = data.get('email')      # User's email for authentication
    transactions = data.get('transactions', [])  # Recent transaction data for context

    # Validate that required fields are present
    if not user_message or not user_email:
        return jsonify({'success': False, 'error': 'Message and email are required.'}), 400

    # Find the user in the database using their email
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({'success': False, 'error': 'User not found.'}), 404

    # Fetch all reminders for the user from the database
    reminders = Reminder.query.filter_by(user_email=user_email).all()
    # Convert reminder objects to a list of dictionaries for easier processing
    reminders_list = [
        {
            'id': r.id,
            'amount': r.amount,
            'date': r.date,
            'time': r.time,
            'description': r.description
        } for r in reminders
    ]

    try:
        # Initialize the GROQ AI client
        client = groq.Groq(api_key=GROQ_API_KEY)
        
        # Build transaction context for the AI based on user preferences
        tx_context = ""
        if not user.disable_fundai_transactions:  # Check if user has enabled transaction access
            if transactions:  # If transactions exist, format them for AI context
                tx_context = "Here are your recent transactions:\n"
                # Include only the last 20 transactions to keep context manageable
                for tx in transactions[-20:]:
                    tx_context += f"- {tx['date']}: {tx['type']} ${tx['amount']} at {tx['store']} ({tx['method']})\n"
            else:
                tx_context = "You don't have any transactions recorded yet."
        else:
            # User has disabled transaction access for privacy
            tx_context = "(You have disabled FundAI's access to your transactions.)"

        # Build reminders context for the AI based on user preferences
        reminders_context = ""
        if not user.disable_fundai_reminders:  # Check if user has enabled reminder access
            reminders_context = "Here are your upcoming reminders (bills, payments, etc):\n"
            if reminders_list:  # If reminders exist, format them for AI context
                # Include only the last 20 reminders to keep context manageable
                for r in reminders_list[-20:]:
                    reminders_context += f"- {r['date']} at {r['time']}: ${r['amount']} for {r['description']}\n"
            else:
                reminders_context = "You don't have any reminders set."
        else:
            # User has disabled reminder access for privacy
            reminders_context = "(You have disabled FundAI's access to your reminders.)"

        # Create the system prompt that defines FundAI's personality and capabilities
        system_prompt = f"""
        You are FundAI, a helpful and friendly financial assistant for the Fundify app. You have access to the user's transaction data and reminders, and can provide personalized financial insights.

        **Your Capabilities:**
        - Analyze spending patterns and trends
        - Provide budgeting advice
        - Answer questions about specific transactions or reminders
        - Help with financial planning
        - Explain financial concepts in simple terms
        - Identify potential areas for saving money
        - Suggest ways to improve financial health
        - Reference the user's reminders for upcoming bills, payments, or important dates

        **User's Transaction Data:**
        {tx_context}

        **User's Reminders:**
        {reminders_context}

        **Guidelines:**
        - Be conversational, friendly, and helpful
        - Provide specific, actionable advice when possible
        - Use the transaction and reminder data to give personalized insights
        - Keep responses concise but informative (2-4 sentences typically)
        - If asked about data you don't have, politely explain what information would be needed
        - Focus on being helpful rather than judgmental
        - Use simple, clear language

        **Response Format:**
        Respond naturally as a helpful financial assistant. Do not use JSON format - just provide a conversational response.
        """

        # Make the API call to GROQ AI with the prepared context and user message
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},  # AI personality and context
                {"role": "user", "content": user_message}      # User's actual question
            ],
            model="llama3-8b-8192",  # Use Llama 3.1 8B model for good performance
            temperature=0.7,         # Moderate creativity for varied responses
            max_tokens=512,          # Limit response length for concise answers
            top_p=1,                 # Use full probability distribution
            stop=None,               # No specific stop sequences
            stream=False,            # Get complete response at once
        )

        # Extract the AI's response from the completion
        ai_response = chat_completion.choices[0].message.content
        
        # Return successful response with the AI's answer
        return jsonify({
            'success': True,
            'response': ai_response
        })

    except Exception as e:
        # Log the error for debugging purposes
        print('FundAI chat error:', e)
        # Return error response to the client
        return jsonify({'success': False, 'error': f"An error occurred: {str(e)}"}), 500

# Reminders GET Endpoint - Retrieves all reminders for a specific user
@app.route('/reminders', methods=['GET'])
def get_reminders():
    """
    GET endpoint to retrieve all reminders for a specific user.
    
    Query Parameters:
        email (str): The user's email address to filter reminders by
        
    Returns:
        JSON response with success status and list of reminders or error message
    """
    # Extract user email from query parameters
    user_email = request.args.get('email')
    
    # Validate that email is provided - return 400 error if missing
    if not user_email:
        return jsonify({'success': False, 'error': 'Email required'}), 400
    
    # Query the database for all reminders belonging to this user
    # Uses SQLAlchemy filter_by to get reminders where user_email matches
    reminders = Reminder.query.filter_by(user_email=user_email).all()
    
    # Return the reminders as a JSON response with success status
    # Convert each reminder object to a dictionary with relevant fields
    return jsonify({'success': True, 'reminders': [
        {
            'id': r.id,                    # Unique reminder identifier (primary key)
            'amount': r.amount,            # Dollar amount for the reminder (float)
            'date': r.date,                # Date when reminder should trigger (YYYY-MM-DD)
            'time': r.time,                # Time when reminder should trigger (HH:MM)
            'description': r.description   # What the reminder is for (text)
        } for r in reminders
    ]})

@app.route('/reminders', methods=['POST'])
def add_reminder():
    """
    POST endpoint to create a new reminder for a user.
    
    Request Body:
        email (str): The user's email address
        amount (float): Dollar amount for the reminder
        date (str): Date when reminder should trigger (YYYY-MM-DD)
        time (str): Time when reminder should trigger (HH:MM)
        description (str): What the reminder is for
        
    Returns:
        JSON response with success status and created reminder data or error message
    """
    # Extract data from the request body
    data = request.json
    user_email = data.get('email')
    amount = data.get('amount')
    date = data.get('date')
    time = data.get('time')
    description = data.get('description')
    
    # Validate that all required fields are provided
    if not all([user_email, amount, date, time, description]):
        return jsonify({'success': False, 'error': 'All fields required'}), 400
    
    # Create a new Reminder object with the provided data
    reminder = Reminder(
        user_email=user_email,
        amount=float(amount),  # Convert amount to float for database storage
        date=date,
        time=time,
        description=description
    )
    
    # Add the reminder to the database session and commit the transaction
    db.session.add(reminder)
    db.session.commit()
    
    # Return successful response with the created reminder data
    return jsonify({'success': True, 'reminder': {
        'id': reminder.id,                    # Unique reminder identifier (primary key)
        'amount': reminder.amount,            # Dollar amount for the reminder (float)
        'date': reminder.date,                # Date when reminder should trigger (YYYY-MM-DD)
        'time': reminder.time,                # Time when reminder should trigger (HH:MM)
        'description': reminder.description   # What the reminder is for (text)
    }}), 201

@app.route('/reminders/<int:reminder_id>', methods=['PUT'])
def update_reminder(reminder_id):
    """
    PUT endpoint to update an existing reminder.
    
    Args:
        reminder_id (int): The ID of the reminder to update
        
    Request Body:
        amount (float, optional): New dollar amount for the reminder
        date (str, optional): New date when reminder should trigger (YYYY-MM-DD)
        time (str, optional): New time when reminder should trigger (HH:MM)
        description (str, optional): New description of what the reminder is for
        
    Returns:
        JSON response with success status or error message
    """
    # Extract data from the request body
    data = request.json
    
    # Find the reminder by ID
    reminder = Reminder.query.get(reminder_id)
    if not reminder:
        return jsonify({'success': False, 'error': 'Reminder not found'}), 404
    
    # Update only the fields that are provided in the request
    for field in ['amount', 'date', 'time', 'description']:
        if field in data:
            setattr(reminder, field, data[field])
    
    # Commit changes to the database
    db.session.commit()
    return jsonify({'success': True})

@app.route('/reminders/<int:reminder_id>', methods=['DELETE'])
def delete_reminder(reminder_id):
    """
    DELETE endpoint to remove a reminder.
    
    Args:
        reminder_id (int): The ID of the reminder to delete
        
    Returns:
        JSON response with success status or error message
    """
    # Find the reminder by ID
    reminder = Reminder.query.get(reminder_id)
    if not reminder:
        return jsonify({'success': False, 'error': 'Reminder not found'}), 404
    
    # Delete the reminder from the database
    db.session.delete(reminder)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/help-ai', methods=['POST'])
def help_ai():
    """
    POST endpoint to get AI assistance using Groq API.
    
    Request Body:
        question (str): The user's question
        context (str): Context information to help the AI understand the question
        
    Returns:
        JSON response with AI answer or error message
    """
    # Extract data from the request body
    data = request.json
    question = data.get('question')
    context = data.get('context')
    
    # Validate that both question and context are provided
    if not question or not context:
        return jsonify({'success': False, 'error': 'Both question and context are required.'}), 400
    
    # Check if GROQ API key is configured
    if not GROQ_API_KEY:
        return jsonify({'success': False, 'error': 'GROQ_API_KEY not configured'}), 500
    
    try:
        # Import and initialize Groq client
        import groq
        client = groq.Groq(api_key=GROQ_API_KEY)
        
        # Set up the conversation with system prompt and user question
        system_prompt = context
        user_prompt = question
        
        # Create chat completion with AI model
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            model="llama3-8b-8192",
            temperature=0.2,
            max_tokens=512,
            top_p=1,
            stop=None,
            stream=False,
        )
        
        # Extract and return the AI response
        ai_response = chat_completion.choices[0].message.content
        return jsonify({'answer': ai_response})
        
    except Exception as e:
        # Log error and return error response
        print('HELP-AI ERROR:', e)
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/user-info', methods=['GET'])
def user_info():
    """
    Get user information by email address.
    
    Args:
        email (str): Email address from query parameters
        
    Returns:
        JSON response with user data or error message
    """
    # Get email from query parameters
    email = request.args.get('email')
    
    # Validate email parameter
    if not email:
        return jsonify({'success': False, 'error': 'Email required.'}), 400
    
    # Query database for user
    user = User.query.filter_by(email=email).first()
    
    # Check if user exists
    if not user:
        return jsonify({'success': False, 'error': 'User not found.'}), 404
    
    # Return user data in JSON format
    return jsonify({'success': True, 'user': {
        'name': user.name,
        'email': user.email,
        'two_factor_enabled': user.two_factor_enabled,
        'disable_reminder_notifications': user.disable_reminder_notifications,
        'require_password_for_transactions': user.require_password_for_transactions,
        'disable_fundai_transactions': user.disable_fundai_transactions,
        'disable_fundai_reminders': user.disable_fundai_reminders
    }})

@app.route('/update-user', methods=['POST'])
def update_user():
    """
    Update user information fields.
    
    Args:
        email (str): User's email address
        field (str): Field name to update
        value: New value for the field
        
    Returns:
        JSON response indicating success or error
    """
    # Extract data from request body
    data = request.json
    email = data.get('email')
    field = data.get('field')
    value = data.get('value')
    
    # Validate required fields
    if not email or not field or value is None:
        return jsonify({'success': False, 'error': 'Missing required fields.'}), 400

    # Query database for user
    user = User.query.filter_by(email=email).first()
    
    # Check if user exists
    if not user:
        return jsonify({'success': False, 'error': 'User not found.'}), 404

    # Update specific field based on field name
    if field == 'name':
        user.name = value
    elif field == 'email':
        # Check if new email is already taken by another user
        if User.query.filter_by(email=value).first():
            return jsonify({'success': False, 'error': 'Email already in use.'}), 400
        user.email = value
    elif field == 'password':
        # Hash password before storing
        user.password_hash = bcrypt.generate_password_hash(value).decode('utf-8')
    elif field == 'disable_reminder_notifications':
        # Convert to boolean for notification settings
        user.disable_reminder_notifications = bool(value)
    elif field == 'require_password_for_transactions':
        # Convert to boolean for transaction security
        user.require_password_for_transactions = bool(value)
    elif field == 'disable_fundai_transactions':
        # Convert to boolean for Fundai transaction settings
        user.disable_fundai_transactions = bool(value)
    elif field == 'disable_fundai_reminders':
        # Convert to boolean for Fundai reminder settings
        user.disable_fundai_reminders = bool(value)
    else:
        # Return error for invalid field names
        return jsonify({'success': False, 'error': 'Invalid field.'}), 400

    # Commit changes to database
    db.session.commit()
    
    # Return success response
    return jsonify({'success': True})

@app.route('/verify-2fa', methods=['POST'])
def verify_2fa():
    """
    POST endpoint to verify a 2FA code for user authentication.
    
    Request Body:
        email (str): The user's email address
        code (str): The 2FA verification code entered by user
        
    Returns:
        JSON response with success status and user data or error message
    """
    # Extract data from request body
    data = request.json
    email = data.get('email')
    code = data.get('code')
    
    # Find user by email
    user = User.query.filter_by(email=email).first()
    
    # Check if user exists and has 2FA enabled
    if not user or not user.two_factor_enabled:
        return jsonify({'success': False, 'error': '2FA not enabled.'}), 400
    
    # Check if 2FA code exists and hasn't expired
    if not user.two_factor_code or not user.two_factor_expiry or datetime.utcnow() > user.two_factor_expiry:
        return jsonify({'success': False, 'error': '2FA code expired. Please sign in again.'}), 400
    
    # Verify the provided code matches the stored code
    if user.two_factor_code != code:
        return jsonify({'success': False, 'error': 'Invalid 2FA code.'}), 400
    
    # Clear 2FA code and expiry after successful verification for security
    user.two_factor_code = None
    user.two_factor_expiry = None
    db.session.commit()
    
    # Return success with user data
    return jsonify({'success': True, 'user': {'name': user.name, 'email': user.email}})

@app.route('/enable-2fa', methods=['POST'])
def enable_2fa():
    """
    POST endpoint to enable 2FA for a user account.
    
    Request Body:
        email (str): The user's email address
        
    Returns:
        JSON response with success status or error message
    """
    # Extract data from request body
    data = request.json
    email = data.get('email')
    
    # Find user by email
    user = User.query.filter_by(email=email).first()
    
    # Check if user exists
    if not user:
        return jsonify({'success': False, 'error': 'User not found.'}), 404
    
    # Enable 2FA for the user
    user.two_factor_enabled = True
    db.session.commit()
    
    # Return success response
    return jsonify({'success': True})

@app.route('/disable-2fa', methods=['POST'])
def disable_2fa():
    """
    POST endpoint to disable 2FA for a user account.
    
    Request Body:
        email (str): The user's email address
        
    Returns:
        JSON response with success status or error message
    """
    # Extract data from request body
    data = request.json
    email = data.get('email')
    
    # Find user by email
    user = User.query.filter_by(email=email).first()
    
    # Check if user exists
    if not user:
        return jsonify({'success': False, 'error': 'User not found.'}), 404
    
    # Disable 2FA for the user
    user.two_factor_enabled = False
    db.session.commit()
    
    # Return success response
    return jsonify({'success': True})

@app.route('/delete-account', methods=['POST'])
def delete_account():
    """
    POST endpoint to permanently delete a user account and all associated data.
    
    Request Body:
        email (str): The user's email address
        
    Returns:
        JSON response with success status or error message
    """
    # Extract email from request body
    data = request.json
    email = data.get('email')
    
    # Validate that email is provided - return 400 error if missing
    if not email:
        return jsonify({'success': False, 'error': 'Email required.'}), 400
    
    # Find user by email in the database
    user = User.query.filter_by(email=email).first()
    
    # Check if user exists - return 404 error if not found
    if not user:
        return jsonify({'success': False, 'error': 'User not found.'}), 404
    
    try:
        # Delete all related data associated with the user
        # Remove all transactions belonging to this user
        Transaction.query.filter_by(user_id=user.id).delete()
        
        # Remove all presets (saved transaction templates) for this user
        Preset.query.filter_by(user_id=user.id).delete()
        
        # Remove all budget entries for this user
        Budget.query.filter_by(user_id=user.id).delete()
        
        # Remove all reminders associated with this user's email
        Reminder.query.filter_by(user_email=user.email).delete()
        
        # Delete the user account itself
        db.session.delete(user)
        
        # Commit all deletions to the database
        db.session.commit()
        
        # Return successful response
        return jsonify({'success': True})
        
    except Exception as e:
        # If any error occurs during deletion, rollback the transaction
        db.session.rollback()
        # Return error response with details
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    # Initialize the database tables
    create_db()
    # Start the Flask development server
    app.run(debug=True, port=8000) 