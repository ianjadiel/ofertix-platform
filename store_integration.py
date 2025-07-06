# Sistema para integrar tiendas reales
from selenium import webdriver
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import requests
from bs4 import BeautifulSoup

class StoreIntegrator:
    def __init__(self):
        self.drivers = {}
    
    def setup_driver(self, headless=True):
        options = webdriver.ChromeOptions()
        if headless:
            options.add_argument('--headless')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        
        driver = webdriver.Chrome(
            ChromeDriverManager().install(),
            options=options
        )
        return driver
    
    def scrape_amazon_product(self, product_url):
        """Scraping real de Amazon"""
        driver = self.setup_driver()
        try:
            driver.get(product_url)
            
            # Extraer información del producto
            title = driver.find_element(By.ID, "productTitle").text
            price_element = driver.find_element(By.CLASS_NAME, "a-price-whole")
            price = float(price_element.text.replace(',', '.'))
            
            # Verificar disponibilidad
            try:
                availability = driver.find_element(By.ID, "availability").text
                in_stock = "En stock" in availability
            except:
                in_stock = False
            
            return {
                'title': title,
                'price': price,
                'available': in_stock,
                'source': 'Amazon',
                'url': product_url
            }
        finally:
            driver.quit()
    
    def check_product_availability(self, product_id):
        """Verificar disponibilidad en tiempo real"""
        product = Product.query.get(product_id)
        if not product:
            return False
        
        # Verificar según la tienda
        if 'amazon' in product.source_url:
            return self.check_amazon_availability(product.source_url)
        elif 'ebay' in product.source_url:
            return self.check_ebay_availability(product.source_url)
        
        return True  # Por defecto disponible
    
    def update_prices_automatically(self):
        """Actualizar precios automáticamente"""
        products = Product.query.filter_by(stock_status='available').all()
        
        for product in products:
            try:
                updated_info = self.scrape_product_info(product.source_url)
                if updated_info:
                    product.price = updated_info['price']
                    product.stock_status = 'available' if updated_info['available'] else 'out_of_stock'
                    product.last_updated = datetime.utcnow()
            except Exception as e:
                print(f"Error actualizando producto {product.id}: {e}")
        
        db.session.commit()