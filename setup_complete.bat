@echo off
echo 🚀 CONFIGURACIÓN AUTOMÁTICA DE OFERTIX
echo =====================================
echo.
echo ⚡ Instalando dependencias...
pip install -r requirements_free.txt
echo.
echo 🗄️ Configurando base de datos...
python -c "from database_complete import OfertixDatabase; db = OfertixDatabase(); print('✅ Base de datos creada')"
echo.
echo 👤 Creando usuario administrador...
python -c "from database_complete import OfertixDatabase; db = OfertixDatabase(); result = db.add_user('admin@ofertix.com', 'admin123', 'Administrador'); print('✅ Usuario admin creado:', result['success'])"
echo.
echo 🛍️ Agregando productos de ejemplo...
python setup_products.py
echo.
echo 📧 Configurando sistema de emails...
python setup_email.py
echo.
echo 🔗 Configurando sistema de afiliados...
python setup_affiliates.py
echo.
echo ✅ ¡CONFIGURACIÓN COMPLETADA!
echo.
echo 🎯 PRÓXIMOS PASOS MANUALES:
echo 1. Crear cuenta Amazon Associates: https://afiliados.amazon.es/
echo 2. Crear cuenta Gmail: https://accounts.google.com/signup
echo 3. Registrar en Railway: https://railway.app/
echo.
echo 🚀 Para iniciar el servidor:
echo python app_complete.py
echo.
pause