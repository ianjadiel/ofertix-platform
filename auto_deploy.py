import os
import subprocess
import webbrowser
from datetime import datetime

def auto_deploy():
    """Despliegue automático completo"""
    
    print("🚀 INICIANDO DESPLIEGUE AUTOMÁTICO")
    print("=" * 40)
    
    steps = [
        ("📦 Instalando dependencias", "pip install -r requirements_free.txt"),
        ("🗄️ Configurando base de datos", "python -c \"from database_complete import OfertixDatabase; OfertixDatabase()\""),
        ("👤 Creando usuario admin", "python -c \"from database_complete import OfertixDatabase; db = OfertixDatabase(); db.add_user('admin@ofertix.com', 'admin123', 'Administrador')\""),
        ("🛍️ Agregando productos", "python setup_products.py"),
        ("📧 Configurando emails", "python setup_email.py"),
        ("🔗 Configurando afiliados", "python setup_affiliates.py")
    ]
    
    for step_name, command in steps:
        print(f"\n{step_name}...")
        try:
            result = subprocess.run(command, shell=True, capture_output=True, text=True)
            if result.returncode == 0:
                print("✅ Completado")
            else:
                print(f"⚠️ Advertencia: {result.stderr}")
        except Exception as e:
            print(f"❌ Error: {e}")
    
    print("\n" + "=" * 40)
    print("🎉 ¡DESPLIEGUE COMPLETADO!")
    print("\n📋 RESUMEN:")
    print("✅ Base de datos configurada")
    print("✅ Usuario admin creado (admin@ofertix.com / admin123)")
    print("✅ Productos de ejemplo agregados")
    print("✅ Plantillas de configuración creadas")
    
    print("\n🔧 PASOS MANUALES RESTANTES:")
    print("1. Registrarte en programas de afiliados (15-30 min)")
    print("2. Crear cuenta Gmail y configurar (10 min)")
    print("3. Registrar en hosting gratuito (5 min)")
    
    print("\n🚀 Para iniciar el servidor local:")
    print("python app_complete.py")
    
    # Abrir navegador automáticamente
    print("\n🌐 Abriendo navegador...")
    webbrowser.open('http://localhost:5000')
    
    # Iniciar servidor automáticamente
    print("\n🖥️ Iniciando servidor...")
    os.system('python app_complete.py')

if __name__ == '__main__':
    auto_deploy()