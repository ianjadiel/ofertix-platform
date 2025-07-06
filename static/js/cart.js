// Sistema de carrito de compra para Ofertix

class ShoppingCart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.shipping = 0;
        this.tax = 0;
        this.init();
    }

    init() {
        // Cargar carrito desde localStorage si existe
        const savedCart = localStorage.getItem('ofertixCart');
        if (savedCart) {
            try {
                const cartData = JSON.parse(savedCart);
                this.items = cartData.items || [];
                this.calculateTotals();
            } catch (e) {
                console.error('Error al cargar el carrito:', e);
                localStorage.removeItem('ofertixCart');
            }
        }

        // Crear elementos del carrito si no existen
        this.createCartElements();
        
        // Actualizar contador del carrito
        this.updateCartCounter();
    }

    createCartElements() {
        // Verificar si ya existe el botón del carrito
        if (!document.getElementById('cart-button')) {
            // Crear botón del carrito en la navbar
            const navbarNav = document.getElementById('navbarNav');
            const cartButton = document.createElement('div');
            cartButton.className = 'ms-auto d-flex align-items-center';
            cartButton.innerHTML = `
                <button id="cart-button" class="btn btn-outline-light position-relative" type="button" data-bs-toggle="offcanvas" data-bs-target="#cartOffcanvas">
                    <i class="fas fa-shopping-cart"></i>
                    <span id="cart-counter" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        0
                    </span>
                </button>
            `;
            navbarNav.appendChild(cartButton);

            // Crear offcanvas para el carrito
            const cartOffcanvas = document.createElement('div');
            cartOffcanvas.className = 'offcanvas offcanvas-end';
            cartOffcanvas.id = 'cartOffcanvas';
            cartOffcanvas.setAttribute('tabindex', '-1');
            cartOffcanvas.innerHTML = `
                <div class="offcanvas-header bg-primary text-white">
                    <h5 class="offcanvas-title"><i class="fas fa-shopping-cart me-2"></i>Tu Carrito</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">
                    <div id="cart-items" class="mb-3">
                        <!-- Los items del carrito se cargarán aquí -->
                    </div>
                    <div id="cart-empty" class="text-center py-5">
                        <i class="fas fa-shopping-cart fa-3x mb-3 text-muted"></i>
                        <p>Tu carrito está vacío</p>
                        <button class="btn btn-outline-primary btn-sm" data-bs-dismiss="offcanvas">
                            Continuar comprando
                        </button>
                    </div>
                    <div id="cart-summary" class="card mt-3 d-none">
                        <div class="card-body">
                            <div class="d-flex justify-content-between mb-2">
                                <span>Subtotal:</span>
                                <span id="cart-subtotal">0.00 €</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span>Envío:</span>
                                <span id="cart-shipping">0.00 €</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span>IVA (21%):</span>
                                <span id="cart-tax">0.00 €</span>
                            </div>
                            <hr>
                            <div class="d-flex justify-content-between fw-bold">
                                <span>Total:</span>
                                <span id="cart-total">0.00 €</span>
                            </div>
                        </div>
                    </div>
                    <div class="d-grid gap-2 mt-3">
                        <button id="checkout-button" class="btn btn-primary d-none">
                            <i class="fas fa-credit-card me-2"></i>Proceder al pago
                        </button>
                        <button id="clear-cart-button" class="btn btn-outline-danger d-none">
                            <i class="fas fa-trash me-2"></i>Vaciar carrito
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(cartOffcanvas);

            // Crear modal de pago
            const paymentModal = document.createElement('div');
            paymentModal.className = 'modal fade';
            paymentModal.id = 'paymentModal';
            paymentModal.setAttribute('tabindex', '-1');
            paymentModal.innerHTML = `
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title"><i class="fas fa-credit-card me-2"></i>Finalizar Compra</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <h6 class="mb-3">Información de Contacto</h6>
                                    <form id="payment-form">
                                        <div class="mb-3">
                                            <label for="payment-name" class="form-label">Nombre completo</label>
                                            <input type="text" class="form-control" id="payment-name" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="payment-email" class="form-label">Email</label>
                                            <input type="email" class="form-control" id="payment-email" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="payment-phone" class="form-label">Teléfono</label>
                                            <input type="tel" class="form-control" id="payment-phone" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="payment-address" class="form-label">Dirección</label>
                                            <input type="text" class="form-control" id="payment-address" required>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6 mb-3">
                                                <label for="payment-city" class="form-label">Ciudad</label>
                                                <input type="text" class="form-control" id="payment-city" required>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <label for="payment-postal-code" class="form-label">Código Postal</label>
                                                <input type="text" class="form-control" id="payment-postal-code" required>
                                            </div>
                                        </div>
                                        <hr class="my-4">
                                        <h6 class="mb-3">Método de Pago</h6>
                                        <div class="mb-3">
                                            <div class="form-check">
                                                <input class="form-check-input" type="radio" name="payment-method" id="payment-card" checked>
                                                <label class="form-check-label" for="payment-card">
                                                    <i class="fab fa-cc-visa me-2"></i>Tarjeta de crédito/débito
                                                </label>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="radio" name="payment-method" id="payment-paypal">
                                                <label class="form-check-label" for="payment-paypal">
                                                    <i class="fab fa-paypal me-2"></i>PayPal
                                                </label>
                                            </div>
                                        </div>
                                        <div id="card-payment-details">
                                            <div class="mb-3">
                                                <label for="card-number" class="form-label">Número de tarjeta</label>
                                                <input type="text" class="form-control" id="card-number" placeholder="1234 5678 9012 3456" required>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-6 mb-3">
                                                    <label for="card-expiry" class="form-label">Fecha de expiración</label>
                                                    <input type="text" class="form-control" id="card-expiry" placeholder="MM/AA" required>
                                                </div>
                                                <div class="col-md-6 mb-3">
                                                    <label for="card-cvv" class="form-label">CVV</label>
                                                    <input type="text" class="form-control" id="card-cvv" placeholder="123" required>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="mb-3">Resumen del Pedido</h6>
                                    <div class="card">
                                        <div class="card-body">
                                            <div id="payment-items-list">
                                                <!-- Lista de productos -->
                                            </div>
                                            <hr>
                                            <div class="d-flex justify-content-between mb-2">
                                                <span>Subtotal:</span>
                                                <span id="payment-subtotal">0.00 €</span>
                                            </div>
                                            <div class="d-flex justify-content-between mb-2">
                                                <span>Envío:</span>
                                                <span id="payment-shipping">0.00 €</span>
                                            </div>
                                            <div class="d-flex justify-content-between mb-2">
                                                <span>IVA (21%):</span>
                                                <span id="payment-tax">0.00 €</span>
                                            </div>
                                            <hr>
                                            <div class="d-flex justify-content-between fw-bold">
                                                <span>Total:</span>
                                                <span id="payment-total">0.00 €</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" id="complete-payment-btn">
                                <i class="fas fa-lock me-2"></i>Pagar ahora
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(paymentModal);

            // Agregar eventos
            document.getElementById('checkout-button').addEventListener('click', () => this.checkout());
            document.getElementById('clear-cart-button').addEventListener('click', () => this.clearCart());
            document.getElementById('complete-payment-btn').addEventListener('click', () => this.processPayment());
            
            // Cambiar entre métodos de pago
            document.getElementById('payment-card').addEventListener('change', () => {
                document.getElementById('card-payment-details').style.display = 'block';
            });
            document.getElementById('payment-paypal').addEventListener('change', () => {
                document.getElementById('card-payment-details').style.display = 'none';
            });
        }
    }

    addItem(product) {
        // Verificar si el producto ya está en el carrito
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            // Generar un ID único si no existe
            if (!product.id) {
                product.id = this.generateProductId(product);
            }
            
            this.items.push({
                ...product,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartUI();
        
        // Mostrar notificación
        this.showNotification('Producto añadido al carrito');
        
        return true;
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
        return true;
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart();
            this.updateCartUI();
            return true;
        }
        return false;
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartUI();
        
        // Cerrar el offcanvas
        const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('cartOffcanvas'));
        if (offcanvas) {
            offcanvas.hide();
        }
        
        // Mostrar notificación
        this.showNotification('Carrito vaciado correctamente');
    }

    calculateTotals() {
        // Calcular subtotal
        this.subtotal = this.items.reduce((total, item) => {
            return total + (item.price_with_profit * item.quantity);
        }, 0);
        
        // Calcular envío (gratis por encima de 50€, 4.95€ por debajo)
        this.shipping = this.subtotal > 50 ? 0 : 4.95;
        
        // Calcular IVA (21%)
        this.tax = this.subtotal * 0.21;
        
        // Calcular total
        this.total = this.subtotal + this.shipping + this.tax;
    }

    saveCart() {
        localStorage.setItem('ofertixCart', JSON.stringify({
            items: this.items
        }));
        this.calculateTotals();
        this.updateCartCounter();
    }

    updateCartCounter() {
        const counter = document.getElementById('cart-counter');
        if (counter) {
            const itemCount = this.items.reduce((count, item) => count + item.quantity, 0);
            counter.textContent = itemCount;
            
            // Mostrar u ocultar el contador
            if (itemCount > 0) {
                counter.classList.remove('d-none');
            } else {
                counter.classList.add('d-none');
            }
        }
    }

    updateCartUI() {
        const cartItems = document.getElementById('cart-items');
        const cartEmpty = document.getElementById('cart-empty');
        const cartSummary = document.getElementById('cart-summary');
        const checkoutButton = document.getElementById('checkout-button');
        const clearCartButton = document.getElementById('clear-cart-button');
        
        if (!cartItems) return;
        
        // Actualizar totales
        this.calculateTotals();
        
        // Actualizar UI según si hay items o no
        if (this.items.length === 0) {
            cartItems.innerHTML = '';
            cartEmpty.classList.remove('d-none');
            cartSummary.classList.add('d-none');
            checkoutButton.classList.add('d-none');
            clearCartButton.classList.add('d-none');
            return;
        }
        
        // Mostrar elementos del carrito
        cartEmpty.classList.add('d-none');
        cartSummary.classList.remove('d-none');
        checkoutButton.classList.remove('d-none');
        clearCartButton.classList.remove('d-none');
        
        // Generar HTML para los items
        cartItems.innerHTML = '';
        this.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'card mb-2';
            itemElement.innerHTML = `
                <div class="card-body p-2">
                    <div class="d-flex">
                        <div class="flex-shrink-0">
                            <img src="${item.image || 'https://via.placeholder.com/50'}" alt="${item.name}" width="50" height="50" class="rounded">
                        </div>
                        <div class="flex-grow-1 ms-3">
                            <h6 class="mb-0 fs-6">${item.name}</h6>
                            <div class="d-flex justify-content-between align-items-center mt-1">
                                <div class="input-group input-group-sm" style="max-width: 100px;">
                                    <button class="btn btn-outline-secondary btn-sm quantity-decrease" data-id="${item.id}" type="button">-</button>
                                    <input type="text" class="form-control text-center quantity-input" value="${item.quantity}" data-id="${item.id}" readonly>
                                    <button class="btn btn-outline-secondary btn-sm quantity-increase" data-id="${item.id}" type="button">+</button>
                                </div>
                                <div class="text-end">
                                    <div class="fw-bold">${(item.price_with_profit * item.quantity).toFixed(2)} €</div>
                                    <button class="btn btn-sm text-danger remove-item" data-id="${item.id}">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            cartItems.appendChild(itemElement);
        });
        
        // Actualizar totales en el resumen
        document.getElementById('cart-subtotal').textContent = `${this.subtotal.toFixed(2)} €`;
        document.getElementById('cart-shipping').textContent = `${this.shipping.toFixed(2)} €`;
        document.getElementById('cart-tax').textContent = `${this.tax.toFixed(2)} €`;
        document.getElementById('cart-total').textContent = `${this.total.toFixed(2)} €`;
        
        // Agregar eventos a los botones
        document.querySelectorAll('.quantity-decrease').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const item = this.items.find(item => item.id === id);
                if (item && item.quantity > 1) {
                    this.updateQuantity(id, item.quantity - 1);
                }
            });
        });
        
        document.querySelectorAll('.quantity-increase').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const item = this.items.find(item => item.id === id);
                if (item) {
                    this.updateQuantity(id, item.quantity + 1);
                }
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                this.removeItem(id);
            });
        });
    }

    checkout() {
        // Cerrar el offcanvas
        const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('cartOffcanvas'));
        if (offcanvas) {
            offcanvas.hide();
        }
        
        // Actualizar resumen de pago
        this.updatePaymentSummary();
        
        // Mostrar modal de pago
        const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
        paymentModal.show();
    }

    updatePaymentSummary() {
        const itemsList = document.getElementById('payment-items-list');
        if (!itemsList) return;
        
        // Generar HTML para los items
        itemsList.innerHTML = '';
        this.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'd-flex justify-content-between align-items-center mb-2';
            itemElement.innerHTML = `
                <div>
                    <span class="fw-bold">${item.quantity}x</span> ${item.name}
                </div>
                <div class="text-end">
                    ${(item.price_with_profit * item.quantity).toFixed(2)} €
                </div>
            `;
            itemsList.appendChild(itemElement);
        });
        
        // Actualizar totales
        document.getElementById('payment-subtotal').textContent = `${this.subtotal.toFixed(2)} €`;
        document.getElementById('payment-shipping').textContent = `${this.shipping.toFixed(2)} €`;
        document.getElementById('payment-tax').textContent = `${this.tax.toFixed(2)} €`;
        document.getElementById('payment-total').textContent = `${this.total.toFixed(2)} €`;
    }

    processPayment() {
        // Validar formulario
        const form = document.getElementById('payment-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        // Mostrar indicador de carga
        const payButton = document.getElementById('complete-payment-btn');
        const originalBtnText = payButton.innerHTML;
        payButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...';
        payButton.disabled = true;
        
        // Simular procesamiento de pago
        setTimeout(() => {
            // Recopilar datos del formulario
            const paymentData = {
                items: this.items,
                totals: {
                    subtotal: this.subtotal,
                    shipping: this.shipping,
                    tax: this.tax,
                    total: this.total
                },
                customer: {
                    name: document.getElementById('payment-name').value,
                    email: document.getElementById('payment-email').value,
                    phone: document.getElementById('payment-phone').value,
                    address: document.getElementById('payment-address').value,
                    city: document.getElementById('payment-city').value,
                    postalCode: document.getElementById('payment-postal-code').value
                },
                paymentMethod: document.getElementById('payment-card').checked ? 'card' : 'paypal'
            };
            
            // Procesar cada producto en el carrito
            this.processCartItems(paymentData);
            
        }, 2000);
    }

    async processCartItems(paymentData) {
        try {
            // Procesar cada producto individualmente
            const orderPromises = this.items.map(item => {
                return this.processOrderItem(item, paymentData.customer);
            });
            
            // Esperar a que se procesen todos los pedidos
            const results = await Promise.all(orderPromises);
            
            // Verificar si todos los pedidos se procesaron correctamente
            const allSuccessful = results.every(result => result.success);
            
            if (allSuccessful) {
                // Cerrar modal de pago
                const paymentModal = bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
                if (paymentModal) {
                    paymentModal.hide();
                }
                
                // Mostrar confirmación
                this.showOrderConfirmation(results, paymentData);
                
                // Limpiar carrito
                this.clearCart();
            } else {
                // Mostrar error
                alert('Ha ocurrido un error al procesar algunos productos. Por favor, inténtalo de nuevo.');
            }
        } catch (error) {
            console.error('Error al procesar el pago:', error);
            alert('Error al procesar el pago. Por favor, inténtalo de nuevo.');
        } finally {
            // Restaurar botón
            const payButton = document.getElementById('complete-payment-btn');
            payButton.innerHTML = '<i class="fas fa-lock me-2"></i>Pagar ahora';
            payButton.disabled = false;
        }
    }

    async processOrderItem(item, customer) {
        // Preparar datos del pedido
        const orderData = {
            product: item,
            customer: customer
        };
        
        try {
            const response = await fetch('/save-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });
            
            return await response.json();
        } catch (error) {
            console.error('Error al procesar el pedido:', error);
            return { success: false, error: 'Error de conexión' };
        }
    }

    showOrderConfirmation(results, paymentData) {
        // Crear modal de confirmación si no existe
        if (!document.getElementById('cartConfirmationModal')) {
            const modalHTML = `
                <div class="modal fade" id="cartConfirmationModal" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog modal-lg modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header bg-success text-white">
                                <h5 class="modal-title"><i class="fas fa-check-circle me-2"></i>¡Pedido Confirmado!</h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body" id="cart-confirmation-content">
                                <!-- Contenido dinámico -->
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Aceptar</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = modalHTML;
            document.body.appendChild(modalContainer.firstChild);
        }
        
        // Generar contenido de confirmación
        const confirmationContent = document.getElementById('cart-confirmation-content');
        
        // Crear contenido HTML
        let ordersHTML = '';
        results.forEach((result, index) => {
            const item = this.items[index];
            ordersHTML += `
                <div class="card mb-3">
                    <div class="card-header bg-light">
                        <div class="d-flex justify-content-between align-items-center">
                            <strong>Pedido #${result.order_id}</strong>
                            <span class="badge bg-success">Confirmado</span>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="d-flex">
                            <div class="flex-shrink-0">
                                <img src="${item.image || 'https://via.placeholder.com/80'}" alt="${item.name}" width="80" height="80" class="rounded">
                            </div>
                            <div class="flex-grow-1 ms-3">
                                <h6>${item.name}</h6>
                                <p class="mb-1">Cantidad: ${item.quantity}</p>
                                <p class="mb-1">Precio: ${(item.price_with_profit * item.quantity).toFixed(2)} €</p>
                                <p class="mb-1">Tienda: ${item.source || 'Desconocida'}</p>
                                <p class="mb-0">Entrega estimada: ${result.estimated_delivery}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        confirmationContent.innerHTML = `
            <div class="text-center mb-4">
                <div class="display-1 text-success mb-3">
                    <i class="fas fa-shopping-bag"></i>
                </div>
                <h4>¡Gracias por tu compra!</h4>
                <p class="lead">Tus pedidos han sido procesados correctamente</p>
            </div>
            
            <div class="mb-4">
                ${ordersHTML}
            </div>
            
            <div class="card mb-3">
                <div class="card-header bg-light">
                    <strong>Resumen de la compra</strong>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <h6>Información de envío:</h6>
                            <p class="mb-1">${paymentData.customer.name}</p>
                            <p class="mb-1">${paymentData.customer.address}</p>
                            <p class="mb-1">${paymentData.customer.city}, ${paymentData.customer.postalCode}</p>
                            <p class="mb-1">${paymentData.customer.email}</p>
                            <p class="mb-0">${paymentData.customer.phone}</p>
                        </div>
                        <div class="col-md-6">
                            <h6>Detalles del pago:</h6>
                            <p class="mb-1">Método: ${paymentData.paymentMethod === 'card' ? 'Tarjeta de crédito/débito' : 'PayPal'}</p>
                            <p class="mb-1">Subtotal: ${paymentData.totals.subtotal.toFixed(2)} €</p>
                            <p class="mb-1">Envío: ${paymentData.totals.shipping.toFixed(2)} €</p>
                            <p class="mb-1">IVA (21%): ${paymentData.totals.tax.toFixed(2)} €</p>
                            <p class="mb-0 fw-bold">Total: ${paymentData.totals.total.toFixed(2)} €</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                Recibirás un correo electrónico con los detalles de tus pedidos y el seguimiento de envío.
            </div>
        `;
        
        // Mostrar modal
        const confirmationModal = new bootstrap.Modal(document.getElementById('cartConfirmationModal'));
        confirmationModal.show();
    }

    showNotification(message) {
        // Crear elemento de notificación si no existe
        if (!document.getElementById('cart-notification')) {
            const notification = document.createElement('div');
            notification.id = 'cart-notification';
            notification.className = 'position-fixed bottom-0 end-0 p-3';
            notification.style.zIndex = '5000';
            document.body.appendChild(notification);
        }
        
        // Generar ID único para el toast
        const toastId = 'toast-' + Date.now();
        
        // Crear toast
        const toastElement = document.createElement('div');
        toastElement.className = 'toast';
        toastElement.id = toastId;
        toastElement.setAttribute('role', 'alert');
        toastElement.setAttribute('aria-live', 'assertive');
        toastElement.setAttribute('aria-atomic', 'true');
        toastElement.innerHTML = `
            <div class="toast-header bg-primary text-white">
                <i class="fas fa-shopping-cart me-2"></i>
                <strong class="me-auto">Ofertix</strong>
                <small>Ahora</small>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;
        
        document.getElementById('cart-notification').appendChild(toastElement);
        
        // Mostrar toast
        const toast = new bootstrap.Toast(toastElement, { autohide: true, delay: 3000 });
        toast.show();
        
        // Eliminar después de ocultarse
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }

    generateProductId(product) {
        // Generar un ID único basado en el nombre y la fuente
        return 'product_' + btoa(product.name + '_' + (product.source || '')).replace(/[^a-zA-Z0-9]/g, '');
    }
}

// Inicializar carrito cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Crear instancia global del carrito
    window.shoppingCart = new ShoppingCart();
    
    // Agregar evento para botones de compra
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('buy-now') || e.target.closest('.buy-now')) {
            const button = e.target.classList.contains('buy-now') ? e.target : e.target.closest('.buy-now');
            const productData = JSON.parse(button.getAttribute('data-product'));
            window.shoppingCart.addItem(productData);
            
            // Mostrar el carrito
            const cartOffcanvas = new bootstrap.Offcanvas(document.getElementById('cartOffcanvas'));
            cartOffcanvas.show();
            
            // Prevenir comportamiento por defecto
            e.preventDefault();
        }
    });
});