# Sistema de afiliados para generar ingresos sin inversión
class AffiliateProgram:
    def __init__(self):
        self.programs = {
            'amazon': {
                'commission_rate': 0.03,  # 3%
                'signup_url': 'https://afiliados.amazon.es',
                'requirements': 'Sitio web activo'
            },
            'aliexpress': {
                'commission_rate': 0.05,  # 5%
                'signup_url': 'https://portals.aliexpress.com',
                'requirements': 'Ninguno'
            },
            'ebay': {
                'commission_rate': 0.02,  # 2%
                'signup_url': 'https://partnernetwork.ebay.com',
                'requirements': 'Sitio web'
            }
        }
    
    def get_signup_instructions(self):
        return """
        INSTRUCCIONES PARA REGISTRARSE EN PROGRAMAS DE AFILIADOS (GRATIS):
        
        1. AMAZON AFILIADOS:
           - Ir a: https://afiliados.amazon.es
           - Registrarse con tu cuenta Amazon
           - Proporcionar URL de tu sitio (usar tu dominio gratuito)
           - Esperar aprobación (1-3 días)
        
        2. ALIEXPRESS:
           - Ir a: https://portals.aliexpress.com
           - Registro inmediato
           - Sin requisitos especiales
        
        3. EBAY PARTNER NETWORK:
           - Ir a: https://partnernetwork.ebay.com
           - Registrarse con cuenta eBay
           - Proporcionar información del sitio
        """
    
    def calculate_potential_earnings(self, monthly_sales):
        """Calcular ganancias potenciales"""
        earnings = {}
        for store, data in self.programs.items():
            earnings[store] = monthly_sales * data['commission_rate']
        
        total = sum(earnings.values())
        return {
            'by_store': earnings,
            'total_monthly': total,
            'total_yearly': total * 12
        }