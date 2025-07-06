# Sistema de pagos real con Stripe
import stripe
from flask import current_app

class PaymentProcessor:
    def __init__(self):
        stripe.api_key = current_app.config['STRIPE_SECRET_KEY']
    
    def create_payment_intent(self, amount, currency='eur', customer_email=None):
        try:
            intent = stripe.PaymentIntent.create(
                amount=int(amount * 100),  # Stripe usa centavos
                currency=currency,
                receipt_email=customer_email,
                metadata={
                    'platform': 'ofertix',
                    'integration_check': 'accept_a_payment'
                }
            )
            return {
                'success': True,
                'client_secret': intent.client_secret,
                'payment_intent_id': intent.id
            }
        except stripe.error.StripeError as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def confirm_payment(self, payment_intent_id):
        try:
            intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            return {
                'success': intent.status == 'succeeded',
                'status': intent.status,
                'amount': intent.amount / 100
            }
        except stripe.error.StripeError as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def create_transfer_to_store(self, amount, store_account_id):
        """Transferir dinero a la cuenta de la tienda"""
        try:
            transfer = stripe.Transfer.create(
                amount=int(amount * 100),
                currency='eur',
                destination=store_account_id,
            )
            return {
                'success': True,
                'transfer_id': transfer.id
            }
        except stripe.error.StripeError as e:
            return {
                'success': False,
                'error': str(e)
            }