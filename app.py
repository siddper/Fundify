from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# More permissive CORS configuration for development
CORS(app, origins=["http://127.0.0.1:5500"], supports_credentials=True)

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
    return jsonify({'success': True, 'transaction_id': tx.id}), 201

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

if __name__ == '__main__':
    create_db()
    app.run(debug=True, port=8000) 