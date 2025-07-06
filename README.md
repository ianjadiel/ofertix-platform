# Ofertix - Sistema de Búsqueda de Productos

Ofertix es una aplicación web que permite buscar productos en diferentes tiendas online como AliExpress, Amazon, eBay, etc. La aplicación muestra los resultados con precios originales y con un margen de ganancia automático.

## Características

- Búsqueda de productos por nombre o palabra clave
- Visualización de resultados reales de productos disponibles en diferentes tiendas
- Cálculo automático de precios con margen de ganancia
- Interfaz de usuario atractiva y responsive
- Funcionalidad para guardar información de pedidos (preparada para futura automatización)

## Requisitos previos

- Python 3.7 o superior
- Navegador web moderno
- Clave API de SerpApi (https://serpapi.com/)

## Instalación

1. Clona o descarga este repositorio en tu ordenador

2. Crea un entorno virtual (recomendado):

```bash
python -m venv venv
```

3. Activa el entorno virtual:

- En Windows:
```bash
venv\Scripts\activate
```

- En macOS/Linux:
```bash
source venv/bin/activate
```

4. Instala las dependencias:

```bash
pip install -r requirements.txt
```

5. Crea un archivo `.env` en la raíz del proyecto con tu clave API de SerpApi:

```
SERPAPI_KEY=tu_clave_api_aqui
```

## Ejecución

1. Asegúrate de que el entorno virtual está activado

2. Ejecuta la aplicación:

```bash
python app.py
```

3. Abre tu navegador y visita: `http://127.0.0.1:5000`

## Uso

1. En la página principal, introduce el término de búsqueda en el campo de texto
2. Haz clic en el botón "Buscar" o presiona Enter
3. Explora los resultados de productos que aparecerán en la página
4. Puedes ver los detalles del producto, visitar la tienda original o simular una compra

## Estructura del proyecto

```
OfertixBackend/
├── app.py                 # Aplicación principal (backend Flask)
├── requirements.txt       # Dependencias del proyecto
├── .env                   # Archivo de variables de entorno (debes crearlo)
├── static/                # Archivos estáticos
│   ├── css/
│   │   └── styles.css    # Estilos personalizados
│   └── js/
│       └── main.js       # JavaScript del frontend
└── templates/
    └── index.html        # Plantilla HTML principal
```

## Notas adicionales

- Para la funcionalidad completa de automatización de pedidos, se necesitaría implementar Selenium o una herramienta similar (comentado en requirements.txt para implementación futura)
- La aplicación utiliza SerpApi para obtener datos reales de productos. Asegúrate de tener una clave API válida y verificar los límites de uso según tu plan

## Personalización

Puedes personalizar la aplicación modificando los siguientes archivos:

- `static/css/styles.css`: Para cambiar la apariencia visual
- `templates/index.html`: Para modificar la estructura HTML
- `static/js/main.js`: Para cambiar el comportamiento del frontend
- `app.py`: Para modificar la lógica del backend

## Licencia

Este proyecto es para uso personal y educativo.