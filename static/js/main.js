// Funcionalidad principal para Ofertix con Tailwind CSS

// Elementos del DOM
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const productsContainer = document.getElementById('products-container');
const loadingSpinner = document.getElementById('loading-spinner');
const resultsTitle = document.getElementById('results-title');
const noResults = document.getElementById('no-results');
const orderModal = document.getElementById('orderModal');
const completeOrderBtn = document.getElementById('complete-order-btn');

// Variables globales
let currentProduct = null;
let currentView = 'home'; // 'home', 'categories', 'offers'
let mobileMenuOpen = false;

// Categorías disponibles
const categories = [
    { id: 'electronics', name: 'Electrónicos', icon: 'ri-smartphone-line' },
    { id: 'computers', name: 'Computadoras', icon: 'ri-computer-line' },
    { id: 'audio', name: 'Audio', icon: 'ri-headphone-line' },
    { id: 'gaming', name: 'Gaming', icon: 'ri-gamepad-line' },
    { id: 'wearables', name: 'Wearables', icon: 'ri-watch-line' },
    { id: 'tablets', name: 'Tablets', icon: 'ri-tablet-line' },
    { id: 'home', name: 'Hogar', icon: 'ri-home-line' },
    { id: 'fashion', name: 'Moda', icon: 'ri-shirt-line' }
];

// Productos destacados para el catálogo principal
const featuredProducts = [
    // Smartphones
    {
        id: 1,
        name: "iPhone 15 Pro Max 256GB",
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
        original_price: "1299.00 €",
        price_with_profit: 1199.99,
        source: "Amazon",
        shipping: "Envío gratis",
        delivery_time: "1-2 días",
        description: "El iPhone más avanzado con chip A17 Pro y cámara de 48MP",
        link: "#",
        category: "Electrónicos"
    },
    {
        id: 2,
        name: "Samsung Galaxy S24 Ultra",
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
        original_price: "1199.00 €",
        price_with_profit: 1099.99,
        source: "eBay",
        shipping: "Envío gratis",
        delivery_time: "2-3 días",
        description: "Smartphone premium con S Pen y cámara de 200MP",
        link: "#",
        category: "Electrónicos"
    },
    {
        id: 3,
        name: "Google Pixel 8 Pro",
        image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop",
        original_price: "899.00 €",
        price_with_profit: 799.99,
        source: "MediaMarkt",
        shipping: "Envío gratis",
        delivery_time: "1-2 días",
        description: "Smartphone con IA avanzada y cámara computacional",
        link: "#",
        category: "Electrónicos"
    },
    {
        id: 4,
        name: "OnePlus 12 256GB",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
        original_price: "799.00 €",
        price_with_profit: 699.99,
        source: "Amazon",
        shipping: "Envío gratis",
        delivery_time: "1-2 días",
        description: "Flagship killer con carga rápida de 100W",
        link: "#",
        category: "Electrónicos"
    },
    
    // Laptops y Computadoras
    {
        id: 5,
        name: "MacBook Air M3 13\" 256GB",
        image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop",
        original_price: "1299.00 €",
        price_with_profit: 1199.99,
        source: "AliExpress",
        shipping: "Envío gratis",
        delivery_time: "5-7 días",
        description: "Laptop ultradelgada con chip M3 y hasta 18 horas de batería",
        link: "#",
        category: "Computadoras"
    },
    {
        id: 6,
        name: "MacBook Pro 14\" M3 Pro",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
        original_price: "2199.00 €",
        price_with_profit: 1999.99,
        source: "Amazon",
        shipping: "Envío gratis",
        delivery_time: "1-2 días",
        description: "Laptop profesional con pantalla Liquid Retina XDR",
        link: "#",
        category: "Computadoras"
    },
    {
        id: 7,
        name: "Dell XPS 13 Plus",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
        original_price: "1599.00 €",
        price_with_profit: 1399.99,
        source: "eBay",
        shipping: "Envío gratis",
        delivery_time: "2-3 días",
        description: "Ultrabook premium con pantalla InfinityEdge",
        link: "#",
        category: "Computadoras"
    },
    {
        id: 8,
        name: "ASUS ROG Zephyrus G14",
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop",
        original_price: "1899.00 €",
        price_with_profit: 1699.99,
        source: "MediaMarkt",
        shipping: "Envío gratis",
        delivery_time: "2-3 días",
        description: "Laptop gaming compacta con RTX 4060",
        link: "#",
        category: "Computadoras"
    },
    
    // Audio
    {
        id: 9,
        name: "Sony WH-1000XM5 Auriculares",
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop",
        original_price: "399.00 €",
        price_with_profit: 299.99,
        source: "Amazon",
        shipping: "Envío gratis",
        delivery_time: "1-2 días",
        description: "Auriculares inalámbricos con cancelación de ruido líder en la industria",
        link: "#",
        category: "Audio"
    },
    {
        id: 10,
        name: "Apple AirPods Pro 2",
        image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop",
        original_price: "279.00 €",
        price_with_profit: 229.99,
        source: "eBay",
        shipping: "Envío gratis",
        delivery_time: "1-2 días",
        description: "Auriculares inalámbricos con cancelación activa de ruido",
        link: "#",
        category: "Audio"
    },
    {
        id: 11,
        name: "Bose QuietComfort 45",
        image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop",
        original_price: "329.00 €",
        price_with_profit: 279.99,
        source: "MediaMarkt",
        shipping: "Envío gratis",
        delivery_time: "1-2 días",
        description: "Auriculares premium con comodidad excepcional",
        link: "#",
        category: "Audio"
    },
    {
        id: 12,
        name: "JBL Charge 5 Altavoz",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
        original_price: "179.00 €",
        price_with_profit: 149.99,
        source: "Amazon",
        shipping: "Envío gratis",
        delivery_time: "1-2 días",
        description: "Altavoz Bluetooth resistente al agua con 20h de batería",
        link: "#",
        category: "Audio"
    },
    
    // Gaming
    {
        id: 13,
        name: "Nintendo Switch OLED",
        image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop",
        original_price: "349.00 €",
        price_with_profit: 319.99,
        source: "eBay",
        shipping: "Envío gratis",
        delivery_time: "2-3 días",
        description: "Consola híbrida con pantalla OLED de 7 pulgadas",
        link: "#",
        category: "Gaming"
    },
    {
        id: 14,
        name: "PlayStation 5 Slim",
        image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop",
        original_price: "549.00 €",
        price_with_profit: 499.99,
        source: "MediaMarkt",
        shipping: "Envío gratis",
        delivery_time: "2-3 días",
        description: "Consola de nueva generación con gráficos 4K",
        link: "#",
        category: "Gaming"
    },
    {
        id: 15,
        name: "Xbox Series X",
        image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&h=400&fit=crop",
        original_price: "499.00 €",
        price_with_profit: 459.99,
        source: "Amazon",
        shipping: "Envío gratis",
        delivery_time: "1-2 días",
        description: "La consola Xbox más potente con 12 teraflops",
        link: "#",
        category: "Gaming"
    },
    {
        id: 16,
        name: "Steam Deck 512GB",
        image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=400&fit=crop",
        original_price: "679.00 €",
        price_with_profit: 629.99,
        source: "eBay",
        shipping: "Envío gratis",
        delivery_time: "3-5 días",
        description: "PC gaming portátil con acceso a toda tu biblioteca Steam",
        link: "#",
        category: "Gaming"
    },
    
    // Wearables
    {
        id: 17,
        name: "Apple Watch Series 9 45mm",
        image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&h=400&fit=crop",
        original_price: "449.00 €",
        price_with_profit: 399.99,
        source: "Amazon",
        shipping: "Envío gratis",
        delivery_time: "1-2 días",
        description: "Smartwatch con chip S9 y pantalla Always-On Retina",
        link: "#",
        category: "Wearables"
    },
    {
        id: 18,
        name: "Samsung Galaxy Watch 6",
        image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop",
        original_price: "329.00 €",
        price_with_profit: 279.99,
        source: "MediaMarkt",
        shipping: "Envío gratis",
        delivery_time: "1-2 días",
        description: "Smartwatch con monitoreo avanzado de salud",
        link: "#",
        category: "Wearables"
    },
    {
        id: 19,
        name: "Garmin Fenix 7",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
        original_price: "699.00 €",
        price_with_profit: 599.99,
        source: "Amazon",
        shipping: "Envío gratis",
        delivery_time: "1-2 días",
        description: "Reloj multideporte con GPS y batería de hasta 18 días",
        link: "#",
        category: "Wearables"
    },
    
    // Tablets
    {
        id: 20,
        name: "iPad Air 11\" M2 256GB",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
        original_price: "799.00 €",
        price_with_profit: 749.99,
        source: "AliExpress",
        shipping: "Envío gratis",
        delivery_time: "5-7 días",
        description: "Tablet profesional con chip M2 y compatibilidad con Apple Pencil",
        link: "#",
        category: "Tablets"
    },
    {
        id: 21,
        name: "iPad Pro 12.9\" M2 512GB",
        image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop",
        original_price: "1449.00 €",
        price_with_profit: 1299.99,
        source: "Amazon",
        shipping: "Envío gratis",
        delivery_time: "1-2 días",
        description: "Tablet profesional con pantalla Liquid Retina XDR",
        link: "#",
        category: "Tablets"
    },
    {
        id: 22,
        name: "Samsung Galaxy Tab S9 Ultra",
        image: "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=400&h=400&fit=crop",
        original_price: "1199.00 €",
        price_with_profit: 1099.99,
        source: "MediaMarkt",
        shipping: "Envío gratis",
        delivery_time: "2-3 días",
        description: "Tablet Android premium con S Pen incluido",
        link: "#",
        category: "Tablets"
    },
    
    // Hogar
    {
        id: 23,
        name: "Dyson V15 Detect Aspiradora",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
        original_price: "649.00 €",
        price_with_profit: 549.99,
        source: "eBay",
        shipping: "Envío gratis",
        delivery_time: "3-5 días",
        description: "Aspiradora inalámbrica con detección láser de polvo",
        link: "#",
        category: "Hogar"
    },
    {
        id: 24,
        name: "Roomba j7+ Robot Aspirador",
        image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop",
        original_price: "899.00 €",
        price_with_profit: 749.99,
        source: "Amazon",
        shipping: "Envío gratis",
        delivery_time: "1-2 días",
        description: "Robot aspirador inteligente con vaciado automático",
        link: "#",
        category: "Hogar"
    },
    {
        id: 25,
        name: "Nespresso Vertuo Next",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop",
        original_price: "199.00 €",
        price_with_profit: 149.99,
        source: "MediaMarkt",
        shipping: "Envío gratis",
        delivery_time: "1-2 días",
        description: "Cafetera de cápsulas con tecnología Centrifusion",
        link: "#",
        category: "Hogar"
    },
    {
        id: 26,
        name: "Philips Hue Starter Kit",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        original_price: "199.00 €",
        price_with_profit: 169.99,
        source: "Amazon",
        shipping: "Envío gratis",
        delivery_time: "1-2 días",
        description: "Sistema de iluminación inteligente con 16 millones de colores",
        link: "#",
        category: "Hogar"
    },
    
    // Moda y Accesorios
    {
        id: 27,
        name: "Ray-Ban Aviator Classic",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop",
        original_price: "159.00 €",
        price_with_profit: 129.99,
        source: "eBay",
        shipping: "Envío gratis",
        delivery_time: "2-3 días",
        description: "Gafas de sol icónicas con protección UV400",
        link: "#",
        category: "Moda"
    },
    {
        id: 28,
        name: "Nike Air Max 270",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
        original_price: "149.00 €",
        price_with_profit: 119.99,
        source: "Amazon",
        shipping: "Envío gratis",
        delivery_time: "1-2 días",
        description: "Zapatillas deportivas con amortiguación Air Max",
        link: "#",
        category: "Moda"
    },
    {
        id: 29,
        name: "Adidas Ultraboost 22",
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop",
        original_price: "179.00 €",
        price_with_profit: 149.99,
        source: "MediaMarkt",
        shipping: "Envío gratis",
        delivery_time: "2-3 días",
        description: "Zapatillas de running con tecnología Boost",
        link: "#",
        category: "Moda"
    },
    {
        id: 30,
        name: "Levi's 501 Original Jeans",
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
        original_price: "99.00 €",
        price_with_profit: 79.99,
        source: "eBay",
        shipping: "Envío gratis",
        delivery_time: "2-3 días",
        description: "Jeans clásicos de corte recto en denim premium",
        link: "#",
        category: "Moda"
    }
];

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Cargar productos destacados al inicio
    loadFeaturedProducts();
    
    // Evento para el botón de búsqueda
    searchButton.addEventListener('click', searchProducts);
    
    // Evento para buscar al presionar Enter
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchProducts();
        }
    });
    
    // Evento para completar pedido
    completeOrderBtn.addEventListener('click', saveOrder);
    
    // Eventos de navegación
    setupNavigationEvents();
    
    // Configurar menú móvil
    setupMobileMenu();
    
    // Evento para el botón "Cómo funciona"
    const howItWorksBtn = document.getElementById('how-it-works-btn');
    if (howItWorksBtn) {
        howItWorksBtn.addEventListener('click', openHowItWorksModal);
    }
});

/**
 * Configurar eventos de navegación
 */
function setupNavigationEvents() {
    // Navegación principal
    const navLinks = document.querySelectorAll('nav a, footer a');
    navLinks.forEach(link => {
        const text = link.textContent.trim().toLowerCase();
        if (text === 'inicio') {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showHomeView();
                updateActiveNavigation(link);
            });
        } else if (text === 'categorías') {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showCategoriesView();
                updateActiveNavigation(link);
            });
        } else if (text === 'ofertas') {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showOffersView();
                updateActiveNavigation(link);
            });
        }
    });
}

/**
 * Configurar menú móvil
 */
function setupMobileMenu() {
    const mobileMenuButton = document.querySelector('.md\\:hidden');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
    }
    
    // Crear menú móvil si no existe
    createMobileMenu();
}

/**
 * Crear menú móvil
 */
function createMobileMenu() {
    const header = document.querySelector('header');
    const mobileMenu = document.createElement('div');
    mobileMenu.id = 'mobile-menu';
    mobileMenu.className = 'md:hidden bg-white border-t border-gray-200 hidden';
    mobileMenu.innerHTML = `
        <div class="px-4 py-2 space-y-1">
            <a href="#" class="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors" onclick="showHomeView(); closeMobileMenu();">Inicio</a>
            <a href="#" class="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors" onclick="showCategoriesView(); closeMobileMenu();">Categorías</a>
            <a href="#" class="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors" onclick="showOffersView(); closeMobileMenu();">Ofertas</a>
            <div class="border-t border-gray-200 pt-2 mt-2">
                <a href="#" class="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors">Mi cuenta</a>
                <a href="#" class="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors">Lista de deseos</a>
            </div>
        </div>
    `;
    header.appendChild(mobileMenu);
}

/**
 * Alternar menú móvil
 */
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuButton = document.querySelector('.md\\:hidden i');
    
    mobileMenuOpen = !mobileMenuOpen;
    
    if (mobileMenuOpen) {
        mobileMenu.classList.remove('hidden');
        mobileMenuButton.className = 'ri-close-line text-xl';
    } else {
        mobileMenu.classList.add('hidden');
        mobileMenuButton.className = 'ri-menu-line text-xl';
    }
}

/**
 * Cerrar menú móvil
 */
function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuButton = document.querySelector('.md\\:hidden i');
    
    mobileMenuOpen = false;
    mobileMenu.classList.add('hidden');
    mobileMenuButton.className = 'ri-menu-line text-xl';
}

/**
 * Mostrar vista de inicio
 */
function showHomeView() {
    currentView = 'home';
    loadFeaturedProducts();
    scrollToTop();
}

/**
 * Mostrar vista de categorías
 */
function showCategoriesView() {
    currentView = 'categories';
    resultsTitle.textContent = 'Explorar por Categorías';
    resultsTitle.classList.remove('hidden');
    noResults.classList.add('hidden');
    
    // Crear vista de categorías
    productsContainer.innerHTML = '';
    productsContainer.className = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6';
    
    categories.forEach(category => {
        const categoryCard = createCategoryCard(category);
        productsContainer.appendChild(categoryCard);
    });
    
    scrollToTop();
}

/**
 * Mostrar vista de ofertas
 */
function showOffersView() {
    currentView = 'offers';
    resultsTitle.textContent = 'Ofertas Especiales';
    resultsTitle.classList.remove('hidden');
    noResults.classList.add('hidden');
    
    // Filtrar productos con descuentos significativos
    const offerProducts = featuredProducts.filter(product => {
        const savings = calculateSavings(product.original_price, product.price_with_profit);
        return savings.percentage >= 10; // Mostrar productos con 10% o más de descuento
    });
    
    productsContainer.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8';
    displayProducts(offerProducts);
    scrollToTop();
}

/**
 * Crear tarjeta de categoría
 */
function createCategoryCard(category) {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'group cursor-pointer';
    categoryDiv.onclick = () => filterByCategory(category.id);
    
    categoryDiv.innerHTML = `
        <div class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6 text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <i class="${category.icon} text-2xl text-white"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">${category.name}</h3>
            <p class="text-sm text-gray-500 mt-2">Ver productos</p>
        </div>
    `;
    
    return categoryDiv;
}

/**
 * Filtrar productos por categoría
 */
function filterByCategory(categoryId) {
    const categoryName = categories.find(cat => cat.id === categoryId)?.name || 'Categoría';
    resultsTitle.textContent = `Productos en ${categoryName}`;
    resultsTitle.classList.remove('hidden');
    
    // Mapear categorías a las que están en featuredProducts
    const categoryMap = {
        'electronics': ['Electrónicos'],
        'computers': ['Computadoras'],
        'audio': ['Audio'],
        'gaming': ['Gaming'],
        'wearables': ['Wearables'],
        'tablets': ['Tablets'],
        'home': ['Hogar'],
        'fashion': ['Moda']
    };
    
    const targetCategories = categoryMap[categoryId] || [];
    const filteredProducts = featuredProducts.filter(product => 
        targetCategories.includes(product.category)
    );
    
    productsContainer.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8';
    displayProducts(filteredProducts);
    scrollToTop();
}

/**
 * Actualizar navegación activa
 */
function updateActiveNavigation(activeLink) {
    // Remover clase activa de todos los enlaces
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('text-primary-600', 'font-bold');
        link.classList.add('text-gray-700');
    });
    
    // Agregar clase activa al enlace seleccionado
    if (activeLink) {
        activeLink.classList.remove('text-gray-700');
        activeLink.classList.add('text-primary-600', 'font-bold');
    }
}

/**
 * Scroll suave hacia arriba
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * Función para cargar productos destacados en la página principal
 */
function loadFeaturedProducts() {
    // Mostrar título de productos destacados
    resultsTitle.textContent = 'Productos Destacados en Oferta';
    resultsTitle.classList.remove('hidden');
    
    // Mostrar productos destacados
    displayProducts(featuredProducts);
}

/**
 * Función para buscar productos
 */
async function searchProducts() {
    const query = searchInput.value.trim();
    
    if (!query) {
        alert('Por favor, ingresa un término de búsqueda');
        return;
    }
    
    // Mostrar spinner de carga
    loadingSpinner.classList.remove('hidden');
    productsContainer.innerHTML = '';
    resultsTitle.classList.add('hidden');
    noResults.classList.add('hidden');
    
    try {
        const response = await fetch('/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
        });
        
        const data = await response.json();
        
        // Ocultar spinner de carga
        loadingSpinner.classList.add('hidden');
        
        if (response.ok) {
            resultsTitle.textContent = `Resultados para: "${query}"`;
            displayProducts(data.products);
        } else {
            console.error('Error:', data.error);
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error('Error:', error);
        loadingSpinner.classList.add('hidden');
        alert('Error al conectar con el servidor');
    }
}

/**
 * Función para mostrar los productos en la interfaz
 * @param {Array} products - Lista de productos a mostrar
 */
function displayProducts(products) {
    productsContainer.innerHTML = '';
    
    if (products && products.length > 0) {
        resultsTitle.classList.remove('hidden');
        
        products.forEach(product => {
            const productCard = createProductCard(product);
            productsContainer.appendChild(productCard);
        });
    } else {
        noResults.classList.remove('hidden');
    }
}

/**
 * Función para crear una tarjeta de producto con Tailwind CSS
 * @param {Object} product - Datos del producto
 * @returns {HTMLElement} - Elemento HTML de la tarjeta
 */
function createProductCard(product) {
    const productDiv = document.createElement('div');
    productDiv.className = 'group relative';
    
    // Generar descripción profesional si no existe
    const professionalDescription = generateProfessionalDescription(product);
    
    // Formatear precios
    const originalPrice = product.original_price || 'Precio no disponible';
    const priceWithProfit = product.price_with_profit ? 
        `${product.price_with_profit.toFixed(2)} €` : 'Precio no disponible';
    
    // Calcular ahorro
    const savings = favoritesManager.calculateSavings(product.original_price, product.price_with_profit);
    const isFav = favoritesManager.isFavorite(product.id);
    
    productDiv.innerHTML = `
        <div class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
            <!-- Imagen del producto con overlay -->
            <div class="relative overflow-hidden group">
                <img src="${product.image}" alt="${product.name}" 
                     class="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700">
                
                <!-- Badges y botones -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                ${savings.percentage > 0 ? `
                    <div class="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        -${savings.percentage}% OFF
                    </div>
                ` : ''}
                
                <!-- Botón de favoritos -->
                <button onclick="toggleFavorite(${product.id}, ${JSON.stringify(product).replace(/"/g, '&quot;')})" 
                        data-product-id="${product.id}"
                        class="favorite-btn absolute top-3 right-3 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 p-2.5 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${isFav ? 'favorited' : ''}">
                    <i class="${isFav ? 'ri-heart-fill text-red-500' : 'ri-heart-line text-gray-600'} text-lg"></i>
                </button>
                
                <!-- Botones de acción rápida -->
                <div class="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <div class="flex space-x-2">
                        <button onclick="openProductDetailsModal(${JSON.stringify(product).replace(/"/g, '&quot;')})" 
                                class="flex-1 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 py-2 rounded-lg transition-all duration-200 text-sm font-medium flex items-center justify-center space-x-1">
                            <i class="ri-eye-line"></i>
                            <span>Ver</span>
                        </button>
                        <button onclick="cart.addItem(${JSON.stringify(product).replace(/"/g, '&quot;')})" 
                                class="flex-1 bg-primary-500/90 backdrop-blur-sm hover:bg-primary-600 text-white py-2 rounded-lg transition-all duration-200 text-sm font-medium flex items-center justify-center space-x-1">
                            <i class="ri-shopping-cart-line"></i>
                            <span>Carrito</span>
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Contenido del producto -->
            <div class="p-5">
                <!-- Categoría y rating -->
                <div class="flex items-center justify-between mb-3">
                    <span class="inline-block bg-primary-100 text-primary-700 text-xs font-medium px-2 py-1 rounded-full">
                        ${product.category || 'General'}
                    </span>
                    <div class="flex items-center space-x-1">
                        <div class="flex text-yellow-400 text-sm">
                            ${generateStarRating(4.5)}
                        </div>
                        <span class="text-xs text-gray-500 ml-1">(4.5)</span>
                    </div>
                </div>
                
                <!-- Nombre del producto -->
                <h3 class="font-bold text-gray-800 mb-2 line-clamp-2 text-base leading-tight hover:text-primary-600 transition-colors cursor-pointer" 
                    onclick="openProductDetailsModal(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                    ${product.name}
                </h3>
                
                <!-- Descripción profesional -->
                <p class="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    ${professionalDescription}
                </p>
                
                <!-- Información de la tienda -->
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-2">
                        <div class="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <i class="ri-store-line text-white text-xs"></i>
                        </div>
                        <span class="text-sm text-gray-700 font-medium">${product.source}</span>
                    </div>
                    <div class="flex items-center space-x-1 text-green-600">
                        <i class="ri-shield-check-line text-sm"></i>
                        <span class="text-xs font-medium">Verificado</span>
                    </div>
                </div>
                
                <!-- Precios -->
                <div class="mb-4">
                    ${originalPrice !== 'Precio no disponible' ? `
                        <div class="flex items-center space-x-2 mb-1">
                            <span class="text-sm text-gray-500 line-through">${originalPrice}</span>
                            ${savings.percentage > 0 ? `<span class="text-xs text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded-full">Ahorra ${savings.amount}€</span>` : ''}
                        </div>
                    ` : ''}
                    <div class="flex items-center justify-between">
                        <span class="text-2xl font-bold text-primary-600">${priceWithProfit}</span>
                        <div class="text-right">
                            <div class="flex items-center space-x-1 text-green-600 text-sm">
                                <i class="ri-truck-line"></i>
                                <span class="font-medium">${product.shipping || 'Envío gratis'}</span>
                            </div>
                            <div class="flex items-center space-x-1 text-gray-600 text-xs mt-1">
                                <i class="ri-time-line"></i>
                                <span>${product.delivery_time || '2-3 días'}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Botón de compra principal -->
                <button onclick="openOrderModal(${JSON.stringify(product).replace(/"/g, '&quot;')})" 
                        class="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl transition-all duration-300 text-sm font-bold flex items-center justify-center space-x-2 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    <i class="ri-flashlight-line text-lg"></i>
                    <span>COMPRAR AHORA</span>
                </button>
            </div>
        </div>
    `;
    
    return productDiv;
}

// Actualizar la función displayProducts para incluir filtros
function displayProducts(products) {
    // Crear filtros si no existen
    if (currentView !== 'categories') {
        createSearchFilters();
    }
    
    productsContainer.innerHTML = '';
    
    if (products && products.length > 0) {
        resultsTitle.classList.remove('hidden');
        noResults.classList.add('hidden');
        
        // Usar grid más compacto
        productsContainer.className = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4';
        
        products.forEach(product => {
            const productCard = createProductCard(product);
            productsContainer.appendChild(productCard);
        });
    } else {
        noResults.classList.remove('hidden');
        resultsTitle.classList.add('hidden');
    }
}

/**
 * Función para abrir el modal de detalles del producto (ACTUALIZADA)
 * @param {Object} product - Datos del producto seleccionado
 */
function openProductDetailsModal(product) {
    // Guardar producto actual
    currentProduct = product;
    
    // Generar datos profesionales
    const productData = generateProfessionalProductData(product);
    
    // Generar múltiples imágenes para el producto
    const additionalImages = generateProductImages(product);
    
    // Crear modal si no existe
    if (!document.getElementById('productDetailsModal')) {
        const modalHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50" id="productDetailsModal">
                <div class="bg-white rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[95vh] overflow-y-auto">
                    <div class="p-6 border-b border-gray-200">
                        <div class="flex items-center justify-between">
                            <h3 class="text-2xl font-bold text-gray-800">Detalles del Producto</h3>
                            <button class="text-gray-500 hover:text-gray-700 transition-colors" onclick="closeProductDetailsModal()">
                                <i class="ri-close-line text-2xl"></i>
                            </button>
                        </div>
                    </div>
                    <div class="p-6" id="product-details-content">
                        <!-- Contenido dinámico -->
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    // Actualizar contenido del modal
    document.getElementById('product-details-content').innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Galería de imágenes -->
            <div class="space-y-4">
                <!-- Imagen principal -->
                <div class="relative">
                    <img id="main-product-image" src="${product.image}" alt="${product.name}" 
                         class="w-full h-96 object-cover rounded-xl shadow-lg">
                    <div class="absolute top-4 left-4">
                        ${productData.discount > 0 ? `<span class="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">-${productData.discount}%</span>` : ''}
                    </div>
                </div>
                
                <!-- Galería de imágenes adicionales -->
                <div class="grid grid-cols-4 gap-2">
                    <img src="${product.image}" alt="${product.name}" 
                         class="w-full h-20 object-cover rounded-lg cursor-pointer border-2 border-primary-500 thumbnail-image" 
                         onclick="changeMainImage('${product.image}')">
                    ${additionalImages.map((img, index) => `
                        <img src="${img}" alt="${product.name} - Vista ${index + 2}" 
                             class="w-full h-20 object-cover rounded-lg cursor-pointer border-2 border-gray-200 hover:border-primary-500 transition-colors thumbnail-image" 
                             onclick="changeMainImage('${img}')">
                    `).join('')}
                </div>
            </div>
            
            <!-- Información del producto -->
            <div class="space-y-6">
                <!-- Título y rating -->
                <div>
                    <h1 class="text-3xl font-bold text-gray-800 mb-2">${product.name}</h1>
                    <div class="flex items-center space-x-4 mb-4">
                        <div class="flex items-center text-yellow-400">
                            ${generateStarRating(productData.rating)}
                        </div>
                        <span class="text-gray-600">${productData.rating}/5 (${productData.reviewCount} reseñas)</span>
                        <span class="text-sm text-gray-500">• ${productData.storeCount} tiendas</span>
                    </div>
                </div>
                
                <!-- Precios -->
                <div class="bg-gray-50 rounded-xl p-6">
                    <div class="flex items-center space-x-4 mb-4">
                        <span class="text-3xl font-bold text-primary-600">${product.price_with_profit ? product.price_with_profit.toFixed(2) : 'N/A'} €</span>
                        ${product.original_price ? `<span class="text-xl text-gray-500 line-through">${product.original_price}</span>` : ''}
                    </div>
                    <div class="flex items-center space-x-2 text-green-600 mb-4">
                        <i class="ri-shield-check-line"></i>
                        <span class="font-medium">Garantía de mejor precio</span>
                    </div>
                    <p class="text-sm text-gray-600">Ahorro: ${calculateSavings(product)}</p>
                </div>
                
                <!-- Descripción -->
                <div>
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">Descripción</h3>
                    <p class="text-gray-600 leading-relaxed">${productData.description}</p>
                </div>
                
                <!-- Características -->
                <div>
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">Características principales</h3>
                    <ul class="space-y-2">
                        ${productData.features.map(feature => `
                            <li class="flex items-center text-gray-600">
                                <i class="ri-check-line text-green-500 mr-2"></i>
                                ${feature}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <!-- Colores disponibles -->
                <div>
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">Colores disponibles</h3>
                    <div class="flex space-x-3">
                        ${productData.colors.map(color => `
                            <div class="flex flex-col items-center space-y-1">
                                <div class="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer hover:border-primary-500 transition-colors" 
                                     style="background-color: ${color.hex}" title="${color.name}"></div>
                                <span class="text-xs text-gray-600">${color.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Disponibilidad -->
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div class="flex items-center space-x-2">
                        <i class="ri-check-circle-line text-green-500"></i>
                        <span class="text-green-800 font-medium">En stock - Envío inmediato</span>
                    </div>
                </div>
                
                <!-- Botones de acción -->
                <div class="space-y-3">
                    <button onclick="buyNowAndGoToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})" 
                            class="w-full bg-primary-500 hover:bg-primary-600 text-white py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center space-x-2">
                        <i class="ri-shopping-bag-line"></i>
                        <span>Comprar ahora</span>
                    </button>
                    <div class="grid grid-cols-2 gap-3">
                        <button onclick="addToCartFromModal(${JSON.stringify(product).replace(/"/g, '&quot;')})" 
                                class="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2">
                            <i class="ri-shopping-cart-line"></i>
                            <span>Añadir al carrito</span>
                        </button>
                        <button onclick="toggleFavoriteFromModal(${product.id || Math.random()}, ${JSON.stringify(product).replace(/"/g, '&quot;')})" 
                                class="bg-red-50 hover:bg-red-100 text-red-600 py-3 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2">
                            <i class="ri-heart-line"></i>
                            <span>Favoritos</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Comparativa de precios -->
        <div class="mt-8 border-t border-gray-200 pt-8">
            <h3 class="text-xl font-semibold text-gray-800 mb-6">Comparativa de precios</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                ${productData.priceComparison.map((store, index) => `
                    <div class="border border-gray-200 rounded-lg p-4 ${index === 0 ? 'border-primary-500 bg-primary-50' : ''}">
                        <div class="flex items-center justify-between mb-2">
                            <span class="font-medium text-gray-800">${store.name}</span>
                            ${index === 0 ? '<span class="text-xs bg-primary-500 text-white px-2 py-1 rounded-full">Mejor precio</span>' : ''}
                        </div>
                        <div class="text-lg font-bold text-gray-800 mb-1">${store.price}</div>
                        <div class="text-sm text-gray-600">
                            <div>Envío: ${store.shipping}</div>
                            <div>Entrega: ${store.delivery}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <!-- Reseñas de clientes -->
        <div class="mt-8 border-t border-gray-200 pt-8">
            <h3 class="text-xl font-semibold text-gray-800 mb-6">Reseñas de clientes</h3>
            
            <!-- Distribución de estrellas -->
            <div class="bg-gray-50 rounded-xl p-6 mb-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="text-center">
                        <div class="text-4xl font-bold text-gray-800 mb-2">${productData.rating}</div>
                        <div class="flex items-center justify-center text-yellow-400 mb-2">
                            ${generateStarRating(productData.rating)}
                        </div>
                        <div class="text-gray-600">${productData.reviewCount} reseñas</div>
                    </div>
                    <div class="space-y-2">
                        ${Object.entries(productData.ratingDistribution).reverse().map(([stars, percentage]) => `
                            <div class="flex items-center space-x-3">
                                <span class="text-sm text-gray-600 w-8">${stars}★</span>
                                <div class="flex-1 bg-gray-200 rounded-full h-2">
                                    <div class="bg-yellow-400 h-2 rounded-full" style="width: ${percentage}%"></div>
                                </div>
                                <span class="text-sm text-gray-600 w-8">${percentage}%</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <!-- Reseñas individuales -->
            <div class="space-y-6">
                ${productData.reviews.map(review => `
                    <div class="border border-gray-200 rounded-lg p-6">
                        <div class="flex items-start space-x-4">
                            <div class="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                                ${review.initials}
                            </div>
                            <div class="flex-1">
                                <div class="flex items-center space-x-3 mb-2">
                                    <span class="font-semibold text-gray-800">${review.name}</span>
                                    <div class="flex text-yellow-400">
                                        ${generateStarRating(review.rating)}
                                    </div>
                                    <span class="text-sm text-gray-500">${review.date}</span>
                                </div>
                                <h4 class="font-medium text-gray-800 mb-2">${review.title}</h4>
                                <p class="text-gray-600">${review.content}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Mostrar el modal
    document.getElementById('productDetailsModal').classList.remove('hidden');
    document.getElementById('productDetailsModal').classList.add('flex');
}

/**
 * Generar datos profesionales para el producto
 * @param {Object} product - Datos del producto
 * @returns {Object} - Datos profesionales generados
 */
function generateProfessionalProductData(product) {
    // Generar rating realista
    const rating = 4.2 + Math.random() * 0.6; // Entre 4.2 y 4.8
    const reviewCount = Math.floor(Math.random() * 2000) + 500; // Entre 500 y 2500
    
    // Calcular descuento
    let discount = 0;
    if (product.original_price && product.price_with_profit) {
        const originalValue = parseFloat(product.original_price.replace(/[^0-9,.]/g, '').replace(',', '.'));
        if (!isNaN(originalValue) && originalValue > product.price_with_profit) {
            discount = Math.round(((originalValue - product.price_with_profit) / originalValue) * 100);
        }
    }
    
    // Generar descripciones y características específicas por producto
    const productData = {
        'iPhone': {
            description: 'El iPhone más avanzado con chip A17 Pro y cámara de 48MP. Disfruta de una experiencia fotográfica profesional, rendimiento excepcional y diseño premium en titanio. Compatible con todas las funciones de iOS más recientes.',
            features: [
                'Chip A17 Pro con GPU de 6 núcleos',
                'Cámara principal de 48MP con zoom óptico 3x',
                'Pantalla Super Retina XDR de 6.7 pulgadas',
                'Batería de hasta 29 horas de reproducción de video',
                'Resistencia al agua IP68'
            ],
            colors: [
                { name: 'Titanio Natural', hex: '#F5F5DC' },
                { name: 'Titanio Azul', hex: '#4169E1' },
                { name: 'Titanio Blanco', hex: '#FFFFFF' },
                { name: 'Titanio Negro', hex: '#2F2F2F' }
            ]
        },
        'Samsung': {
            description: 'El Samsung Galaxy S24 Ultra redefine la fotografía móvil con su cámara de 200MP y funciones de IA avanzadas. Incluye S Pen integrado y pantalla Dynamic AMOLED 2X de 6.8 pulgadas para una experiencia visual incomparable.',
            features: [
                'Cámara principal de 200MP con zoom espacial 100x',
                'S Pen integrado con funciones de IA',
                'Pantalla Dynamic AMOLED 2X de 6.8 pulgadas',
                'Procesador Snapdragon 8 Gen 3',
                'Batería de 5000mAh con carga rápida 45W'
            ],
            colors: [
                { name: 'Titanio Gris', hex: '#708090' },
                { name: 'Titanio Violeta', hex: '#8A2BE2' },
                { name: 'Titanio Amarillo', hex: '#FFD700' },
                { name: 'Titanio Negro', hex: '#2F2F2F' }
            ]
        },
        'Sony': {
            description: 'Los auriculares Sony WH-1000XM5 ofrecen una calidad de sonido premium con la mejor cancelación de ruido de su clase. Disfruta de hasta 30 horas de batería y funciones inteligentes como pausa automática al quitártelos.',
            features: [
                'Cancelación de ruido líder en la industria',
                'Hasta 30 horas de batería',
                'Carga rápida: 5 horas con solo 10 minutos',
                'Conexión multipunto con 2 dispositivos',
                'Controles táctiles intuitivos'
            ],
            colors: [
                { name: 'Negro', hex: '#000000' },
                { name: 'Plata', hex: '#C0C0C0' },
                { name: 'Azul Medianoche', hex: '#191970' }
            ]
        },
        'MacBook': {
            description: 'El MacBook Air M3 combina potencia y portabilidad en un diseño ultradelgado. Con hasta 18 horas de batería y rendimiento excepcional, es perfecto para profesionales creativos y estudiantes exigentes.',
            features: [
                'Chip M3 con CPU de 8 núcleos y GPU de 10 núcleos',
                'Pantalla Liquid Retina de 13.6 pulgadas',
                'Hasta 18 horas de batería',
                'Carga rápida MagSafe',
                'Cámara FaceTime HD 1080p'
            ],
            colors: [
                { name: 'Gris Espacial', hex: '#5C5C5C' },
                { name: 'Plata', hex: '#E8E8E8' },
                { name: 'Oro', hex: '#F4E4BC' },
                { name: 'Azul Medianoche', hex: '#1E3A5F' }
            ]
        }
    };
    
    // Buscar datos específicos del producto
    let specificData = null;
    for (const [key, data] of Object.entries(productData)) {
        if (product.name.toLowerCase().includes(key.toLowerCase())) {
            specificData = data;
            break;
        }
    }
    
    // Datos por defecto si no se encuentra coincidencia
    if (!specificData) {
        specificData = {
            description: 'Producto de alta calidad con características premium y tecnología avanzada. Diseñado para ofrecer la mejor experiencia de usuario con materiales de primera calidad y funcionalidades innovadoras.',
            features: [
                'Tecnología de última generación',
                'Diseño premium y elegante',
                'Garantía oficial del fabricante',
                'Compatibilidad universal',
                'Fácil instalación y uso'
            ],
            colors: [
                { name: 'Negro', hex: '#000000' },
                { name: 'Blanco', hex: '#FFFFFF' },
                { name: 'Gris', hex: '#808080' }
            ]
        };
    }
    
    // Generar comparativa de precios
    const basePrice = product.price_with_profit;
    const priceComparison = [
        {
            name: product.source || 'Amazon',
            price: `${basePrice.toFixed(2)}€`,
            shipping: 'Gratis',
            delivery: '1-2 días'
        },
        {
            name: 'MediaMarkt',
            price: `${(basePrice + 10).toFixed(2)}€`,
            shipping: 'Gratis',
            delivery: '2-3 días'
        },
        {
            name: 'El Corte Inglés',
            price: `${(basePrice + 20).toFixed(2)}€`,
            shipping: 'Gratis',
            delivery: '1-3 días'
        },
        {
            name: 'eBay',
            price: `${(basePrice + 5).toFixed(2)}€`,
            shipping: '4,99€',
            delivery: '3-5 días'
        }
    ];
    
    // Generar distribución de ratings
    const ratingDistribution = {
        5: 76,
        4: 18,
        3: 4,
        2: 1,
        1: 1
    };
    
    // Generar reseñas de ejemplo
    const reviews = [
        {
            initials: 'MR',
            name: 'Miguel Rodríguez',
            date: 'Hace 2 semanas',
            rating: 5,
            title: 'Increíble calidad de sonido y cancelación de ruido',
            content: 'Después de probar varios modelos, este producto es sin duda el mejor. La calidad es excepcional y supera todas mis expectativas. La relación calidad-precio es excelente y lo recomiendo totalmente.'
        },
        {
            initials: 'LF',
            name: 'Laura Fernández',
            date: 'Hace 1 mes',
            rating: 4,
            title: 'Excelente, pero un poco caro',
            content: 'Es un producto fantástico en todos los aspectos. La calidad es superior a cualquier otro que haya probado antes. Mi única queja es que es un poco caro, aunque con las ofertas que encontré aquí, valió la pena la inversión.'
        },
        {
            initials: 'JG',
            name: 'Javier García',
            date: 'Hace 2 meses',
            rating: 5,
            title: 'Los mejores que he tenido',
            content: 'Después de usar otros productos durante años, decidí probar este y no me arrepiento. Es notablemente mejor, con características más avanzadas y un rendimiento superior. Totalmente recomendado.'
        }
    ];
    
    return {
        rating: Math.round(rating * 10) / 10,
        reviewCount,
        discount,
        storeCount: 8,
        description: specificData.description,
        features: specificData.features,
        colors: specificData.colors,
        priceComparison,
        ratingDistribution,
        reviews
    };
}

/**
 * Función para cerrar el modal de detalles
 */
function closeProductDetailsModal() {
    const modal = document.getElementById('productDetailsModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

/**
 * Calcula el ahorro entre el precio original y el precio con ganancia
 * @param {Object} product - Datos del producto
 * @returns {string} - Texto con el ahorro formateado
 */
function calculateSavings(product) {
    if (product.original_price && product.price_with_profit) {
        try {
            let originalValue;
            if (typeof product.original_price === 'string') {
                const cleanPrice = product.original_price.replace(/[^0-9,.]/g, '');
                originalValue = parseFloat(cleanPrice.replace(',', '.'));
            } else {
                originalValue = parseFloat(product.original_price);
            }
            
            if (!isNaN(originalValue) && originalValue > product.price_with_profit) {
                const savings = originalValue - product.price_with_profit;
                return `${savings.toFixed(2)} € (${Math.round((savings/originalValue)*100)}%)`;
            }
        } catch (e) {
            console.error('Error al calcular ahorro:', e);
        }
    }
    return 'No calculable';
}

/**
 * Función para abrir el modal de compra
 * @param {Object} product - Datos del producto seleccionado
 */
function openOrderModal(product) {
    currentProduct = product;
    
    // Actualizar detalles del producto en el modal
    document.getElementById('modal-product-details').innerHTML = `
        <div class="flex items-center space-x-4">
            <img src="${product.image || 'https://via.placeholder.com/100'}" alt="${product.name}" class="w-20 h-20 object-cover rounded-lg">
            <div class="flex-1">
                <h6 class="font-semibold text-gray-800">${product.name}</h6>
                <p class="text-gray-600 text-sm">${product.description || 'Sin descripción'}</p>
                <div class="mt-2 space-y-1">
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="ri-truck-line mr-2 text-green-500"></i>
                        <span>${product.shipping || 'Envío estándar'}</span>
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="ri-time-line mr-2 text-blue-500"></i>
                        <span>${product.delivery_time || '7-14 días estimados'}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Actualizar resumen de compra
    document.getElementById('summary-product-name').textContent = product.name;
    document.getElementById('summary-product-price').textContent = product.price_with_profit ? 
        `${product.price_with_profit.toFixed(2)} €` : 'Precio no disponible';
    document.getElementById('summary-product-source').textContent = product.source || 'Tienda desconocida';
    document.getElementById('summary-total').textContent = product.price_with_profit ? 
        `${product.price_with_profit.toFixed(2)} €` : 'Precio no disponible';
    
    // Mostrar el modal
    orderModal.classList.remove('hidden');
    orderModal.classList.add('flex');
}

/**
 * Función para guardar el pedido y procesar el pago
 */
async function saveOrder() {
    // Validar formulario
    const form = document.getElementById('order-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Mostrar indicador de carga
    const completeOrderBtn = document.getElementById('complete-order-btn');
    const originalBtnText = completeOrderBtn.innerHTML;
    completeOrderBtn.innerHTML = '<div class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Procesando...';
    completeOrderBtn.disabled = true;
    
    // Recopilar datos del formulario
    const orderData = {
        product: currentProduct,
        customer: {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            postalCode: document.getElementById('postal-code').value
        }
    };
    
    try {
        const response = await fetch('/save-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Cerrar el modal
            orderModal.classList.add('hidden');
            orderModal.classList.remove('flex');
            
            // Mostrar modal de confirmación
            showOrderConfirmation(data, orderData);
            
            // Limpiar formulario
            form.reset();
        } else {
            console.error('Error:', data.error);
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    } finally {
        // Restaurar botón
        completeOrderBtn.innerHTML = originalBtnText;
        completeOrderBtn.disabled = false;
    }
}

/**
 * Muestra el modal de confirmación de pedido
 * @param {Object} responseData - Datos de respuesta del servidor
 * @param {Object} orderData - Datos del pedido enviado
 */
function showOrderConfirmation(responseData, orderData) {
    // Crear modal de confirmación si no existe
    if (!document.getElementById('orderConfirmationModal')) {
        const modalHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50" id="orderConfirmationModal">
                <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4">
                    <div class="p-6 border-b border-gray-200 bg-green-500 text-white rounded-t-2xl">
                        <h3 class="text-2xl font-bold flex items-center">
                            <i class="ri-check-circle-line mr-3 text-3xl"></i>
                            ¡Pedido Confirmado!
                        </h3>
                    </div>
                    <div class="p-6" id="order-confirmation-content">
                        <!-- Contenido dinámico -->
                    </div>
                    <div class="p-6 border-t border-gray-200 text-center">
                        <button class="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors" onclick="closeOrderConfirmation()">
                            Aceptar
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    // Actualizar contenido del modal
    document.getElementById('order-confirmation-content').innerHTML = `
        <div class="text-center mb-6">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="ri-shopping-bag-line text-4xl text-green-500"></i>
            </div>
            <h4 class="text-2xl font-bold text-gray-800 mb-2">¡Gracias por tu compra!</h4>
            <p class="text-gray-600">Tu pedido ha sido procesado correctamente</p>
        </div>
        
        <div class="bg-gray-50 rounded-xl p-6 mb-6">
            <h5 class="font-semibold text-gray-800 mb-4">Detalles del pedido</h5>
            <div class="space-y-3">
                <div class="flex justify-between">
                    <span class="text-gray-600">Número de pedido:</span>
                    <span class="font-medium">${responseData.order_id}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Producto:</span>
                    <span class="font-medium">${orderData.product.name}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Precio:</span>
                    <span class="font-medium">${orderData.product.price_with_profit.toFixed(2)} €</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Tienda:</span>
                    <span class="font-medium">${orderData.product.source || 'Desconocida'}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Entrega estimada:</span>
                    <span class="font-medium">${responseData.estimated_delivery}</span>
                </div>
            </div>
        </div>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start space-x-3">
                <i class="ri-information-line text-blue-500 text-xl mt-0.5"></i>
                <p class="text-blue-800 text-sm">
                    Recibirás un correo electrónico con los detalles de tu pedido y el seguimiento de envío.
                </p>
            </div>
        </div>
    `;
    
    // Mostrar el modal
    document.getElementById('orderConfirmationModal').classList.remove('hidden');
    document.getElementById('orderConfirmationModal').classList.add('flex');
}

/**
 * Función para cerrar el modal de confirmación
 */
function closeOrderConfirmation() {
    const modal = document.getElementById('orderConfirmationModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

/**
 * Abrir modal "Cómo funciona"
 */
function openHowItWorksModal() {
    const modal = document.getElementById('howItWorksModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

/**
 * Cerrar modal "Cómo funciona"
 */
function closeHowItWorksModal() {
    const modal = document.getElementById('howItWorksModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

/**
 * Reproducir video explicativo (simulado)
 */
function playExplanationVideo() {
    // Aquí podrías integrar un video real
    alert('¡Video explicativo próximamente! Por ahora, explora las características de Ofertix.');
}

// Función para generar imágenes adicionales del producto
function generateProductImages(product) {
    const baseImages = [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400'
    ];
    
    // Generar imágenes específicas según el tipo de producto
    if (product.name.toLowerCase().includes('iphone')) {
        return [
            'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
            'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400',
            'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400'
        ];
    } else if (product.name.toLowerCase().includes('samsung')) {
        return [
            'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
            'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400'
        ];
    } else if (product.name.toLowerCase().includes('macbook')) {
        return [
            'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'
        ];
    } else if (product.name.toLowerCase().includes('sony')) {
        return [
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400',
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
        ];
    }
    
    return baseImages;
}

// Función para cambiar la imagen principal
function changeMainImage(imageSrc) {
    const mainImage = document.getElementById('main-product-image');
    if (mainImage) {
        mainImage.src = imageSrc;
        
        // Actualizar bordes de las miniaturas
        document.querySelectorAll('.thumbnail-image').forEach(img => {
            img.classList.remove('border-primary-500');
            img.classList.add('border-gray-200');
        });
        
        // Marcar la imagen seleccionada
        const selectedThumbnail = document.querySelector(`img[src="${imageSrc}"].thumbnail-image`);
        if (selectedThumbnail) {
            selectedThumbnail.classList.remove('border-gray-200');
            selectedThumbnail.classList.add('border-primary-500');
        }
    }
}

// Función para comprar ahora y ir al carrito
function buyNowAndGoToCart(product) {
    // Agregar al carrito
    cart.addItem(product);
    
    // Cerrar modal de detalles
    closeProductDetailsModal();
    
    // Abrir carrito después de un breve delay
    setTimeout(() => {
        cart.showCart();
    }, 300);
}

// Función para agregar al carrito desde el modal
function addToCartFromModal(product) {
    cart.addItem(product);
}

// Función para toggle de favoritos desde el modal
function toggleFavoriteFromModal(productId, product) {
    toggleFavorite(productId, product);
    
    // Actualizar el botón de favoritos
    const favoriteBtn = event.target.closest('button');
    if (favoritesManager.isFavorite(productId)) {
        favoriteBtn.innerHTML = '<i class="ri-heart-fill"></i><span>En favoritos</span>';
        favoriteBtn.classList.remove('bg-red-50', 'hover:bg-red-100', 'text-red-600');
        favoriteBtn.classList.add('bg-red-500', 'hover:bg-red-600', 'text-white');
    } else {
        favoriteBtn.innerHTML = '<i class="ri-heart-line"></i><span>Favoritos</span>';
        favoriteBtn.classList.remove('bg-red-500', 'hover:bg-red-600', 'text-white');
        favoriteBtn.classList.add('bg-red-50', 'hover:bg-red-100', 'text-red-600');
    }
}

// Función global para cerrar modales al hacer clic fuera
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('fixed') && e.target.classList.contains('inset-0')) {
        // Cerrar modal de detalles
        if (e.target.id === 'productDetailsModal') {
            closeProductDetailsModal();
        }
        // Cerrar modal de confirmación
        if (e.target.id === 'orderConfirmationModal') {
            closeOrderConfirmation();
        }
        // Cerrar modal de pedido
        if (e.target.id === 'orderModal') {
            orderModal.classList.add('hidden');
            orderModal.classList.remove('flex');
        }
        // Cerrar modal "Cómo funciona"
        if (e.target.id === 'howItWorksModal') {
            closeHowItWorksModal();
        }
    }
});

/**
 * Crear barra de filtros
 */
function createSearchFilters() {
    const filtersHTML = `
        <div class="bg-white border border-gray-200 rounded-xl p-6 mb-6" id="search-filters">
            <div class="flex flex-wrap items-center gap-4">
                <div class="flex items-center space-x-2">
                    <i class="ri-filter-line text-primary-500"></i>
                    <span class="font-medium text-gray-700">Filtros:</span>
                </div>
                
                <!-- Filtro por categoría -->
                <select id="category-filter" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option value="">Todas las categorías</option>
                    <option value="Electrónicos">Electrónicos</option>
                    <option value="Computadoras">Computadoras</option>
                    <option value="Audio">Audio</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Tablets">Tablets</option>
                    <option value="Hogar">Hogar</option>
                </select>
                
                <!-- Filtro por precio -->
                <select id="price-filter" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option value="">Cualquier precio</option>
                    <option value="0-100">Menos de 100€</option>
                    <option value="100-300">100€ - 300€</option>
                    <option value="300-500">300€ - 500€</option>
                    <option value="500-1000">500€ - 1000€</option>
                    <option value="1000+">Más de 1000€</option>
                </select>
                
                <!-- Filtro por tienda -->
                <select id="store-filter" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option value="">Todas las tiendas</option>
                    <option value="Amazon">Amazon</option>
                    <option value="eBay">eBay</option>
                    <option value="AliExpress">AliExpress</option>
                </select>
                
                <!-- Filtro por envío -->
                <select id="shipping-filter" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option value="">Cualquier envío</option>
                    <option value="gratis">Envío gratis</option>
                    <option value="rapido">Envío rápido (1-2 días)</option>
                </select>
                
                <!-- Ordenar por -->
                <select id="sort-filter" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option value="relevance">Más relevante</option>
                    <option value="price-low">Precio: menor a mayor</option>
                    <option value="price-high">Precio: mayor a menor</option>
                    <option value="discount">Mayor descuento</option>
                </select>
                
                <!-- Botón limpiar filtros -->
                <button id="clear-filters" class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                    <i class="ri-close-line mr-1"></i>
                    Limpiar
                </button>
            </div>
        </div>
    `;
    
    const resultsSection = document.querySelector('.py-16.bg-gray-50 .container');
    const resultsTitle = document.getElementById('results-title');
    
    // Insertar filtros después del título
    if (!document.getElementById('search-filters')) {
        resultsTitle.insertAdjacentHTML('afterend', filtersHTML);
        setupFilterEvents();
    }
}

/**
 * Configurar eventos de filtros
 */
function setupFilterEvents() {
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const storeFilter = document.getElementById('store-filter');
    const shippingFilter = document.getElementById('shipping-filter');
    const sortFilter = document.getElementById('sort-filter');
    const clearFilters = document.getElementById('clear-filters');
    
    [categoryFilter, priceFilter, storeFilter, shippingFilter, sortFilter].forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
    
    clearFilters.addEventListener('click', () => {
        [categoryFilter, priceFilter, storeFilter, shippingFilter, sortFilter].forEach(filter => {
            filter.value = '';
        });
        applyFilters();
    });
}

/**
 * Aplicar filtros a los productos
 */
function applyFilters() {
    let filteredProducts = [...featuredProducts];
    
    const categoryFilter = document.getElementById('category-filter')?.value;
    const priceFilter = document.getElementById('price-filter')?.value;
    const storeFilter = document.getElementById('store-filter')?.value;
    const shippingFilter = document.getElementById('shipping-filter')?.value;
    const sortFilter = document.getElementById('sort-filter')?.value;
    
    // Filtrar por categoría
    if (categoryFilter) {
        filteredProducts = filteredProducts.filter(product => product.category === categoryFilter);
    }
    
    // Filtrar por precio
    if (priceFilter) {
        const [min, max] = priceFilter.split('-').map(p => p.replace('+', ''));
        filteredProducts = filteredProducts.filter(product => {
            const price = product.price_with_profit;
            if (max) {
                return price >= parseInt(min) && price <= parseInt(max);
            } else {
                return price >= parseInt(min);
            }
        });
    }
    
    // Filtrar por tienda
    if (storeFilter) {
        filteredProducts = filteredProducts.filter(product => product.source === storeFilter);
    }
    
    // Filtrar por envío
    if (shippingFilter === 'gratis') {
        filteredProducts = filteredProducts.filter(product => product.shipping.toLowerCase().includes('gratis'));
    } else if (shippingFilter === 'rapido') {
        filteredProducts = filteredProducts.filter(product => product.delivery_time.includes('1-2'));
    }
    
    // Ordenar productos
    if (sortFilter === 'price-low') {
        filteredProducts.sort((a, b) => a.price_with_profit - b.price_with_profit);
    } else if (sortFilter === 'price-high') {
        filteredProducts.sort((a, b) => b.price_with_profit - a.price_with_profit);
    } else if (sortFilter === 'discount') {
        filteredProducts.sort((a, b) => {
            const discountA = calculateSavings(a.original_price, a.price_with_profit).percentage;
            const discountB = calculateSavings(b.original_price, b.price_with_profit).percentage;
            return discountB - discountA;
        });
    }
    
    displayProducts(filteredProducts);
}

/**
 * Función para abrir el modal de compra
 * @param {Object} product - Datos del producto seleccionado
 */
function openOrderModal(product) {
    currentProduct = product;
    
    // Actualizar detalles del producto en el modal
    document.getElementById('modal-product-details').innerHTML = `
        <div class="flex items-center space-x-4">
            <img src="${product.image || 'https://via.placeholder.com/100'}" alt="${product.name}" class="w-20 h-20 object-cover rounded-lg">
            <div class="flex-1">
                <h6 class="font-semibold text-gray-800">${product.name}</h6>
                <p class="text-gray-600 text-sm">${product.description || 'Sin descripción'}</p>
                <div class="mt-2 space-y-1">
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="ri-truck-line mr-2 text-green-500"></i>
                        <span>${product.shipping || 'Envío estándar'}</span>
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="ri-time-line mr-2 text-blue-500"></i>
                        <span>${product.delivery_time || '7-14 días estimados'}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Actualizar resumen de compra
    document.getElementById('summary-product-name').textContent = product.name;
    document.getElementById('summary-product-price').textContent = product.price_with_profit ? 
        `${product.price_with_profit.toFixed(2)} €` : 'Precio no disponible';
    document.getElementById('summary-product-source').textContent = product.source || 'Tienda desconocida';
    document.getElementById('summary-total').textContent = product.price_with_profit ? 
        `${product.price_with_profit.toFixed(2)} €` : 'Precio no disponible';
    
    // Mostrar el modal
    orderModal.classList.remove('hidden');
    orderModal.classList.add('flex');
}

/**
 * Función para guardar el pedido y procesar el pago
 */
async function saveOrder() {
    // Validar formulario
    const form = document.getElementById('order-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Mostrar indicador de carga
    const completeOrderBtn = document.getElementById('complete-order-btn');
    const originalBtnText = completeOrderBtn.innerHTML;
    completeOrderBtn.innerHTML = '<div class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Procesando...';
    completeOrderBtn.disabled = true;
    
    // Recopilar datos del formulario
    const orderData = {
        product: currentProduct,
        customer: {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            postalCode: document.getElementById('postal-code').value
        }
    };
    
    try {
        const response = await fetch('/save-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Cerrar el modal
            orderModal.classList.add('hidden');
            orderModal.classList.remove('flex');
            
            // Mostrar modal de confirmación
            showOrderConfirmation(data, orderData);
            
            // Limpiar formulario
            form.reset();
        } else {
            console.error('Error:', data.error);
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    } finally {
        // Restaurar botón
        completeOrderBtn.innerHTML = originalBtnText;
        completeOrderBtn.disabled = false;
    }
}

/**
 * Muestra el modal de confirmación de pedido
 * @param {Object} responseData - Datos de respuesta del servidor
 * @param {Object} orderData - Datos del pedido enviado
 */
function showOrderConfirmation(responseData, orderData) {
    // Crear modal de confirmación si no existe
    if (!document.getElementById('orderConfirmationModal')) {
        const modalHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50" id="orderConfirmationModal">
                <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4">
                    <div class="p-6 border-b border-gray-200 bg-green-500 text-white rounded-t-2xl">
                        <h3 class="text-2xl font-bold flex items-center">
                            <i class="ri-check-circle-line mr-3 text-3xl"></i>
                            ¡Pedido Confirmado!
                        </h3>
                    </div>
                    <div class="p-6" id="order-confirmation-content">
                        <!-- Contenido dinámico -->
                    </div>
                    <div class="p-6 border-t border-gray-200 text-center">
                        <button class="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors" onclick="closeOrderConfirmation()">
                            Aceptar
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    // Actualizar contenido del modal
    document.getElementById('order-confirmation-content').innerHTML = `
        <div class="text-center mb-6">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="ri-shopping-bag-line text-4xl text-green-500"></i>
            </div>
            <h4 class="text-2xl font-bold text-gray-800 mb-2">¡Gracias por tu compra!</h4>
            <p class="text-gray-600">Tu pedido ha sido procesado correctamente</p>
        </div>
        
        <div class="bg-gray-50 rounded-xl p-6 mb-6">
            <h5 class="font-semibold text-gray-800 mb-4">Detalles del pedido</h5>
            <div class="space-y-3">
                <div class="flex justify-between">
                    <span class="text-gray-600">Número de pedido:</span>
                    <span class="font-medium">${responseData.order_id}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Producto:</span>
                    <span class="font-medium">${orderData.product.name}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Precio:</span>
                    <span class="font-medium">${orderData.product.price_with_profit.toFixed(2)} €</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Tienda:</span>
                    <span class="font-medium">${orderData.product.source || 'Desconocida'}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Entrega estimada:</span>
                    <span class="font-medium">${responseData.estimated_delivery}</span>
                </div>
            </div>
        </div>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start space-x-3">
                <i class="ri-information-line text-blue-500 text-xl mt-0.5"></i>
                <p class="text-blue-800 text-sm">
                    Recibirás un correo electrónico con los detalles de tu pedido y el seguimiento de envío.
                </p>
            </div>
        </div>
    `;
    
    // Mostrar el modal
    document.getElementById('orderConfirmationModal').classList.remove('hidden');
    document.getElementById('orderConfirmationModal').classList.add('flex');
}

/**
 * Función para cerrar el modal de confirmación
 */
function closeOrderConfirmation() {
    const modal = document.getElementById('orderConfirmationModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Sistema de Favoritos
class FavoritesManager {
    constructor() {
        this.favorites = JSON.parse(localStorage.getItem('ofertix_favorites')) || [];
        this.init();
    }

    init() {
        this.createFavoritesModal();
        this.updateFavoritesCounter();
    }

    addToFavorites(product) {
        const existingIndex = this.favorites.findIndex(fav => fav.id === product.id);
        
        if (existingIndex === -1) {
            this.favorites.push({
                ...product,
                dateAdded: new Date().toISOString()
            });
            this.saveFavorites();
            this.showNotification('❤️ Producto agregado a favoritos', 'success');
        } else {
            this.showNotification('ℹ️ El producto ya está en favoritos', 'info');
        }
        
        this.updateFavoritesCounter();
        this.updateHeartButtons();
    }

    removeFromFavorites(productId) {
        this.favorites = this.favorites.filter(fav => fav.id !== productId);
        this.saveFavorites();
        this.updateFavoritesCounter();
        this.updateHeartButtons();
        this.showNotification('💔 Producto eliminado de favoritos', 'info');
    }

    isFavorite(productId) {
        return this.favorites.some(fav => fav.id === productId);
    }

    saveFavorites() {
        localStorage.setItem('ofertix_favorites', JSON.stringify(this.favorites));
    }

    updateFavoritesCounter() {
        const counter = document.querySelector('.favorites-counter');
        if (counter) {
            counter.textContent = this.favorites.length;
            counter.style.display = this.favorites.length > 0 ? 'block' : 'none';
        }
    }

    updateHeartButtons() {
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            const productId = parseInt(btn.dataset.productId);
            const heartIcon = btn.querySelector('i');
            
            if (this.isFavorite(productId)) {
                heartIcon.className = 'ri-heart-fill text-red-500';
                btn.classList.add('favorited');
            } else {
                heartIcon.className = 'ri-heart-line text-gray-600';
                btn.classList.remove('favorited');
            }
        });
    }

    showFavorites() {
        const modal = document.getElementById('favoritesModal');
        const content = document.getElementById('favorites-content');
        
        if (this.favorites.length === 0) {
            content.innerHTML = `
                <div class="text-center py-12">
                    <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="ri-heart-line text-4xl text-gray-400"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">No tienes favoritos aún</h3>
                    <p class="text-gray-600 mb-6">Explora nuestros productos y agrega los que más te gusten</p>
                    <button onclick="closeFavoritesModal()" class="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors">
                        Explorar productos
                    </button>
                </div>
            `;
        } else {
            content.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${this.favorites.map(product => this.createFavoriteCard(product)).join('')}
                </div>
            `;
        }
        
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    createFavoriteCard(product) {
        const savings = this.calculateSavings(product.original_price, product.price_with_profit);
        
        return `
            <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div class="relative">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
                    <button onclick="favoritesManager.removeFromFavorites(${product.id})" 
                            class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-200">
                        <i class="ri-heart-fill text-sm"></i>
                    </button>
                    ${savings.percentage > 0 ? `<div class="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">-${savings.percentage}%</div>` : ''}
                </div>
                <div class="p-4">
                    <h3 class="font-semibold text-gray-800 mb-2 line-clamp-2">${product.name}</h3>
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-lg font-bold text-primary-600">${product.price_with_profit.toFixed(2)} €</span>
                        ${product.original_price ? `<span class="text-sm text-gray-500 line-through">${product.original_price}</span>` : ''}
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="openProductDetailsModal(${JSON.stringify(product).replace(/"/g, '&quot;')})" 
                                class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition-colors text-sm font-medium">
                            Ver detalles
                        </button>
                        <button onclick="cart.addItem(${JSON.stringify(product).replace(/"/g, '&quot;')})" 
                                class="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg transition-colors text-sm font-medium">
                            Al carrito
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    calculateSavings(originalPrice, currentPrice) {
        if (!originalPrice || !currentPrice) return { amount: 0, percentage: 0 };
        
        let originalValue;
        if (typeof originalPrice === 'string') {
            originalValue = parseFloat(originalPrice.replace(/[^0-9,.]/g, '').replace(',', '.'));
        } else {
            originalValue = parseFloat(originalPrice);
        }
        
        if (isNaN(originalValue) || originalValue <= currentPrice) {
            return { amount: 0, percentage: 0 };
        }
        
        const savings = originalValue - currentPrice;
        const percentage = Math.round((savings / originalValue) * 100);
        
        return { amount: savings.toFixed(2), percentage };
    }

    createFavoritesModal() {
        const modalHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50" id="favoritesModal">
                <div class="bg-white rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div class="p-6 border-b border-gray-200 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-t-2xl">
                        <div class="flex items-center justify-between">
                            <h3 class="text-2xl font-bold flex items-center">
                                <i class="ri-heart-fill mr-3 text-3xl"></i>
                                Mis Favoritos (${this.favorites.length})
                            </h3>
                            <button class="text-white hover:text-gray-200 transition-colors" onclick="closeFavoritesModal()">
                                <i class="ri-close-line text-2xl"></i>
                            </button>
                        </div>
                    </div>
                    <div class="p-6" id="favorites-content">
                        <!-- Contenido dinámico -->
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    showNotification(message, type = 'info') {
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-blue-500',
            warning: 'bg-yellow-500'
        };
        
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-2 hover:text-gray-200">
                    <i class="ri-close-line"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Sistema de Carrito de Compras
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('ofertix_cart')) || [];
        this.init();
    }

    init() {
        this.createCartModal();
        this.updateCartCounter();
    }

    addItem(product, quantity = 1) {
        const existingItemIndex = this.items.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
            this.items[existingItemIndex].quantity += quantity;
        } else {
            this.items.push({
                ...product,
                quantity: quantity,
                dateAdded: new Date().toISOString()
            });
        }
        
        this.saveCart();
        this.updateCartCounter();
        this.showNotification(`🛒 ${product.name} agregado al carrito`, 'success');
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCounter();
        this.showNotification('🗑️ Producto eliminado del carrito', 'info');
    }

    updateQuantity(productId, quantity) {
        const itemIndex = this.items.findIndex(item => item.id === productId);
        if (itemIndex !== -1) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.items[itemIndex].quantity = quantity;
                this.saveCart();
                this.updateCartCounter();
            }
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => {
            return total + (item.price_with_profit * item.quantity);
        }, 0);
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartCounter();
    }

    saveCart() {
        localStorage.setItem('ofertix_cart', JSON.stringify(this.items));
    }

    updateCartCounter() {
        const counter = document.querySelector('.cart-counter');
        if (counter) {
            const count = this.getItemCount();
            counter.textContent = count;
            counter.style.display = count > 0 ? 'block' : 'none';
        }
    }

    showCart() {
        const modal = document.getElementById('cartModal');
        const content = document.getElementById('cart-content');
        
        if (this.items.length === 0) {
            content.innerHTML = `
                <div class="text-center py-12">
                    <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="ri-shopping-cart-line text-4xl text-gray-400"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">Tu carrito está vacío</h3>
                    <p class="text-gray-600 mb-6">Explora nuestros productos y agrega los que desees comprar</p>
                    <button onclick="closeCartModal()" class="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors">
                        Explorar productos
                    </button>
                </div>
            `;
        } else {
            content.innerHTML = `
                <div class="space-y-4">
                    ${this.items.map(item => this.createCartItemCard(item)).join('')}
                </div>
                <div class="border-t border-gray-200 pt-6 mt-6">
                    <div class="flex items-center justify-between mb-4">
                        <span class="text-lg font-semibold text-gray-800">Total:</span>
                        <span class="text-2xl font-bold text-primary-600">${this.getTotal().toFixed(2)} €</span>
                    </div>
                    <div class="flex space-x-4">
                        <button onclick="cart.clearCart(); closeCartModal();" 
                                class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg transition-colors font-medium">
                            Vaciar carrito
                        </button>
                        <button onclick="cart.proceedToCheckout()" 
                                class="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg transition-colors font-medium">
                            Proceder al pago
                        </button>
                    </div>
                </div>
            `;
        }
        
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    createCartItemCard(item) {
        return `
            <div class="bg-gray-50 rounded-xl p-4 flex items-center space-x-4">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg">
                <div class="flex-1">
                    <h4 class="font-semibold text-gray-800 mb-1">${item.name}</h4>
                    <p class="text-sm text-gray-600">${item.source}</p>
                    <div class="flex items-center space-x-2 mt-2">
                        <span class="text-lg font-bold text-primary-600">${item.price_with_profit.toFixed(2)} €</span>
                        <span class="text-sm text-gray-500">x ${item.quantity}</span>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <button onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})" 
                            class="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors">
                        <i class="ri-subtract-line text-sm"></i>
                    </button>
                    <span class="w-8 text-center font-medium">${item.quantity}</span>
                    <button onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})" 
                            class="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors">
                        <i class="ri-add-line text-sm"></i>
                    </button>
                    <button onclick="cart.removeItem(${item.id})" 
                            class="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center transition-colors ml-2">
                        <i class="ri-delete-bin-line text-sm"></i>
                    </button>
                </div>
            </div>
        `;
    }

    proceedToCheckout() {
        closeCartModal();
        checkoutManager.startCheckout([...this.items]);
    }

    createCartModal() {
        const modalHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50" id="cartModal">
                <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div class="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-2xl">
                        <div class="flex items-center justify-between">
                            <h3 class="text-2xl font-bold flex items-center">
                                <i class="ri-shopping-cart-fill mr-3 text-3xl"></i>
                                Mi Carrito (${this.getItemCount()} productos)
                            </h3>
                            <button class="text-white hover:text-gray-200 transition-colors" onclick="closeCartModal()">
                                <i class="ri-close-line text-2xl"></i>
                            </button>
                        </div>
                    </div>
                    <div class="p-6" id="cart-content">
                        <!-- Contenido dinámico -->
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    showNotification(message, type = 'info') {
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-blue-500',
            warning: 'bg-yellow-500'
        };
        
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-2 hover:text-gray-200">
                    <i class="ri-close-line"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Función para generar descripción profesional
function generateProfessionalDescription(product) {
    if (product.description && product.description !== 'Sin descripción disponible') {
        return product.description;
    }
    
    // Generar descripción basada en el nombre y categoría
    const descriptions = {
        'iPhone': 'Smartphone premium con tecnología avanzada, cámara profesional y rendimiento excepcional. Diseño elegante y funcionalidades innovadoras.',
        'Samsung': 'Dispositivo de alta gama con pantalla brillante, batería de larga duración y características inteligentes para tu día a día.',
        'MacBook': 'Laptop ultradelgada y potente, perfecta para profesionales. Rendimiento superior y diseño icónico de Apple.',
        'Sony': 'Tecnología de audio premium con calidad de sonido excepcional y características avanzadas de cancelación de ruido.',
        'Nintendo': 'Consola de videojuegos versátil con experiencia de juego única. Diversión garantizada para toda la familia.',
        'Apple Watch': 'Smartwatch inteligente con monitoreo de salud, notificaciones y aplicaciones útiles para tu estilo de vida activo.',
        'iPad': 'Tablet versátil y potente, ideal para trabajo, entretenimiento y creatividad. Pantalla de alta resolución y rendimiento fluido.',
        'Dyson': 'Electrodoméstico innovador con tecnología avanzada, diseño moderno y eficiencia energética superior.'
    };
    
    for (const [key, desc] of Object.entries(descriptions)) {
        if (product.name.toLowerCase().includes(key.toLowerCase())) {
            return desc;
        }
    }
    
    return 'Producto de alta calidad con excelentes características y garantía de satisfacción. Ideal para usuarios exigentes que buscan lo mejor.';
}

// Función para generar estrellas de rating
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="ri-star-fill"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="ri-star-half-fill"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="ri-star-line"></i>';
    }
    
    return stars;
}

// Función para toggle de favoritos
function toggleFavorite(productId, product) {
    if (favoritesManager.isFavorite(productId)) {
        favoritesManager.removeFromFavorites(productId);
    } else {
        favoritesManager.addToFavorites(product);
    }
}

// Inicializar sistemas
const favoritesManager = new FavoritesManager();
const cart = new ShoppingCart();

// Sistema de Checkout completo

// Clase para manejar el proceso de checkout
class CheckoutManager {
    constructor() {
        this.currentOrder = null;
        this.paymentMethods = [
            { id: 'card', name: 'Tarjeta de Crédito/Débito', icon: 'ri-bank-card-line' },
            { id: 'paypal', name: 'PayPal', icon: 'ri-paypal-line' },
            { id: 'transfer', name: 'Transferencia Bancaria', icon: 'ri-bank-line' },
            { id: 'cash', name: 'Contra Reembolso', icon: 'ri-money-euro-circle-line' }
        ];
        this.init();
    }

    init() {
        this.createCheckoutModal();
    }

    startCheckout(cartItems) {
        if (!cartItems || cartItems.length === 0) {
            this.showNotification('❌ El carrito está vacío', 'error');
            return;
        }

        this.currentOrder = {
            items: cartItems,
            total: cartItems.reduce((sum, item) => sum + (item.price_with_profit * item.quantity), 0),
            shipping: 0,
            tax: 0,
            discount: 0
        };

        // Calcular envío y impuestos
        this.calculateOrderTotals();
        this.showCheckoutModal();
    }

    calculateOrderTotals() {
        const subtotal = this.currentOrder.total;
        
        // Calcular envío (gratis si es mayor a 50€)
        this.currentOrder.shipping = subtotal >= 50 ? 0 : 4.99;
        
        // Calcular impuestos (21% IVA)
        this.currentOrder.tax = subtotal * 0.21;
        
        // Calcular descuentos (5% si es mayor a 100€)
        if (subtotal >= 100) {
            this.currentOrder.discount = subtotal * 0.05;
        }
        
        // Total final
        this.currentOrder.finalTotal = subtotal + this.currentOrder.shipping + this.currentOrder.tax - this.currentOrder.discount;
    }

    showCheckoutModal() {
        const modal = document.getElementById('checkoutModal');
        const content = document.getElementById('checkout-content');
        
        content.innerHTML = this.generateCheckoutHTML();
        
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        // Configurar eventos
        this.setupCheckoutEvents();
    }

    generateCheckoutHTML() {
        return `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Formulario de checkout -->
                <div class="space-y-6">
                    <div>
                        <h3 class="text-xl font-semibold text-gray-800 mb-4">Información de envío</h3>
                        <form id="checkout-form" class="space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                                    <input type="text" id="checkout-name" required 
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Apellidos *</label>
                                    <input type="text" id="checkout-lastname" required 
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                <input type="email" id="checkout-email" required 
                                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Teléfono *</label>
                                <input type="tel" id="checkout-phone" required 
                                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Dirección *</label>
                                <input type="text" id="checkout-address" required 
                                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Ciudad *</label>
                                    <input type="text" id="checkout-city" required 
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Código Postal *</label>
                                    <input type="text" id="checkout-postal" required 
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Provincia *</label>
                                    <select id="checkout-province" required 
                                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                        <option value="">Seleccionar...</option>
                                        <option value="Madrid">Madrid</option>
                                        <option value="Barcelona">Barcelona</option>
                                        <option value="Valencia">Valencia</option>
                                        <option value="Sevilla">Sevilla</option>
                                        <option value="Bilbao">Bilbao</option>
                                        <option value="Málaga">Málaga</option>
                                        <option value="Otras">Otras</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Notas del pedido (opcional)</label>
                                <textarea id="checkout-notes" rows="3" 
                                          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                          placeholder="Instrucciones especiales de entrega..."></textarea>
                            </div>
                        </form>
                    </div>
                    
                    <!-- Método de pago -->
                    <div>
                        <h3 class="text-xl font-semibold text-gray-800 mb-4">Método de pago</h3>
                        <div class="space-y-3" id="payment-methods">
                            ${this.paymentMethods.map(method => `
                                <label class="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors payment-method" data-method="${method.id}">
                                    <input type="radio" name="payment-method" value="${method.id}" class="sr-only">
                                    <div class="flex items-center space-x-3 flex-1">
                                        <i class="${method.icon} text-2xl text-gray-600"></i>
                                        <span class="font-medium text-gray-800">${method.name}</span>
                                    </div>
                                    <div class="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center">
                                        <div class="w-3 h-3 bg-primary-500 rounded-full hidden payment-indicator"></div>
                                    </div>
                                </label>
                            `).join('')}
                        </div>
                        
                        <!-- Formulario de tarjeta -->
                        <div id="card-form" class="mt-6 space-y-4 hidden">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Número de tarjeta *</label>
                                <input type="text" id="card-number" placeholder="1234 5678 9012 3456" maxlength="19"
                                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Fecha de expiración *</label>
                                    <input type="text" id="card-expiry" placeholder="MM/AA" maxlength="5"
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                                    <input type="text" id="card-cvv" placeholder="123" maxlength="4"
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Nombre en la tarjeta *</label>
                                <input type="text" id="card-name" placeholder="Nombre como aparece en la tarjeta"
                                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Resumen del pedido -->
                <div class="space-y-6">
                    <div class="bg-gray-50 rounded-xl p-6">
                        <h3 class="text-xl font-semibold text-gray-800 mb-4">Resumen del pedido</h3>
                        
                        <!-- Productos -->
                        <div class="space-y-4 mb-6">
                            ${this.currentOrder.items.map(item => `
                                <div class="flex items-center space-x-4">
                                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg">
                                    <div class="flex-1">
                                        <h4 class="font-medium text-gray-800">${item.name}</h4>
                                        <p class="text-sm text-gray-600">Cantidad: ${item.quantity}</p>
                                    </div>
                                    <span class="font-semibold text-gray-800">${(item.price_with_profit * item.quantity).toFixed(2)} €</span>
                                </div>
                            `).join('')}
                        </div>
                        
                        <!-- Totales -->
                        <div class="border-t border-gray-200 pt-4 space-y-2">
                            <div class="flex justify-between text-gray-600">
                                <span>Subtotal:</span>
                                <span>${this.currentOrder.total.toFixed(2)} €</span>
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>Envío:</span>
                                <span>${this.currentOrder.shipping === 0 ? 'Gratis' : this.currentOrder.shipping.toFixed(2) + ' €'}</span>
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>IVA (21%):</span>
                                <span>${this.currentOrder.tax.toFixed(2)} €</span>
                            </div>
                            ${this.currentOrder.discount > 0 ? `
                                <div class="flex justify-between text-green-600">
                                    <span>Descuento:</span>
                                    <span>-${this.currentOrder.discount.toFixed(2)} €</span>
                                </div>
                            ` : ''}
                            <div class="border-t border-gray-300 pt-2 flex justify-between text-lg font-bold text-gray-800">
                                <span>Total:</span>
                                <span>${this.currentOrder.finalTotal.toFixed(2)} €</span>
                            </div>
                        </div>
                        
                        <!-- Garantías -->
                        <div class="mt-6 space-y-3">
                            <div class="flex items-center space-x-2 text-sm text-gray-600">
                                <i class="ri-shield-check-line text-green-500"></i>
                                <span>Compra 100% segura</span>
                            </div>
                            <div class="flex items-center space-x-2 text-sm text-gray-600">
                                <i class="ri-truck-line text-blue-500"></i>
                                <span>Envío rápido y seguro</span>
                            </div>
                            <div class="flex items-center space-x-2 text-sm text-gray-600">
                                <i class="ri-arrow-go-back-line text-purple-500"></i>
                                <span>Devolución gratuita 30 días</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Términos y condiciones -->
                    <div class="space-y-4">
                        <label class="flex items-start space-x-3 cursor-pointer">
                            <input type="checkbox" id="terms-checkbox" required class="mt-1">
                            <span class="text-sm text-gray-600">
                                Acepto los <a href="#" class="text-primary-500 hover:underline">términos y condiciones</a> 
                                y la <a href="#" class="text-primary-500 hover:underline">política de privacidad</a>
                            </span>
                        </label>
                        
                        <label class="flex items-start space-x-3 cursor-pointer">
                            <input type="checkbox" id="newsletter-checkbox">
                            <span class="text-sm text-gray-600">
                                Quiero recibir ofertas y novedades por email
                            </span>
                        </label>
                    </div>
                    
                    <!-- Botón de pago -->
                    <button id="complete-payment-btn" onclick="checkoutManager.processPayment()" 
                            class="w-full bg-primary-500 hover:bg-primary-600 text-white py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center space-x-2">
                        <i class="ri-secure-payment-line"></i>
                        <span>Completar pago - ${this.currentOrder.finalTotal.toFixed(2)} €</span>
                    </button>
                </div>
            </div>
        `;
    }

    setupCheckoutEvents() {
        // Eventos de método de pago
        document.querySelectorAll('.payment-method').forEach(method => {
            method.addEventListener('click', () => {
                // Limpiar selecciones anteriores
                document.querySelectorAll('.payment-method').forEach(m => {
                    m.classList.remove('border-primary-500', 'bg-primary-50');
                    m.querySelector('.payment-indicator').classList.add('hidden');
                });
                
                // Marcar como seleccionado
                method.classList.add('border-primary-500', 'bg-primary-50');
                method.querySelector('.payment-indicator').classList.remove('hidden');
                method.querySelector('input[type="radio"]').checked = true;
                
                // Mostrar/ocultar formulario de tarjeta
                const cardForm = document.getElementById('card-form');
                if (method.dataset.method === 'card') {
                    cardForm.classList.remove('hidden');
                } else {
                    cardForm.classList.add('hidden');
                }
            });
        });
        
        // Formateo de número de tarjeta
        const cardNumberInput = document.getElementById('card-number');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
                let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                e.target.value = formattedValue;
            });
        }
        
        // Formateo de fecha de expiración
        const cardExpiryInput = document.getElementById('card-expiry');
        if (cardExpiryInput) {
            cardExpiryInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value;
            });
        }
        
        // Solo números en CVV
        const cardCvvInput = document.getElementById('card-cvv');
        if (cardCvvInput) {
            cardCvvInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            });
        }
    }

    async processPayment() {
        // Validar formulario
        const form = document.getElementById('checkout-form');
        const termsCheckbox = document.getElementById('terms-checkbox');
        
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        if (!termsCheckbox.checked) {
            this.showNotification('❌ Debes aceptar los términos y condiciones', 'error');
            return;
        }
        
        // Validar método de pago
        const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked');
        if (!selectedPaymentMethod) {
            this.showNotification('❌ Selecciona un método de pago', 'error');
            return;
        }
        
        // Validar datos de tarjeta si es necesario
        if (selectedPaymentMethod.value === 'card') {
            const cardNumber = document.getElementById('card-number').value;
            const cardExpiry = document.getElementById('card-expiry').value;
            const cardCvv = document.getElementById('card-cvv').value;
            const cardName = document.getElementById('card-name').value;
            
            if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
                this.showNotification('❌ Completa todos los datos de la tarjeta', 'error');
                return;
            }
        }
        
        // Mostrar indicador de carga
        const paymentBtn = document.getElementById('complete-payment-btn');
        const originalBtnText = paymentBtn.innerHTML;
        paymentBtn.innerHTML = '<div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>Procesando pago...';
        paymentBtn.disabled = true;
        
        try {
            // Simular procesamiento de pago
            await this.simulatePaymentProcessing();
            
            // Recopilar datos del pedido
            const orderData = this.collectOrderData();
            
            // Enviar al servidor
            const response = await fetch('/save-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                // Pago exitoso
                this.showPaymentSuccess(result, orderData);
                
                // Limpiar carrito
                cart.clearCart();
                
                // Cerrar modal de checkout
                this.closeCheckoutModal();
            } else {
                throw new Error(result.error || 'Error en el procesamiento');
            }
        } catch (error) {
            console.error('Error en el pago:', error);
            this.showNotification(`❌ Error: ${error.message}`, 'error');
        } finally {
            // Restaurar botón
            paymentBtn.innerHTML = originalBtnText;
            paymentBtn.disabled = false;
        }
    }

    async simulatePaymentProcessing() {
        // Simular diferentes tiempos de procesamiento según el método de pago
        const selectedMethod = document.querySelector('input[name="payment-method"]:checked').value;
        const processingTimes = {
            'card': 2000,
            'paypal': 1500,
            'transfer': 3000,
            'cash': 500
        };
        
        await new Promise(resolve => setTimeout(resolve, processingTimes[selectedMethod] || 2000));
    }

    collectOrderData() {
        return {
            items: this.currentOrder.items,
            customer: {
                name: document.getElementById('checkout-name').value,
                lastname: document.getElementById('checkout-lastname').value,
                email: document.getElementById('checkout-email').value,
                phone: document.getElementById('checkout-phone').value,
                address: document.getElementById('checkout-address').value,
                city: document.getElementById('checkout-city').value,
                postal: document.getElementById('checkout-postal').value,
                province: document.getElementById('checkout-province').value,
                notes: document.getElementById('checkout-notes').value
            },
            payment: {
                method: document.querySelector('input[name="payment-method"]:checked').value,
                amount: this.currentOrder.finalTotal
            },
            totals: {
                subtotal: this.currentOrder.total,
                shipping: this.currentOrder.shipping,
                tax: this.currentOrder.tax,
                discount: this.currentOrder.discount,
                total: this.currentOrder.finalTotal
            },
            preferences: {
                newsletter: document.getElementById('newsletter-checkbox').checked
            }
        };
    }

    showPaymentSuccess(result, orderData) {
        // Crear modal de éxito si no existe
        if (!document.getElementById('paymentSuccessModal')) {
            const modalHTML = `
                <div class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50" id="paymentSuccessModal">
                    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4">
                        <div class="p-6 border-b border-gray-200 bg-green-500 text-white rounded-t-2xl">
                            <h3 class="text-2xl font-bold flex items-center">
                                <i class="ri-check-circle-line mr-3 text-3xl"></i>
                                ¡Pago Completado!
                            </h3>
                        </div>
                        <div class="p-6" id="payment-success-content">
                            <!-- Contenido dinámico -->
                        </div>
                        <div class="p-6 border-t border-gray-200 text-center">
                            <button class="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors" onclick="closePaymentSuccessModal()">
                                Continuar comprando
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
        
        // Actualizar contenido
        document.getElementById('payment-success-content').innerHTML = `
            <div class="text-center mb-6">
                <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="ri-shopping-bag-line text-4xl text-green-500"></i>
                </div>
                <h4 class="text-2xl font-bold text-gray-800 mb-2">¡Gracias por tu compra!</h4>
                <p class="text-gray-600">Tu pedido ha sido procesado y pagado correctamente</p>
            </div>
            
            <div class="bg-gray-50 rounded-xl p-6 mb-6">
                <h5 class="font-semibold text-gray-800 mb-4">Detalles del pedido</h5>
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Número de pedido:</span>
                        <span class="font-medium">${result.order_id}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Total pagado:</span>
                        <span class="font-medium">${orderData.totals.total.toFixed(2)} €</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Método de pago:</span>
                        <span class="font-medium">${this.getPaymentMethodName(orderData.payment.method)}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Entrega estimada:</span>
                        <span class="font-medium">${result.estimated_delivery}</span>
                    </div>
                </div>
            </div>
            
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex items-start space-x-3">
                    <i class="ri-information-line text-blue-500 text-xl mt-0.5"></i>
                    <div class="text-blue-800 text-sm">
                        <p class="font-medium mb-1">¿Qué sigue ahora?</p>
                        <ul class="space-y-1">
                            <li>• Recibirás un email de confirmación</li>
                            <li>• Te enviaremos el código de seguimiento</li>
                            <li>• Puedes contactarnos si tienes dudas</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        // Mostrar modal
        document.getElementById('paymentSuccessModal').classList.remove('hidden');
        document.getElementById('paymentSuccessModal').classList.add('flex');
    }

    getPaymentMethodName(methodId) {
        const method = this.paymentMethods.find(m => m.id === methodId);
        return method ? method.name : 'Desconocido';
    }

    createCheckoutModal() {
        const modalHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50" id="checkoutModal">
                <div class="bg-white rounded-2xl shadow-2xl max-w-7xl w-full mx-4 max-h-[95vh] overflow-y-auto">
                    <div class="p-6 border-b border-gray-200 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-2xl">
                        <div class="flex items-center justify-between">
                            <h3 class="text-2xl font-bold flex items-center">
                                <i class="ri-secure-payment-line mr-3 text-3xl"></i>
                                Checkout Seguro
                            </h3>
                            <button class="text-white hover:text-gray-200 transition-colors" onclick="checkoutManager.closeCheckoutModal()">
                                <i class="ri-close-line text-2xl"></i>
                            </button>
                        </div>
                    </div>
                    <div class="p-6" id="checkout-content">
                        <!-- Contenido dinámico -->
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    closeCheckoutModal() {
        const modal = document.getElementById('checkoutModal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }

    showNotification(message, type = 'info') {
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-blue-500',
            warning: 'bg-yellow-500'
        };
        
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-2 hover:text-gray-200">
                    <i class="ri-close-line"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// Función global para cerrar modal de favoritos
function closeFavoritesModal() {
    const modal = document.getElementById('favoritesModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Función global para cerrar modal de carrito
function closeCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Inicializar el sistema de checkout
const checkoutManager = new CheckoutManager();

// Función global para cerrar modal de éxito de pago
function closePaymentSuccessModal() {
    const modal = document.getElementById('paymentSuccessModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Función global para cerrar modales al hacer clic fuera
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('fixed') && e.target.classList.contains('inset-0')) {
        // Cerrar modal de detalles
        if (e.target.id === 'productDetailsModal') {
            closeProductDetailsModal();
        }
        // Cerrar modal de confirmación
        if (e.target.id === 'orderConfirmationModal') {
            closeOrderConfirmation();
        }
        // Cerrar modal de pedido
        if (e.target.id === 'orderModal') {
            orderModal.classList.add('hidden');
            orderModal.classList.remove('flex');
        }
        // Cerrar modal de favoritos
        if (e.target.id === 'favoritesModal') {
            closeFavoritesModal();
        }
        // Cerrar modal de carrito
        if (e.target.id === 'cartModal') {
            closeCartModal();
        }
        // Cerrar modal de checkout
        if (e.target.id === 'checkoutModal') {
            checkoutManager.closeCheckoutModal();
        }
        // Cerrar modal de éxito de pago
        if (e.target.id === 'paymentSuccessModal') {
            closePaymentSuccessModal();
        }
    }
});