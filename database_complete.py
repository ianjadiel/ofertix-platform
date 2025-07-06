# Sistema completo de base de datos SQLite (GRATIS)
import sqlite3
import json
from datetime import datetime, timedelta
import hashlib
import secrets

class OfertixDatabase:
    def __init__(self, db_path='ofertix_free.db'):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Crear todas las tablas necesarias"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Tabla de usuarios
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                name TEXT,
                phone TEXT,
                address TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_verified BOOLEAN DEFAULT 0,
                verification_token TEXT,
                last_login TIMESTAMP
            )
        ''')
        
        # Tabla de productos
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                price REAL NOT NULL,
                original_price REAL,
                image_url TEXT,
                category TEXT,
                store_name TEXT,
                store_url TEXT,
                affiliate_url TEXT,
                stock_status TEXT DEFAULT 'available',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Tabla de pedidos
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                product_id INTEGER,
                quantity INTEGER DEFAULT 1,
                total_amount REAL,
                commission_earned REAL,
                status TEXT DEFAULT 'pending',
                payment_method TEXT,
                shipping_address TEXT,
                tracking_code TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                completed_at TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (product_id) REFERENCES products (id)
            )
        ''')
        
        # Tabla de clics de afiliados
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS affiliate_clicks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                product_id INTEGER,
                store_name TEXT,
                clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                ip_address TEXT,
                user_agent TEXT,
                converted BOOLEAN DEFAULT 0,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (product_id) REFERENCES products (id)
            )
        ''')
        
        # Tabla de tiendas afiliadas
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS affiliate_stores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                website TEXT,
                affiliate_program_url TEXT,
                commission_rate REAL DEFAULT 0.05,
                contact_email TEXT,
                api_endpoint TEXT,
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Tabla de configuración
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()
        
        # Insertar datos iniciales
        self.insert_initial_data()
    
    def insert_initial_data(self):
        """Insertar datos iniciales del sistema"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Tiendas afiliadas iniciales
        stores = [
            ('Amazon', 'https://amazon.es', 'https://afiliados.amazon.es', 0.03, 'afiliados@amazon.es'),
            ('AliExpress', 'https://aliexpress.com', 'https://portals.aliexpress.com', 0.05, 'affiliate@aliexpress.com'),
            ('eBay', 'https://ebay.es', 'https://partnernetwork.ebay.com', 0.02, 'partners@ebay.com'),
            ('MediaMarkt', 'https://mediamarkt.es', '', 0.04, 'afiliados@mediamarkt.es')
        ]
        
        for store in stores:
            cursor.execute('''
                INSERT OR IGNORE INTO affiliate_stores 
                (name, website, affiliate_program_url, commission_rate, contact_email)
                VALUES (?, ?, ?, ?, ?)
            ''', store)
        
        # Configuraciones iniciales
        settings = [
            ('site_name', 'Ofertix'),
            ('site_description', 'La mejor plataforma de comparación de precios'),
            ('admin_email', 'admin@ofertix.com'),
            ('commission_rate', '0.05'),
            ('currency', 'EUR'),
            ('timezone', 'Europe/Madrid')
        ]
        
        for setting in settings:
            cursor.execute('''
                INSERT OR IGNORE INTO settings (key, value)
                VALUES (?, ?)
            ''', setting)
        
        conn.commit()
        conn.close()
    
    def add_user(self, email, password, name=None, phone=None):
        """Registrar nuevo usuario"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Hash de la contraseña
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        verification_token = secrets.token_urlsafe(32)
        
        try:
            cursor.execute('''
                INSERT INTO users (email, password_hash, name, phone, verification_token)
                VALUES (?, ?, ?, ?, ?)
            ''', (email, password_hash, name, phone, verification_token))
            
            user_id = cursor.lastrowid
            conn.commit()
            return {'success': True, 'user_id': user_id, 'verification_token': verification_token}
        except sqlite3.IntegrityError:
            return {'success': False, 'error': 'El email ya está registrado'}
        finally:
            conn.close()
    
    def verify_user(self, email, password):
        """Verificar credenciales de usuario"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        
        cursor.execute('''
            SELECT id, email, name, is_verified FROM users 
            WHERE email = ? AND password_hash = ?
        ''', (email, password_hash))
        
        user = cursor.fetchone()
        conn.close()
        
        if user:
            return {
                'success': True,
                'user': {
                    'id': user[0],
                    'email': user[1],
                    'name': user[2],
                    'is_verified': bool(user[3])
                }
            }
        return {'success': False, 'error': 'Credenciales inválidas'}
    
    def add_product(self, name, price, original_price, store_name, store_url, image_url=None, description=None, category=None):
        """Agregar nuevo producto"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO products 
            (name, description, price, original_price, image_url, category, store_name, store_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (name, description, price, original_price, image_url, category, store_name, store_url))
        
        product_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return product_id
    
    def create_order(self, user_id, product_id, quantity=1, shipping_address=None):
        """Crear nuevo pedido"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Obtener información del producto
        cursor.execute('SELECT price FROM products WHERE id = ?', (product_id,))
        product = cursor.fetchone()
        
        if not product:
            conn.close()
            return {'success': False, 'error': 'Producto no encontrado'}
        
        total_amount = product[0] * quantity
        commission_earned = total_amount * 0.05  # 5% comisión
        
        cursor.execute('''
            INSERT INTO orders 
            (user_id, product_id, quantity, total_amount, commission_earned, shipping_address)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (user_id, product_id, quantity, total_amount, commission_earned, shipping_address))
        
        order_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {
            'success': True,
            'order_id': order_id,
            'total_amount': total_amount,
            'commission_earned': commission_earned
        }
    
    def get_products(self, category=None, limit=50):
        """Obtener lista de productos"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        if category:
            cursor.execute('''
                SELECT * FROM products WHERE category = ? AND stock_status = 'available'
                ORDER BY created_at DESC LIMIT ?
            ''', (category, limit))
        else:
            cursor.execute('''
                SELECT * FROM products WHERE stock_status = 'available'
                ORDER BY created_at DESC LIMIT ?
            ''', (limit,))
        
        products = cursor.fetchall()
        conn.close()
        
        return products
    
    def get_user_orders(self, user_id):
        """Obtener pedidos de un usuario"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT o.*, p.name as product_name, p.image_url
            FROM orders o
            JOIN products p ON o.product_id = p.id
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC
        ''', (user_id,))
        
        orders = cursor.fetchall()
        conn.close()
        
        return orders
    
    def get_statistics(self):
        """Obtener estadísticas del sistema"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Total usuarios
        cursor.execute('SELECT COUNT(*) FROM users')
        total_users = cursor.fetchone()[0]
        
        # Total productos
        cursor.execute('SELECT COUNT(*) FROM products')
        total_products = cursor.fetchone()[0]
        
        # Total pedidos
        cursor.execute('SELECT COUNT(*) FROM orders')
        total_orders = cursor.fetchone()[0]
        
        # Comisiones ganadas
        cursor.execute('SELECT SUM(commission_earned) FROM orders WHERE status = "completed"')
        total_commissions = cursor.fetchone()[0] or 0
        
        # Pedidos hoy
        cursor.execute('''
            SELECT COUNT(*) FROM orders 
            WHERE DATE(created_at) = DATE('now')
        ''')
        orders_today = cursor.fetchone()[0]
        
        conn.close()
        
        return {
            'total_users': total_users,
            'total_products': total_products,
            'total_orders': total_orders,
            'total_commissions': total_commissions,
            'orders_today': orders_today
        }