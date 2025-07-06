# Aplicación principal completa y gratuita
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import requests
import os
from dotenv import load_dotenv
from database_complete import OfertixDatabase
from affiliate_system import AffiliateManager
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import json
import secrets
from datetime import datetime, timedelta
import sqlite3

# Cargar configuración
load_dotenv('.env.free')

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'ofertix_secret_key_2024')

# Inicializar sistemas
db = OfertixDatabase()
affiliate_manager = AffiliateManager()

@app.route('/')
def index():
    """Página principal"""
    # Obtener productos destacados
    featured_products = db.get_products(limit=12)
    stats = db.get_statistics()
    
    return render_template('index.html', 
                         featured_products=featured_products,
                         stats=stats)

@app.route('/register', methods=['POST'])
def register():
    """Registro de usuarios"""
    try:
        data = request.get_json()
        
        result = db.add_user(
            email=data['email'],
            password=data['password'],
            name=data.get('name', ''),
            phone=data.get('phone', '')
        )
        
        if result['success']:
            # Enviar email de verificación
            send_verification_email(data['email'], result['verification_token'])
            
            return jsonify({
                'success': True,
                'message': 'Usuario registrado. Verifica tu email.',
                'user_id': result['user_id']
            })
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Error en el registro: {str(e)}'
        }), 500

@app.route('/login', methods=['POST'])
def login():
    """Inicio de sesión"""
    try:
        data = request.get_json()
        
        result = db.verify_user(data['email'], data['password'])
        
        if result['success']:
            # Guardar en sesión
            session['user_id'] = result['user']['id']
            session['user_email'] = result['user']['email']
            session['user_name'] = result['user']['name']
            
            return jsonify({
                'success': True,
                'message': 'Inicio de sesión exitoso',
                'user': result['user']
            })
        else:
            return jsonify(result), 401
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Error en el login: {str(e)}'
        }), 500

@app.route('/search', methods=['POST'])
def search():
    """Búsqueda de productos"""
    try:
        data = request.get_json()
        query = data.get('query', '')
        
        if not query:
            return jsonify({'error': 'Query requerido'}), 400
        
        # Buscar en base de datos local primero
        products = search_local_products(query)
        
        # Si no hay suficientes productos, buscar en APIs externas
        if len(products) < 5:
            external_products = search_external_products(query)
            products.extend(external_products)
        
        # Generar enlaces de afiliado
        for product in products:
            if 'user_id' in session:
                product['affiliate_url'] = affiliate_manager.generate_affiliate_link(
                    product['store_name'],
                    product['store_url'],
                    session['user_id'],
                    product.get('id')
                )
            else:
                product['affiliate_url'] = product['store_url']
        
        return jsonify({'products': products[:20]})  # Máximo 20 productos
        
    except Exception as e:
        return jsonify({'error': f'Error en búsqueda: {str(e)}'}), 500

def search_local_products(query):
    """Buscar productos en base de datos local"""
    conn = sqlite3.connect(db.db_path)
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT * FROM products 
        WHERE name LIKE ? OR description LIKE ?
        AND stock_status = 'available'
        ORDER BY created_at DESC
        LIMIT 10
    ''', (f'%{query}%', f'%{query}%'))
    
    products = []
    for row in cursor.fetchall():
        products.append({
            'id': row[0],
            'name': row[1],
            'description': row[2],
            'price_with_profit': row[3],
            'original_price': row[4],
            'image': row[5],
            'category': row[6],
            'store_name': row[7],
            'store_url': row[8],
            'source': row[7]
        })
    
    conn.close()
    return products

def search_external_products(query):
    """Buscar productos en APIs externas (SerpAPI, etc.)"""
    products = []
    
    # Productos de ejemplo mejorados
    example_products = [
        {
            'name': f'{query} - iPhone 15 Pro Max 256GB',
            'price_with_profit': 1199.99,
            'original_price': 1299.99,
            'image': 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop',
            'store_name': 'Amazon',
            'store_url': 'https://amazon.es/dp/B0CHX1W1XY',
            'description': 'Smartphone premium con las mejores características',
            'category': 'Smartphones'
        },
        {
            'name': f'{query} - Samsung Galaxy S24 Ultra',
            'price_with_profit': 899.99,
            'original_price': 999.99,
            'image': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop',
            'store_name': 'MediaMarkt',
            'store_url': 'https://mediamarkt.es/samsung-galaxy-s24',
            'description': 'Smartphone Android de alta gama',
            'category': 'Smartphones'
        },
        {
            'name': f'{query} - MacBook Air M3 13"',
            'price_with_profit': 1099.99,
            'original_price': 1199.99,
            'image': 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop',
            'store_name': 'Amazon',
            'store_url': 'https://amazon.es/dp/B0CX23V2ZK',
            'description': 'Laptop ultradelgada con chip M3',
            'category': 'Laptops'
        }
    ]
    
    # Agregar productos a la base de datos para futuras búsquedas
    for product in example_products:
        db.add_product(
            name=product['name'],
            price=product['price_with_profit'],
            original_price=product['original_price'],
            store_name=product['store_name'],
            store_url=product['store_url'],
            image_url=product['image'],
            description=product['description'],
            category=product['category']
        )
    
    return example_products

@app.route('/save-order', methods=['POST'])
def save_order():
    """Procesar pedido"""
    try:
        data = request.get_json()
        
        # Verificar si el usuario está logueado
        if 'user_id' not in session:
            return jsonify({
                'success': False,
                'error': 'Debes iniciar sesión para realizar un pedido'
            }), 401
        
        product_data = data.get('product', {})
        user_data = data.get('user', {})
        
        # Crear producto si no existe
        product_id = db.add_product(
            name=product_data['name'],
            price=product_data['price_with_profit'],
            original_price=product_data.get('original_price', product_data['price_with_profit']),
            store_name=product_data['source'],
            store_url=product_data.get('link', ''),
            image_url=product_data.get('image', ''),
            description=product_data.get('description', '')
        )
        
        # Crear pedido
        order_result = db.create_order(
            user_id=session['user_id'],
            product_id=product_id,
            quantity=1,
            shipping_address=user_data.get('address', '')
        )
        
        if order_result['success']:
            # Generar enlace de afiliado
            affiliate_url = affiliate_manager.generate_affiliate_link(
                product_data['source'],
                product_data.get('link', ''),
                session['user_id'],
                product_id
            )
            
            # Registrar clic
            affiliate_manager.track_click(
                session['user_id'],
                product_id,
                product_data['source'],
                request.remote_addr,
                request.headers.get('User-Agent')
            )
            
            # Enviar email de confirmación
            send_order_confirmation_email(
                session['user_email'],
                order_result['order_id'],
                product_data['name'],
                order_result['total_amount']
            )
            
            return jsonify({
                'success': True,
                'order_id': f'ORD-{order_result["order_id"]}',
                'redirect_url': affiliate_url,
                'commission_earned': order_result['commission_earned'],
                'message': 'Pedido creado. Redirigiendo a la tienda...'
            })
        else:
            return jsonify(order_result), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Error procesando pedido: {str(e)}'
        }), 500

@app.route('/dashboard')
def dashboard():
    """Panel de usuario"""
    if 'user_id' not in session:
        return redirect(url_for('index'))
    
    # Obtener pedidos del usuario
    user_orders = db.get_user_orders(session['user_id'])
    
    # Obtener estadísticas
    stats = affiliate_manager.get_affiliate_stats()
    
    return render_template('dashboard.html', 
                         orders=user_orders,
                         stats=stats,
                         user_name=session.get('user_name', ''))

@app.route('/admin')
def admin():
    """Panel de administración"""
    # Verificar si es admin (simplificado)
    if session.get('user_email') != 'admin@ofertix.com':
        return redirect(url_for('index'))
    
    stats = db.get_statistics()
    affiliate_stats = affiliate_manager.get_affiliate_stats()
    
    return render_template('admin.html', 
                         stats=stats,
                         affiliate_stats=affiliate_stats)

def send_verification_email(email, token):
    """Enviar email de verificación"""
    try:
        gmail_user = os.getenv('GMAIL_USER')
        gmail_password = os.getenv('GMAIL_APP_PASSWORD')
        
        if not gmail_user or not gmail_password:
            print("Configuración de Gmail no encontrada")
            return
        
        msg = MIMEMultipart()
        msg['From'] = gmail_user
        msg['To'] = email
        msg['Subject'] = 'Verifica tu cuenta en Ofertix'
        
        verification_url = f"http://localhost:5000/verify/{token}"
        
        body = f"""
        <html>
            <body>
                <h2>¡Bienvenido a Ofertix!</h2>
                <p>Gracias por registrarte en nuestra plataforma de comparación de precios.</p>
                <p>Para activar tu cuenta, haz clic en el siguiente enlace:</p>
                <a href="{verification_url}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verificar Cuenta</a>
                <p>Si no puedes hacer clic en el enlace, copia y pega esta URL en tu navegador:</p>
                <p>{verification_url}</p>
                <br>
                <p>¡Gracias por elegir Ofertix!</p>
                <p>El equipo de Ofertix</p>
            </body>
        </html>
        """
        
        msg.attach(MIMEText(body, 'html'))
        
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(gmail_user, gmail_password)
        server.send_message(msg)
        server.quit()
        
        print(f"Email de verificación enviado a {email}")
        
    except Exception as e:
        print(f"Error enviando email: {e}")

def send_order_confirmation_email(email, order_id, product_name, amount):
    """Enviar email de confirmación de pedido"""
    try:
        gmail_user = os.getenv('GMAIL_USER')
        gmail_password = os.getenv('GMAIL_APP_PASSWORD')
        
        if not gmail_user or not gmail_password:
            return
        
        msg = MIMEMultipart()
        msg['From'] = gmail_user
        msg['To'] = email
        msg['Subject'] = f'Confirmación de pedido ORD-{order_id}'
        
        body = f"""
        <html>
            <body>
                <h2>¡Pedido Confirmado!</h2>
                <p>Tu pedido ha sido procesado exitosamente.</p>
                <hr>
                <h3>Detalles del Pedido:</h3>
                <p><strong>Número de pedido:</strong> ORD-{order_id}</p>
                <p><strong>Producto:</strong> {product_name}</p>
                <p><strong>Total:</strong> {amount:.2f}€</p>
                <p><strong>Fecha:</strong> {datetime.now().strftime('%d/%m/%Y %H:%M')}</p>
                <hr>
                <p>Serás redirigido a la tienda para completar la compra.</p>
                <p>Una vez completada la compra, recibirás la confirmación de envío directamente de la tienda.</p>
                <br>
                <p>¡Gracias por usar Ofertix!</p>
                <p>El equipo de Ofertix</p>
            </body>
        </html>
        """
        
        msg.attach(MIMEText(body, 'html'))
        
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(gmail_user, gmail_password)
        server.send_message(msg)
        server.quit()
        
    except Exception as e:
        print(f"Error enviando email de confirmación: {e}")

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('DEBUG', 'True').lower() == 'true'
    app.run(debug=debug, port=port, host='0.0.0.0')