@echo off
REM Script de despliegue automático para Ofertix (GRATIS)

echo 🚀 Iniciando despliegue de Ofertix...

REM Instalar dependencias
echo 📦 Instalando dependencias...
pip install -r requirements_free.txt

REM Configurar base de datos
echo 🗄️ Configurando base de datos...
python -c "from database_complete import OfertixDatabase; OfertixDatabase()"

REM Crear usuario admin por defecto
echo 👤 Creando usuario administrador...
python -c "from database_complete import OfertixDatabase; db = OfertixDatabase(); result = db.add_user('admin@ofertix.com', 'admin123', 'Administrador'); print('Usuario admin creado:', result)"

REM Agregar productos de ejemplo
echo 🛍️ Agregando productos de ejemplo...
python -c "from database_complete import OfertixDatabase; db = OfertixDatabase(); products = [('iPhone 15 Pro Max 256GB', 1199.99, 1299.99, 'Amazon', 'https://amazon.es/iphone15', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400', 'Smartphone premium', 'Smartphones'), ('Samsung Galaxy S24 Ultra', 899.99, 999.99, 'MediaMarkt', 'https://mediamarkt.es/samsung', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400', 'Android flagship', 'Smartphones'), ('MacBook Air M3 13\"', 1099.99, 1199.99, 'Amazon', 'https://amazon.es/macbook', 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400', 'Laptop ultradelgada', 'Laptops'), ('Sony WH-1000XM5', 299.99, 399.99, 'MediaMarkt', 'https://mediamarkt.es/sony', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400', 'Auriculares premium', 'Audio'), ('PlayStation 5 Slim', 499.99, 549.99, 'Amazon', 'https://amazon.es/ps5', 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400', 'Consola next-gen', 'Gaming')]; [db.add_product(*product) for product in products]; print('Productos de ejemplo agregados')"

echo ✅ Configuración completada!
echo.
echo 🎉 ¡Ofertix está listo!
echo.
echo Para iniciar el servidor:
echo python app_complete.py
echo.
echo Credenciales de admin:
echo Email: admin@ofertix.com
echo Password: admin123
echo.
echo URL local: http://localhost:5000
pause