// Глобальные переменные для хранения данных
let allProducts = [];
let cartItems = [];
let favoriteItems = [];
let currentProductDetail = null;

// --- Вспомогательные функции для localStorage ---
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error(`Ошибка при сохранении в localStorage (${key}):`, e);
    }
}

function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error(`Ошибка при загрузке из localStorage (${key}):`, e);
        return [];
    }
}

// --- Функции для модального окна ---
function showModal(title, message, type = 'info') {
    const modal = $('#custom-modal');
    $('#modal-title').text(title);
    $('#modal-message').text(message);
    const modalContent = modal.find('.modal-content');
    modalContent.removeClass('bg-green-700 bg-red-700').addClass('bg-gray-800');
    if (type === 'success') {
        modalContent.removeClass('bg-gray-800').addClass('bg-green-700');
    } else if (type === 'error') {
        modalContent.removeClass('bg-gray-800').addClass('bg-red-700');
    }
    modal.removeClass('hidden').addClass('flex');
}

function hideModal() {
    $('#custom-modal').removeClass('flex').addClass('hidden');
}


// --- Функции управления страницами ---
function showPage(pageId) {
    try {
        const pageSections = document.querySelectorAll('.page-section');
        pageSections.forEach(section => {
            section.classList.remove('active');
        });

        const activePage = document.getElementById(pageId);
        if (activePage) {
            activePage.classList.add('active');
            if (pageId === 'cart') {
                renderCartPage();
            } else if (pageId === 'favorites') {
                renderFavoritesPage();
            } else if (pageId === 'contact') {
                // loadFeedbackMessages(); // можно вызвать при необходимости
            } else if (pageId === 'catalog') {
                applyFilters();
            }
        } else {
            console.error(`Ошибка: Секция страницы с ID "${pageId}" не найдена.`);
        }

        // ❌ Исправленный вызов history.pushState
        history.pushState(null, '', `#${pageId}`);

    } catch (error) {
        console.error('Ошибка в функции showPage:', error);
        // ❌ showModal('Ошибка', 'Произошла ошибка при открытии страницы.', 'error');
    }
}

// --- Функции управления продуктами (каталог) ---
function renderProductCards(productsToRender) {
    const productListDiv = $('#product-list');
    if (!productListDiv.length) {
        console.error('Элемент #product-list не найден.');
        return;
    }

    productListDiv.empty();

    if (productsToRender.length === 0) {
        productListDiv.html('<p class="text-white text-center col-span-full">Нет доступных видеокарт по выбранным фильтрам.</p>');
        return;
    }

    productsToRender.forEach((product) => {
        const productCard = $(`
            <div class="product-card bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center"
                 data-id="${product.id}"
                 data-category="${product.category}"
                 data-price="${product.price}"
                 data-memory="${product.memory}">
                <img src="${product.thumbnail_url}" alt="${product.title}" 
                     class="w-full h-auto object-cover mb-4 rounded-md cursor-pointer product-image-link" 
                     data-product-id="${product.id}" 
                     onerror="this.onerror=null;this.src='https://placehold.co/200x150/AAAAAA/000000?text=No+Image';">
                <h3 class="text-xl font-semibold text-white mb-2 text-center">${product.title}</h3>
                <p class="text-gray-400 text-sm text-center mb-4">${product.description}</p>
                <p class="text-2xl font-bold text-white mb-4">Цена: ${product.price.toLocaleString('ru-RU')} Р</p>
                <div class="flex space-x-2">
                    <button class="btn-primary py-2 px-4 rounded-md hover:opacity-90 add-to-cart-btn" data-product-id="${product.id}">В корзину</button>
                    <button class="bg-gray-600 text-white py-2 px-4 rounded-md hover:opacity-90 add-to-favorites-btn" data-product-id="${product.id}">В избранное</button>
                </div>
            </div>
        `);

        productListDiv.append(productCard);
    });

    attachProductCardListeners();
}

function attachProductCardListeners() {
    $('.product-image-link').off('click').on('click', function () {
        const productId = $(this).data('product-id');
        const product = allProducts.find(p => p.id == productId);
        if (product) {
            showProductDetail(product);
        } else {
            console.error(`Продукт с ID ${productId} не найден в allProducts.`);
        }
    });

    $('.add-to-cart-btn').off('click').on('click', function () {
        const productId = $(this).data('product-id');
        const product = allProducts.find(p => p.id == productId);
        if (product) addToCart(product);
    });

    $('.add-to-favorites-btn').off('click').on('click', function () {
        const productId = $(this).data('product-id');
        const product = allProducts.find(p => p.id == productId);
        if (product) addToFavorites(product);
    });
}

// --- Функции управления корзиной ---
function addToCart(product) {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cartItems.push({ ...product, quantity: 1 });
    }

    saveToLocalStorage('cartItems', cartItems);
    // showModal('Успех', 'Товар добавлен в корзину: ' + product.title, 'success');
    renderCartPage();
}

function removeFromCart(productId) {
    cartItems = cartItems.filter(item => item.id !== productId);
    saveToLocalStorage('cartItems', cartItems);
    // showModal('Успех', 'Товар удален из корзины.', 'success');
    renderCartPage();
}

function renderCartPage() {
    const cartContainer = $('#cart-items-container'); 
    const cartEmptyMessage = $('#cart-empty-message');

    if (!cartContainer.length || !cartEmptyMessage.length) {
        console.error('Элементы корзины не найдены.');
        return;
    }

    cartContainer.find('.cart-item-card, .cart-summary').remove();

    if (cartItems.length === 0) {
        cartEmptyMessage.show();
        return;
    } else {
        cartEmptyMessage.hide();
    }

    let totalItems = 0;
    let totalPrice = 0;

    const itemsHtml = cartItems.map(item => {
        const itemQuantity = item.quantity || 1;
        totalItems += itemQuantity;
        totalPrice += item.price * itemQuantity;

        return `
            <div class="flex items-center space-x-4 bg-gray-700 p-4 rounded-md cart-item-card">
                <img src="${item.thumbnail_url}" alt="${item.title}" class="w-24 h-24 object-cover rounded-md"
                     onerror="this.onerror=null;this.src='https://placehold.co/100x100/AAAAAA/000000?text=No+Image';">
                <div class="flex-1">
                    <h3 class="text-xl font-semibold text-white">${item.title}</h3>
                    <p class="text-gray-400">Количество: ${itemQuantity}</p>
                    <p class="text-lg font-bold text-white">Цена: ${item.price.toLocaleString('ru-RU')} Р</p>
                </div>
                <button class="text-red-500 hover:text-red-700 ml-auto rounded-md p-2 remove-from-cart-btn" data-product-id="${item.id}">
                    <i class="fas fa-trash-alt"></i> Удалить
                </button>
            </div>
        `;
    }).join('');

    const summaryHtml = `
        <div class="flex items-center justify-between mt-6 mb-4 cart-summary">
            <span class="text-xl font-semibold text-white">${totalItems} товар(а)</span>
            <span class="text-2xl font-bold text-white">${totalPrice.toLocaleString('ru-RU')} Р</span>
        </div>
        <button class="btn-primary w-full py-3 rounded-md text-xl font-semibold hover:opacity-90 cart-summary">Перейти к оформлению</button>
        <div class="mt-4 space-y-2 cart-summary">
            <p class="text-gray-400 text-center">Доставка в пункт выдачи</p>
            <p class="text-gray-400 text-center">Доставка на дом</p>
        </div>
    `;

    cartContainer.prepend(summaryHtml);
    cartContainer.prepend(itemsHtml);

    $('.remove-from-cart-btn').off('click').on('click', function () {
        const productId = parseInt($(this).data('product-id'));
        removeFromCart(productId);
    });
}

// --- Функции управления избранным ---
function addToFavorites(product) {
    const existingItem = favoriteItems.find(item => item.id === product.id);
    if (!existingItem) {
        favoriteItems.push(product);
        saveToLocalStorage('favoriteItems', favoriteItems);
        // showModal('Успех', 'Товар добавлен в избранное: ' + product.title, 'success');
        renderFavoritesPage();
    } else {
        // showModal('Информация', 'Товар уже в избранном.', 'info');
    }
}

function removeFromFavorites(productId) {
    favoriteItems = favoriteItems.filter(item => item.id !== productId);
    saveToLocalStorage('favoriteItems', favoriteItems);
    // showModal('Успех', 'Товар удален из избранного.', 'success');
    renderFavoritesPage();
}

function renderFavoritesPage() {
    const favoritesContainer = $('#favorites-items-container'); 
    const favoritesEmptyMessage = $('#favorites-empty-message');

    if (!favoritesContainer.length || !favoritesEmptyMessage.length) {
        console.error('Элементы избранного не найдены.');
        return;
    }

    favoritesContainer.find('.favorite-item-card, .favorite-summary').remove();

    if (favoriteItems.length === 0) {
        favoritesEmptyMessage.show();
        return;
    } else {
        favoritesEmptyMessage.hide();
    }

    let totalItems = favoriteItems.length;
    let totalPrice = favoriteItems.reduce((sum, item) => sum + item.price, 0);

    const itemsHtml = favoriteItems.map(item => `
        <div class="flex items-center space-x-4 bg-gray-700 p-4 rounded-md favorite-item-card">
            <img src="${item.thumbnail_url}" alt="${item.title}" class="w-24 h-24 object-cover rounded-md"
                 onerror="this.onerror=null;this.src='https://placehold.co/100x100/AAAAAA/000000?text=No+Image';">
            <div class="flex-1">
                <h3 class="text-xl font-semibold text-white">${item.title}</h3>
                <p class="text-gray-400">${item.description.substring(0, 70)}...</p>
                <p class="text-lg font-bold text-white">Цена: ${item.price.toLocaleString('ru-RU')} Р</p>
            </div>
            <div class="flex flex-col space-y-2 ml-auto">
                <button class="btn-primary py-2 px-4 rounded-md hover:opacity-90 add-to-cart-from-fav-btn" data-product-id="${item.id}">В корзину</button>
                <button class="text-red-500 hover:text-red-700 rounded-md p-2 remove-from-favorites-btn" data-product-id="${item.id}">
                    <i class="fas fa-trash-alt"></i> Удалить
                </button>
            </div>
        </div>
    `).join('');

    const summaryHtml = `
        <div class="flex items-center justify-between mt-6 mb-4 favorite-summary">
            <span class="text-xl font-semibold text-white">${totalItems} товар(а)</span>
            <span class="text-2xl font-bold text-white">${totalPrice.toLocaleString('ru-RU')} Р</span>
        </div>
        <button class="btn-primary w-full py-3 rounded-md text-xl font-semibold hover:opacity-90 favorite-summary">Перейти в корзину</button>
    `;

    favoritesContainer.prepend(summaryHtml);
    favoritesContainer.prepend(itemsHtml);

    $('.remove-from-favorites-btn').off('click').on('click', function () {
        const productId = parseInt($(this).data('product-id'));
        removeFromFavorites(productId);
    });

    $('.add-to-cart-from-fav-btn').off('click').on('click', function () {
        const productId = parseInt($(this).data('product-id'));
        const product = allProducts.find(p => p.id == productId);
        if (product) addToCart(product);
    });
}

// --- Функции для страницы деталей продукта ---
function showProductDetail(productData) {
    try {
        if (!productData) {
            console.error('Данные продукта для страницы деталей не предоставлены.');
            return;
        }

        currentProductDetail = productData;

        const detailImage = $('#detail-product-image'); 
        const detailTitle = $('#detail-product-title');
        const detailDescription = $('#detail-product-description');
        const detailPrice = $('#detail-product-price');

        if (detailImage.length) {
            detailImage.attr('src', productData.thumbnail_url);
            detailImage.attr('alt', productData.title);
        } else {
            console.error('Элемент detail-product-image не найден.');
        }

        if (detailTitle.length) {
            detailTitle.text(productData.title);
        } else {
            console.error('Элемент detail-product-title не найден.');
        }

        if (detailDescription.length) {
            detailDescription.text(productData.description);
        } else {
            console.error('Элемент detail-product-description не найден.');
        }

        if (detailPrice.length) {
            detailPrice.text(`Цена: ${productData.price.toLocaleString('ru-RU')} Р`);
        } else {
            console.error('Элемент detail-product-price не найден.');
        }

        showPage('product-detail');
    } catch (error) {
        console.error('Ошибка в функции showProductDetail:', error);
    }
}

// --- Функции фильтрации и поиска ---
function applyFilters() {
    try {
        const searchTerm = $('#search-input').val()?.toLowerCase() || '';
        const selectedCategory = $('.category-link.active').data('category') || 'all';
        const minPrice = parseInt($('#min-price-slider').val() || '0', 10);
        const maxPrice = parseInt($('#max-price-slider').val() || '500000', 10);
        const selectedMemoryFilters = Array.from($('.memory-filter:checked')).map(cb => parseInt($(cb).val(), 10));

        const filteredProducts = allProducts.filter(product => {
            const title = product.title.toLowerCase();
            const description = product.description.toLowerCase();
            const category = product.category;
            const price = product.price;
            const memory = product.memory;

            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
            const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
            const matchesPrice = price >= minPrice && price <= maxPrice;
            const matchesMemory = selectedMemoryFilters.length === 0 || selectedMemoryFilters.includes(memory);

            return matchesSearch && matchesCategory && matchesPrice && matchesMemory;
        });

        renderProductCards(filteredProducts);
    } catch (error) {
        console.error('Ошибка в функции applyFilters:', error);
    }
}

// --- Функции AJAX для обратной связи ---
function renderFeedbackMessages(messages) {
    const feedbackContainer = $('#feedback-messages-container');
    const noFeedbackMessage = $('#no-feedback-message');

    feedbackContainer.find('.feedback-message-card').remove();
    noFeedbackMessage.hide().text('');

    if (messages.length > 0) {
        messages.forEach(message => {
            const messageDate = new Date(message.submission_date).toLocaleString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const messageCard = `
                <div class="bg-gray-700 p-4 rounded-md feedback-message-card">
                    <h4 class="text-lg font-semibold text-white">${message.name} (${message.email})</h4>
                    <p class="text-gray-300 mt-2">${message.message}</p>
                    <p class="text-gray-500 text-sm mt-2">Отправлено: ${messageDate}</p>
                </div>
            `;

            feedbackContainer.append(messageCard);
        });
    } else {
        noFeedbackMessage.show().text('Сообщения пока отсутствуют.');
    }
}

function loadFeedbackMessages() {
    const feedbackContainer = $('#feedback-messages-container');
    const noFeedbackMessage = $('#no-feedback-message');
    if (!feedbackContainer.length || !noFeedbackMessage.length) {
        console.error('Контейнеры для сообщений обратной связи не найдены.');
        return;
    }
    feedbackContainer.find('.feedback-message-card').remove();
    noFeedbackMessage.show().text('Загрузка сообщений...');
    $.get('ajax.php', { action: 'get_feedback' })
        .done(function(response) {
            console.log('Ответ сервера (GET):', response); // Новый лог
            if (response.success) {
                renderFeedbackMessages(response.messages || []);
            } else {
                showModal('Ошибка', 'Не удалось загрузить сообщения: ' + (response.message || 'Неизвестная ошибка.'), 'error');
                noFeedbackMessage.show().text('Не удалось загрузить сообщения.');
                console.error('Ошибка AJAX GET-запроса:', response);
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.error('AJAX GET-запрос провалился:', textStatus, errorThrown, jqXHR.responseText); // Новый лог
            showModal('Ошибка сети', 'Ошибка при загрузке сообщений: ' + textStatus, 'error');
            noFeedbackMessage.show().text('Ошибка загрузки сообщений.');
        });
}

function submitFeedbackForm(formData) {
    console.log('Отправляемые данные:', formData); // Новый лог
    $.ajax({
        type: 'POST',
        url: 'ajax.php',
        data: formData,
        processData: false,
        contentType: false,
        dataType: 'json',
        beforeSend: function() {
            showModal('Отправка...', 'Ваше сообщение отправляется...', 'info');
        },
        success: function(response) {
            console.log('Ответ сервера:', response); // Новый лог
            if (response.success) {
                showModal('Успех', response.message, 'success');
                $('#feedback-form')[0].reset();
                loadFeedbackMessages();
            } else {
                showModal('Ошибка', response.message, 'error');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('AJAX POST-запрос провалился:', textStatus, errorThrown, jqXHR.responseText); // Новый лог
            showModal('Ошибка сети', 'Произошла ошибка при отправке сообщения: ' + textStatus, 'error');
        }
    });
}

// --- Инициализация при загрузке DOM ---
$(document).ready(function () {
    try {
        if (window.allProductsData) {
            allProducts = window.allProductsData;
        } else {
            console.error('Ошибка: Данные о продуктах (window.allProductsData) не загружены из PHP или пусты.');
            return;
        }

        cartItems = loadFromLocalStorage('cartItems');
        favoriteItems = loadFromLocalStorage('favoriteItems');

        $('.nav-link').on('click', function (event) {
            event.preventDefault();
            const pageId = $(this).data('page');
            showPage(pageId);
        });

        const initialHash = window.location.hash.substring(1);
        if (initialHash && document.getElementById(initialHash)) {
            showPage(initialHash);
        } else {
            showPage('home');
        }

        $('#search-input').on('input', applyFilters);

        $('.category-link').on('click', function (event) {
            event.preventDefault();
            $('.category-link').removeClass('active');
            $(this).addClass('active');
            applyFilters();
        });

        $('.category-link[data-category="all"]').addClass('active');

        const minPriceSlider = $('#min-price-slider');
        const maxPriceSlider = $('#max-price-slider');
        const priceRangeDisplay = $('#price-range-display');

        if (minPriceSlider.length && maxPriceSlider.length && priceRangeDisplay.length) {
            function updatePriceRangeDisplay() {
                let minVal = parseInt(minPriceSlider.val() || '0', 10);
                let maxVal = parseInt(maxPriceSlider.val() || '500000', 10);

                if (minVal > maxVal) [minVal, maxVal] = [maxVal, minVal];

                minPriceSlider.val(minVal.toString());
                maxPriceSlider.val(maxVal.toString());

                priceRangeDisplay.text(`${minVal.toLocaleString('ru-RU')} Р - ${maxVal.toLocaleString('ru-RU')} Р`);
                applyFilters();
            }

            minPriceSlider.on('input', updatePriceRangeDisplay);
            maxPriceSlider.on('input', updatePriceRangeDisplay);
            updatePriceRangeDisplay();
        }

        $('.memory-filter').on('change', applyFilters);

        $('#detail-add-to-cart-btn').on('click', () => {
            if (currentProductDetail) addToCart(currentProductDetail);
        });

        $('#detail-add-to-favorites-btn').on('click', () => {
            if (currentProductDetail) addToFavorites(currentProductDetail);
        });

        $('#feedback-form').on('submit', function (event) {
            event.preventDefault();
            const formData = new FormData(this);
            submitFeedbackForm(formData);
        });

        $('#load-feedback-btn').on('click', function () {
            loadFeedbackMessages();
        });

        applyFilters();

    } catch (error) {
        console.error('Ошибка во время jQuery DOM ready:', error);
    }
});