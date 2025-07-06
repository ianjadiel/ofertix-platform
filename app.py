from flask import Flask, render_template, request, jsonify
import requests
import os
from dotenv import load_dotenv
import json
import random
from datetime import datetime, timedelta

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)

# Configuración
SERPAPI_KEY = os.getenv('SERPAPI_KEY')
PROFIT_MARGIN = 0.15  # 15% de margen de ganancia

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    try:
        data = request.get_json()
        query = data.get('query', '')
        
        if not query:
            return jsonify({'error': 'Query is required'}), 400
        
        # Si no hay clave de SerpApi, usar productos de ejemplo
        if not SERPAPI_KEY:
            products = get_example_products(query)
        else:
            # Buscar productos reales con SerpApi
            products = search_google_shopping(query)
        
        return jsonify({'products': products})
        
    except Exception as e:
        print(f"Error en búsqueda: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

def search_google_shopping(query):
    """Buscar productos usando Google Shopping API de SerpApi"""
    try:
        url = "https://serpapi.com/search.json"
        params = {
            "engine": "google_shopping",
            "q": query,
            "api_key": SERPAPI_KEY,
            "num": 20,
            "hl": "es",
            "gl": "es"
        }
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        products = []
        
        if 'shopping_results' in data:
            for item in data['shopping_results']:
                try:
                    # Extraer precio
                    price_str = item.get('price', '0')
                    price = extract_price(price_str)
                    
                    if price > 0:
                        # Calcular precio con margen de ganancia
                        price_with_profit = price * (1 - PROFIT_MARGIN)
                        
                        product = {
                            'name': item.get('title', 'Producto sin nombre'),
                            'price_with_profit': round(price_with_profit, 2),
                            'original_price': f"{price:.2f} €",
                            'image': item.get('thumbnail', 'https://via.placeholder.com/300'),
                            'source': item.get('source', 'Tienda desconocida'),
                            'link': item.get('link', '#'),
                            'shipping': item.get('delivery', 'Consultar envío'),
                            'delivery_time': get_estimated_delivery(),
                            'description': generate_description(item.get('title', ''))
                        }
                        products.append(product)
                        
                except Exception as e:
                    print(f"Error procesando producto: {str(e)}")
                    continue
        
        # Si no se encontraron productos, devolver ejemplos
        if not products:
            products = get_example_products(query)
            
        return products[:12]  # Limitar a 12 productos
        
    except Exception as e:
        print(f"Error en SerpApi: {str(e)}")
        return get_example_products(query)

def get_example_products(query):
    """Productos de ejemplo cuando no hay SerpApi o falla la búsqueda"""
    base_products = [
        {
            'name': f'{query} - iPhone 15 Pro Max 256GB',
            'price_with_profit': 1199.99,
            'original_price': '1299.99 €',
            'image': 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop',
            'source': 'Amazon',
            'shipping': 'Envío gratis',
            'delivery_time': '1-2 días',
            'description': 'Smartphone premium con las mejores características del mercado',
            'link': 'https://amazon.com'
        },
        {
            'name': f'{query} - Samsung Galaxy S24 Ultra',
            'price_with_profit': 899.99,
            'original_price': '999.99 €',
            'image': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop',
            'source': 'eBay',
            'shipping': 'Envío gratis',
            'delivery_time': '2-3 días',
            'description': 'Excelente smartphone con cámara profesional y S Pen incluido',
            'link': 'https://ebay.com'
        },
        {
            'name': f'{query} - MacBook Air M3 13" 256GB',
            'price_with_profit': 1099.99,
            'original_price': '1199.99 €',
            'image': 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop',
            'source': 'AliExpress',
            'shipping': 'Envío gratis',
            'delivery_time': '5-7 días',
            'description': 'Laptop ultradelgada y potente con chip M3 de Apple',
            'link': 'https://aliexpress.com'
        },
        {
            'name': f'{query} - Sony WH-1000XM5 Auriculares',
            'price_with_profit': 299.99,
            'original_price': '399.99 €',
            'image': 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
            'source': 'MediaMarkt',
            'shipping': 'Envío gratis',
            'delivery_time': '1-2 días',
            'description': 'Auriculares inalámbricos con cancelación de ruido líder',
            'link': 'https://mediamarkt.es'
        },
        {
            'name': f'{query} - PlayStation 5 Slim',
            'price_with_profit': 499.99,
            'original_price': '549.99 €',
            'image': 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop',
            'source': 'Amazon',
            'shipping': 'Envío gratis',
            'delivery_time': '1-2 días',
            'description': 'Consola de nueva generación con gráficos 4K',
            'link': 'https://amazon.com'
        },
        {
            'name': f'{query} - iPad Pro 12.9" M2',
            'price_with_profit': 1299.99,
            'original_price': '1449.99 €',
            'image': 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop',
            'source': 'MediaMarkt',
            'shipping': 'Envío gratis',
            'delivery_time': '2-3 días',
            'description': 'Tablet profesional con pantalla Liquid Retina XDR',
            'link': 'https://mediamarkt.es'
        }
    ]
    
    return base_products

def extract_price(price_str):
    """Extraer precio numérico de una cadena"""
    if not price_str:
        return 0
    
    # Remover caracteres no numéricos excepto punto y coma
    import re
    price_clean = re.sub(r'[^0-9.,]', '', str(price_str))
    
    # Reemplazar coma por punto para decimales
    price_clean = price_clean.replace(',', '.')
    
    try:
        return float(price_clean)
    except ValueError:
        return 0

def get_estimated_delivery():
    """Generar tiempo de entrega estimado aleatorio"""
    options = ['1-2 días', '2-3 días', '3-5 días', '5-7 días', '1 semana']
    return random.choice(options)

def generate_description(title):
    """Generar descripción basada en el título del producto"""
    if not title:
        return "Producto de alta calidad con excelentes características"
    
    descriptions = {
        'iphone': 'Smartphone premium con tecnología avanzada y diseño elegante',
        'samsung': 'Dispositivo Android de alta gama con características innovadoras',
        'macbook': 'Laptop profesional con rendimiento excepcional y diseño premium',
        'airpods': 'Auriculares inalámbricos con calidad de sonido superior',
        'ipad': 'Tablet versátil perfecta para trabajo y entretenimiento',
        'watch': 'Smartwatch con funciones avanzadas de salud y fitness',
        'tv': 'Televisor con tecnología de última generación y calidad 4K',
        'laptop': 'Computadora portátil con excelente rendimiento y portabilidad'
    }
    
    title_lower = title.lower()
    for key, desc in descriptions.items():
        if key in title_lower:
            return desc
    
    return "Producto de alta calidad con excelentes características y garantía"

@app.route('/save-order', methods=['POST'])
def save_order():
    try:
        data = request.get_json()
        
        # Generar ID de pedido único
        order_id = generate_order_id()
        
        # Simular procesamiento de pago
        payment_result = process_payment(data)
        
        if payment_result['success']:
            # Calcular fecha de entrega estimada
            delivery_date = calculate_delivery_date(data.get('product', {}).get('delivery_time', '5-7 días'))
            
            response_data = {
                'success': True,
                'order_id': order_id,
                'message': 'Pedido realizado con éxito',
                'estimated_delivery': delivery_date,
                'payment_details': payment_result['details']
            }
            
            # Aquí podrías guardar el pedido en una base de datos
            print(f"Pedido guardado: {order_id}")
            print(f"Datos del pedido: {json.dumps(data, indent=2)}")
            
            return jsonify(response_data)
        else:
            return jsonify({
                'success': False,
                'error': payment_result['error']
            }), 400
            
    except Exception as e:
        print(f"Error guardando pedido: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Error interno del servidor'
        }), 500

def generate_order_id():
    """Generar ID único para el pedido"""
    import time
    timestamp = str(int(time.time()))
    random_num = str(random.randint(1000, 9999))
    return f"ORD-{timestamp[-6:]}-{random_num}"

def process_payment(order_data):
    """Simular procesamiento de pago"""
    # Simular éxito/fallo del pago (95% éxito)
    success = random.random() > 0.05
    
    if success:
        return {
            'success': True,
            'details': {
                'transaction_id': f"TXN-{random.randint(100000, 999999)}",
                'payment_method': 'Tarjeta de crédito',
                'amount': order_data.get('product', {}).get('price_with_profit', 0),
                'currency': 'EUR',
                'status': 'Completado'
            }
        }
    else:
        return {
            'success': False,
            'error': 'Error en el procesamiento del pago. Inténtalo de nuevo.'
        }

def calculate_delivery_date(delivery_time):
    """Calcular fecha de entrega basada en el tiempo estimado"""
    try:
        # Extraer número de días del string
        import re
        days_match = re.search(r'(\d+)', delivery_time)
        if days_match:
            days = int(days_match.group(1))
        else:
            days = 7  # Por defecto 7 días
        
        delivery_date = datetime.now() + timedelta(days=days)
        return delivery_date.strftime('%d/%m/%Y')
    except:
        return (datetime.now() + timedelta(days=7)).strftime('%d/%m/%Y')

if __name__ == '__main__':
    app.run(debug=True, port=5000)