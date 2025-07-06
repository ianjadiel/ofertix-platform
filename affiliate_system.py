import sqlite3
import hashlib
import urllib.parse
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv('.env.free')

class AffiliateManager:
    """Gestor del sistema de afiliados"""
    
    def __init__(self, db_path='ofertix_free.db'):
        self.db_path = db_path
        self.amazon_tag = os.getenv('AMAZON_AFFILIATE_ID', 'ofertix-21')
        self.aliexpress_tag = os.getenv('ALIEXPRESS_AFFILIATE_ID', 'ofertix')
        self.ebay_tag = os.getenv('EBAY_AFFILIATE_ID', 'ofertix')
        
    def generate_affiliate_link(self, store_name, original_url, user_id=None, product_id=None):
        """Generar enlace de afiliado según la tienda"""
        try:
            store_name = store_name.lower()
            
            if 'amazon' in store_name:
                return self._generate_amazon_link(original_url, user_id, product_id)
            elif 'aliexpress' in store_name:
                return self._generate_aliexpress_link(original_url, user_id, product_id)
            elif 'ebay' in store_name:
                return self._generate_ebay_link(original_url, user_id, product_id)
            else:
                # Para otras tiendas, agregar parámetros de tracking
                return self._add_tracking_params(original_url, user_id, product_id)
                
        except Exception as e:
            print(f"Error generando enlace de afiliado: {e}")
            return original_url
    
    def _generate_amazon_link(self, original_url, user_id=None, product_id=None):
        """Generar enlace de afiliado de Amazon"""
        try:
            # Extraer ASIN del URL
            if '/dp/' in original_url:
                asin = original_url.split('/dp/')[1].split('/')[0].split('?')[0]
            elif '/gp/product/' in original_url:
                asin = original_url.split('/gp/product/')[1].split('/')[0].split('?')[0]
            else:
                return original_url
            
            # Construir URL de afiliado
            affiliate_url = f"https://amazon.es/dp/{asin}?tag={self.amazon_tag}"
            
            # Agregar tracking personalizado
            if user_id:
                affiliate_url += f"&ref=ofx_{user_id}"
            
            # Registrar click
            self._track_click('Amazon', affiliate_url, user_id, product_id)
            
            return affiliate_url
            
        except Exception as e:
            print(f"Error en enlace Amazon: {e}")
            return original_url
    
    def _generate_aliexpress_link(self, original_url, user_id=None, product_id=None):
        """Generar enlace de afiliado de AliExpress"""
        try:
            # AliExpress usa un sistema diferente
            parsed_url = urllib.parse.urlparse(original_url)
            query_params = urllib.parse.parse_qs(parsed_url.query)
            
            # Agregar parámetros de afiliado
            query_params['aff_platform'] = ['ofertix']
            query_params['aff_trace_key'] = [f'ofx_{user_id}' if user_id else 'ofx_guest']
            
            # Reconstruir URL
            new_query = urllib.parse.urlencode(query_params, doseq=True)
            affiliate_url = urllib.parse.urlunparse((
                parsed_url.scheme,
                parsed_url.netloc,
                parsed_url.path,
                parsed_url.params,
                new_query,
                parsed_url.fragment
            ))
            
            # Registrar click
            self._track_click('AliExpress', affiliate_url, user_id, product_id)
            
            return affiliate_url
            
        except Exception as e:
            print(f"Error en enlace AliExpress: {e}")
            return original_url
    
    def _generate_ebay_link(self, original_url, user_id=None, product_id=None):
        """Generar enlace de afiliado de eBay"""
        try:
            # eBay Partner Network
            parsed_url = urllib.parse.urlparse(original_url)
            query_params = urllib.parse.parse_qs(parsed_url.query)
            
            # Agregar parámetros de afiliado
            query_params['campid'] = [self.ebay_tag]
            query_params['customid'] = [f'ofx_{user_id}' if user_id else 'ofx_guest']
            
            # Reconstruir URL
            new_query = urllib.parse.urlencode(query_params, doseq=True)
            affiliate_url = urllib.parse.urlunparse((
                parsed_url.scheme,
                parsed_url.netloc,
                parsed_url.path,
                parsed_url.params,
                new_query,
                parsed_url.fragment
            ))
            
            # Registrar click
            self._track_click('eBay', affiliate_url, user_id, product_id)
            
            return affiliate_url
            
        except Exception as e:
            print(f"Error en enlace eBay: {e}")
            return original_url
    
    def _add_tracking_params(self, original_url, user_id=None, product_id=None):
        """Agregar parámetros de tracking para otras tiendas"""
        try:
            parsed_url = urllib.parse.urlparse(original_url)
            query_params = urllib.parse.parse_qs(parsed_url.query)
            
            # Agregar parámetros de tracking
            query_params['utm_source'] = ['ofertix']
            query_params['utm_medium'] = ['affiliate']
            query_params['utm_campaign'] = ['ofertix_deals']
            
            if user_id:
                query_params['utm_content'] = [f'user_{user_id}']
            
            # Reconstruir URL
            new_query = urllib.parse.urlencode(query_params, doseq=True)
            tracking_url = urllib.parse.urlunparse((
                parsed_url.scheme,
                parsed_url.netloc,
                parsed_url.path,
                parsed_url.params,
                new_query,
                parsed_url.fragment
            ))
            
            # Registrar click
            store_name = parsed_url.netloc.replace('www.', '').split('.')[0].title()
            self._track_click(store_name, tracking_url, user_id, product_id)
            
            return tracking_url
            
        except Exception as e:
            print(f"Error agregando tracking: {e}")
            return original_url
    
    def _track_click(self, store_name, affiliate_url, user_id=None, product_id=None):
        """Registrar click en enlace de afiliado"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO affiliate_clicks 
                (store_name, affiliate_url, user_id, product_id, clicked_at)
                VALUES (?, ?, ?, ?, ?)
            ''', (store_name, affiliate_url, user_id, product_id, datetime.now()))
            
            conn.commit()
            conn.close()
            
        except Exception as e:
            print(f"Error registrando click: {e}")
    
    def get_affiliate_stats(self, user_id=None, days=30):
        """Obtener estadísticas de afiliados"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            if user_id:
                cursor.execute('''
                    SELECT store_name, COUNT(*) as clicks
                    FROM affiliate_clicks 
                    WHERE user_id = ? AND clicked_at >= datetime('now', '-{} days')
                    GROUP BY store_name
                    ORDER BY clicks DESC
                '''.format(days), (user_id,))
            else:
                cursor.execute('''
                    SELECT store_name, COUNT(*) as clicks
                    FROM affiliate_clicks 
                    WHERE clicked_at >= datetime('now', '-{} days')
                    GROUP BY store_name
                    ORDER BY clicks DESC
                '''.format(days))
            
            stats = []
            for row in cursor.fetchall():
                stats.append({
                    'store_name': row[0],
                    'clicks': row[1]
                })
            
            conn.close()
            return stats
            
        except Exception as e:
            print(f"Error obteniendo estadísticas: {e}")
            return []
    
    def get_total_clicks(self, user_id=None):
        """Obtener total de clicks"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            if user_id:
                cursor.execute('SELECT COUNT(*) FROM affiliate_clicks WHERE user_id = ?', (user_id,))
            else:
                cursor.execute('SELECT COUNT(*) FROM affiliate_clicks')
            
            total = cursor.fetchone()[0]
            conn.close()
            return total
            
        except Exception as e:
            print(f"Error obteniendo total de clicks: {e}")
            return 0