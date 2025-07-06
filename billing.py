# Sistema de facturación automática
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from datetime import datetime

class BillingSystem:
    def generate_invoice(self, order_id):
        order = Order.query.get(order_id)
        user = User.query.get(order.user_id)
        
        # Crear PDF de factura
        filename = f"factura_{order.id}_{datetime.now().strftime('%Y%m%d')}.pdf"
        c = canvas.Canvas(filename, pagesize=A4)
        
        # Encabezado
        c.drawString(100, 750, "OFERTIX S.L.")
        c.drawString(100, 730, "CIF: [TU_CIF]")
        c.drawString(100, 710, "Dirección: [TU_DIRECCIÓN]")
        
        # Datos del cliente
        c.drawString(100, 650, f"Cliente: {user.name}")
        c.drawString(100, 630, f"Email: {user.email}")
        
        # Detalles del pedido
        c.drawString(100, 570, f"Factura Nº: {order.id}")
        c.drawString(100, 550, f"Fecha: {order.created_at.strftime('%d/%m/%Y')}")
        
        # Productos
        y_position = 500
        c.drawString(100, y_position, "Descripción")
        c.drawString(300, y_position, "Cantidad")
        c.drawString(400, y_position, "Precio")
        c.drawString(500, y_position, "Total")
        
        y_position -= 30
        product = Product.query.get(order.product_id)
        c.drawString(100, y_position, product.name[:40])
        c.drawString(300, y_position, str(order.quantity))
        c.drawString(400, y_position, f"{order.total_amount:.2f}€")
        c.drawString(500, y_position, f"{order.total_amount:.2f}€")
        
        # Total
        y_position -= 50
        c.drawString(400, y_position, f"TOTAL: {order.total_amount:.2f}€")
        
        c.save()
        return filename