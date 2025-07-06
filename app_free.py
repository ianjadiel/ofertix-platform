# Versión gratuita del app principal
from flask import Flask, render_template, request, jsonify, redirect
import requests
import os
from dotenv import load_dotenv
from database_free import DatabaseManager
from payments_free import AffiliatePaymentSystem
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

load_dotenv()
app = Flask(__name__)
app.secret_key = 'tu_clave_secreta_temporal'

# Inicializar sistemas
db = DatabaseManager()
affiliate_system = AffiliatePaymentSystem()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/save-order', methods=['POST'])
def save_order_free():
    try:
        data = request.get_json()
        
        # En lugar de procesar pago, redirigir a tienda con afiliado
        product_data = data.get('product', {})
        user_data = data.get('user', {})
        
        # Generar enlace de afiliado
        affiliate_link = affiliate_system.generate_affiliate_link(
            product_data.get('source', 'amazon'),
            product_data.get('link', ''),
            user_data.get('email', '')
        )
        
        # Simular 'compra' para tracking
        order_result = affiliate_system.simulate_purchase_notification({
            'user_email': user_data.get('email', ''),
            'product_name': product_data.get('name', ''),
            'price': product_data.get('price_with_profit', 0),
            'store': product_data.get('source', '')
        })
        
        # Enviar email de confirmación GRATIS (usando Gmail)
        send_confirmation_email_free(user_data.get('email', ''), order_result)
        
        return jsonify({
            'success': True,
            'order_id': order_result['order_id'],
            'redirect_url': affiliate_link,
            'message': 'Redirigiendo a la tienda para completar la compra...'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def send_confirmation_email_free(user_email, order_data):
    """Enviar email usando Gmail gratuito"""
    try:
        # Configurar Gmail (crear cuenta específica para Ofertix)
        smtp_server = "smtp.gmail.com"
        smtp_port = 587
        sender_email = "ofertix.noreply@gmail.com"  # Crear esta cuenta
        sender_password = "tu_app_password"  # App password de Gmail
        
        message = MIMEMultipart("alternative")
        message["Subject"] = f"Confirmación de pedido {order_data['order_id']}"
        message["From"] = sender_email
        message["To"] = user_email
        
        html = f"""
        <html>
          <body>
            <h2>¡Gracias por usar Ofertix!</h2>
            <p>Tu pedido <strong>{order_data['order_id']}</strong> ha sido procesado.</p>
            <p>Comisión ganada: {order_data['commission_earned']:.2f}€</p>
            <p>Serás redirigido a la tienda para completar la compra.</p>
            <br>
            <p>Equipo Ofertix</p>
          </body>
        </html>
        """
        
        part = MIMEText(html, "html")
        message.attach(part)
        
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, user_email, message.as_string())
            
    except Exception as e:
        print(f"Error enviando email: {e}")

if __name__ == '__main__':
    app.run(debug=True, port=5000)