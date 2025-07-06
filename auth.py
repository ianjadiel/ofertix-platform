# Sistema de autenticación completo
from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from flask_mail import Message, Mail
import jwt
from datetime import datetime, timedelta

auth_bp = Blueprint('auth', __name__)
mail = Mail()

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validar datos
    if not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email y contraseña requeridos'}), 400
    
    # Verificar si el usuario ya existe
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({'error': 'El usuario ya existe'}), 400
    
    # Crear nuevo usuario
    user = User(
        email=data['email'],
        password_hash=generate_password_hash(data['password']),
        name=data.get('name', ''),
        phone=data.get('phone', '')
    )
    
    db.session.add(user)
    db.session.commit()
    
    # Enviar email de verificación
    send_verification_email(user.email)
    
    return jsonify({
        'success': True,
        'message': 'Usuario registrado. Verifica tu email.'
    })

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    user = User.query.filter_by(email=data['email']).first()
    
    if user and check_password_hash(user.password_hash, data['password']):
        # Generar JWT token
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(days=7)
        }, current_app.config['SECRET_KEY'])
        
        return jsonify({
            'success': True,
            'token': token,
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name
            }
        })
    
    return jsonify({'error': 'Credenciales inválidas'}), 401

def send_verification_email(email):
    token = jwt.encode({
        'email': email,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }, current_app.config['SECRET_KEY'])
    
    msg = Message(
        'Verifica tu cuenta en Ofertix',
        sender=current_app.config['MAIL_DEFAULT_SENDER'],
        recipients=[email]
    )
    
    verification_url = f"https://tudominio.com/verify/{token}"
    msg.html = f"""
    <h2>¡Bienvenido a Ofertix!</h2>
    <p>Haz clic en el enlace para verificar tu cuenta:</p>
    <a href="{verification_url}">Verificar Cuenta</a>
    """
    
    mail.send(msg)