#!/bin/bash
# Desplegar en Heroku (GRATIS)

echo "🚀 Desplegando Ofertix en Heroku..."

# Instalar Heroku CLI si no está instalado
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI no encontrado. Instálalo desde: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Login en Heroku
echo "🔐 Iniciando sesión en Heroku..."
heroku login

# Crear aplicación
echo "📱 Creando aplicación en Heroku..."
heroku create ofertix-app-$(date +%s)

# Configurar variables de entorno
echo "⚙️ Configurando variables de entorno..."
heroku config:set FLASK_ENV=production
heroku config:set SECRET_KEY=$(openssl rand -base64 32)
heroku config:set DATABASE_PATH=ofertix_production.db

# Desplegar
echo "🚀 Desplegando aplicación..."
git add .
git commit -m "Deploy Ofertix to Heroku"
git push heroku main

# Abrir aplicación
echo "🌐 Abriendo aplicación..."
heroku open

echo "✅ ¡Despliegue completado!"