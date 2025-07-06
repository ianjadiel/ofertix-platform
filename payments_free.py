# Sistema de afiliación en lugar de pagos directos
class AffiliatePaymentSystem:
    def __init__(self):
        self.affiliate_links = {
            'amazon': 'https://amazon.es/dp/{product_id}?tag=ofertix-21',
            'aliexpress': 'https://s.click.aliexpress.com/e/{affiliate_code}',
            'ebay': 'https://rover.ebay.com/rover/1/1185-53479-19255-0/1?{params}'
        }
    
    def generate_affiliate_link(self, store, product_url, user_id=None):
        """Generar enlace de afiliado para rastrear comisiones"""
        if store.lower() == 'amazon':
            # Agregar tag de afiliado a Amazon
            if '?' in product_url:
                return f"{product_url}&tag=ofertix-21&ref=ofertix_{user_id}"
            else:
                return f"{product_url}?tag=ofertix-21&ref=ofertix_{user_id}"
        
        elif store.lower() == 'aliexpress':
            # Usar sistema de afiliados de AliExpress
            return f"https://s.click.aliexpress.com/e/_DmXXXXX?url={product_url}"
        
        # Para otras tiendas, agregar parámetro de seguimiento
        separator = '&' if '?' in product_url else '?'
        return f"{product_url}{separator}ref=ofertix&user={user_id}"
    
    def track_click(self, user_id, product_id, store_name):
        """Rastrear clics para calcular comisiones futuras"""
        db = DatabaseManager()
        conn = sqlite3.connect(db.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO click_tracking (user_id, product_id, store_name, clicked_at)
            VALUES (?, ?, ?, ?)
        ''', (user_id, product_id, store_name, datetime.now()))
        
        conn.commit()
        conn.close()
    
    def simulate_purchase_notification(self, order_data):
        """Simular notificación de compra (en producción vendría de la tienda)"""
        # Guardar la 'venta' para calcular comisiones
        db = DatabaseManager()
        order_id = db.add_order(
            order_data['user_email'],
            order_data['product_name'],
            order_data['price'],
            order_data['store']
        )
        
        return {
            'success': True,
            'order_id': f"AFF-{order_id}",
            'commission_earned': order_data['price'] * 0.05,
            'message': 'Compra registrada. Comisión pendiente de confirmación.'
        }