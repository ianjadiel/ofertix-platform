import os
from dotenv import load_dotenv

def setup_affiliate_config():
    """Configurar sistema de afiliados automáticamente"""
    
    print("🔗 Configurando sistema de afiliados...")
    
    # Plantilla de configuración
    affiliate_config = {
        'AMAZON_AFFILIATE_ID': 'TU_ID_AMAZON-21',
        'ALIEXPRESS_AFFILIATE_ID': 'TU_ID_ALIEXPRESS',
        'EBAY_AFFILIATE_ID': 'TU_ID_EBAY'
    }
    
    # Actualizar .env.free
    env_file = '.env.free'
    
    print("📝 Creando plantilla de afiliados...")
    with open(env_file, 'a', encoding='utf-8') as f:
        f.write("\n# IDs de Afiliados\n")
        for key, value in affiliate_config.items():
            f.write(f"{key}={value}\n")
    
    # Crear guía de registro
    guide_content = """
# 🔗 GUÍA DE REGISTRO DE AFILIADOS

## 1. Amazon Associates
- URL: https://afiliados.amazon.es/
- Tiempo: 10-15 minutos
- Requiere: DNI/NIE, dirección, información fiscal
- Tu ID será algo como: tuusuario-21

## 2. AliExpress Affiliate
- URL: https://portals.aliexpress.com/
- Tiempo: 5-10 minutos
- Requiere: Email, información básica
- Tipo: Content Creator

## 3. eBay Partner Network
- URL: https://partnernetwork.ebay.com/
- Tiempo: 5-10 minutos
- Requiere: Email, información del sitio
- Selecciona: España como país

## 4. Actualizar configuración
Después de registrarte, actualiza el archivo .env.free con tus IDs reales.
"""
    
    with open('GUIA_AFILIADOS.md', 'w', encoding='utf-8') as f:
        f.write(guide_content)
    
    print("✅ Sistema de afiliados configurado")
    print("✅ Guía creada: GUIA_AFILIADOS.md")
    print("\n🔧 ACCIÓN REQUERIDA:")
    print("1. Lee la guía: GUIA_AFILIADOS.md")
    print("2. Regístrate en cada plataforma (15-30 min total)")
    print("3. Actualiza .env.free con tus IDs reales")

if __name__ == '__main__':
    setup_affiliate_config()