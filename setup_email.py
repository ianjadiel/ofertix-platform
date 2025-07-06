import os
from dotenv import load_dotenv, set_key

def setup_email_config():
    """Configurar plantilla de email automáticamente"""
    
    print("📧 Configurando sistema de emails...")
    
    # Crear plantilla de configuración
    email_config = {
        'GMAIL_USER': 'TU_EMAIL@gmail.com',
        'GMAIL_APP_PASSWORD': 'TU_CONTRASEÑA_DE_16_CARACTERES',
        'EMAIL_TEMPLATES_READY': True
    }
    
    # Actualizar .env.free
    env_file = '.env.free'
    
    print("📝 Creando plantilla de configuración...")
    with open(env_file, 'a', encoding='utf-8') as f:
        f.write("\n# Configuración de Email\n")
        f.write(f"GMAIL_USER={email_config['GMAIL_USER']}\n")
        f.write(f"GMAIL_APP_PASSWORD={email_config['GMAIL_APP_PASSWORD']}\n")
    
    print("✅ Plantilla de email configurada")
    print("\n🔧 ACCIÓN REQUERIDA:")
    print("1. Crea una cuenta Gmail: noreply.ofertix@gmail.com")
    print("2. Activa verificación en 2 pasos")
    print("3. Genera contraseña de aplicación")
    print("4. Actualiza el archivo .env.free con tus datos reales")

if __name__ == '__main__':
    setup_email_config()