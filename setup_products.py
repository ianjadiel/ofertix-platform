from database_complete import OfertixDatabase
import json

def setup_products():
    """Configurar productos de ejemplo automáticamente"""
    db = OfertixDatabase()
    
    products = [
        {
            'name': 'iPhone 15 Pro Max 256GB',
            'description': 'Smartphone premium con cámara profesional y chip A17 Pro',
            'price_with_profit': 1199.99,
            'original_price': 1299.99,
            'image': 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
            'category': 'Smartphones',
            'store_name': 'Amazon',
            'store_url': 'https://amazon.es/dp/B0CHX1W1XY'
        },
        {
            'name': 'Samsung Galaxy S24 Ultra',
            'description': 'Android flagship con S Pen y cámara de 200MP',
            'price_with_profit': 899.99,
            'original_price': 999.99,
            'image': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
            'category': 'Smartphones',
            'store_name': 'MediaMarkt',
            'store_url': 'https://mediamarkt.es/samsung-galaxy-s24'
        },
        {
            'name': 'MacBook Air M3 13"',
            'description': 'Laptop ultradelgada con chip M3 y hasta 18h de batería',
            'price_with_profit': 1099.99,
            'original_price': 1199.99,
            'image': 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
            'category': 'Laptops',
            'store_name': 'Amazon',
            'store_url': 'https://amazon.es/dp/B0CX23V2ZK'
        },
        {
            'name': 'Sony WH-1000XM5',
            'description': 'Auriculares premium con cancelación de ruido líder',
            'price_with_profit': 299.99,
            'original_price': 399.99,
            'image': 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
            'category': 'Audio',
            'store_name': 'MediaMarkt',
            'store_url': 'https://mediamarkt.es/sony-wh1000xm5'
        },
        {
            'name': 'PlayStation 5 Slim',
            'description': 'Consola next-gen con gráficos 4K y SSD ultrarrápido',
            'price_with_profit': 499.99,
            'original_price': 549.99,
            'image': 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400',
            'category': 'Gaming',
            'store_name': 'Amazon',
            'store_url': 'https://amazon.es/dp/B0CL5KNB9M'
        },
        {
            'name': 'iPad Pro 12.9" M2',
            'description': 'Tablet profesional con chip M2 y pantalla Liquid Retina XDR',
            'price_with_profit': 1099.99,
            'original_price': 1199.99,
            'image': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
            'category': 'Tablets',
            'store_name': 'Amazon',
            'store_url': 'https://amazon.es/dp/B0BJLXMZ4J'
        }
    ]
    
    print("📦 Agregando productos...")
    for product in products:
        result = db.add_product(
            name=product['name'],
            description=product['description'],
            price_with_profit=product['price_with_profit'],
            original_price=product['original_price'],
            image=product['image'],
            category=product['category'],
            store_name=product['store_name'],
            store_url=product['store_url']
        )
        if result['success']:
            print(f"✅ {product['name']}")
        else:
            print(f"❌ Error: {product['name']} - {result['error']}")
    
    print(f"\n🎉 ¡{len(products)} productos agregados exitosamente!")

if __name__ == '__main__':
    setup_products()