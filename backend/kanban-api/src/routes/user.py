from flask import Blueprint, jsonify, request
from src.models.user import User, db
import jwt
from datetime import datetime, timedelta
from functools import wraps

user_bp = Blueprint('user', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, 'asdf#FGSgvasgf$5$WGT', algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

@user_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    
    if not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Username, email and password are required!'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Username already exists!'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already exists!'}), 400
    
    user = User(username=data['username'], email=data['email'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'User created successfully!', 'user': user.to_dict()}), 201

@user_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    
    if not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Username and password are required!'}), 400
    
    user = User.query.filter_by(username=data['username']).first()
    
    if user and user.check_password(data['password']):
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, 'asdf#FGSgvasgf$5$WGT', algorithm='HS256')
        
        return jsonify({
            'token': token,
            'user': user.to_dict()
        })
    
    return jsonify({'message': 'Invalid credentials!'}), 401

@user_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    return jsonify(current_user.to_dict())

@user_bp.route('/users', methods=['GET'])
@token_required
def get_users(current_user):
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@user_bp.route('/users/<int:user_id>', methods=['GET'])
@token_required
def get_user(current_user, user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())
