<?php
// index.php

// Подключаем скрипт для работы с базой данных один раз
require_once 'script.php';

// Получаем список продуктов из базы данных
try {
    $products = getProducts();
} catch (PDOException $e) {
    die("Ошибка подключения к БД: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VideoCards</title>

    <!-- Подключение Tailwind CSS -->
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"  rel="stylesheet">

    <!-- Подключение Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"  rel="stylesheet">

    <!-- Подключение вашего кастомного CSS файла -->
    <link rel="stylesheet" href="style.css">

    <!-- Подключение jQuery -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script> 
</head>
<body class="flex flex-col min-h-screen bg-gray-900 text-white">
    <!-- Header -->
    <header class="bg-green-700 py-4 shadow-md">
        <div class="container mx-auto px-4 flex items-center justify-between">
            <div class="flex items-center space-x-8">
                <h1 class="text-3xl font-bold">VideoCards</h1>
                <nav class="hidden md:flex space-x-6">
                    <a href="#home" class="nav-link hover:text-gray-200 flex items-center rounded-md p-2" data-page="home">
                        <i class="fas fa-home mr-2"></i>Главная
                    </a>
                    <a href="#catalog" class="nav-link hover:text-gray-200 flex items-center rounded-md p-2" data-page="catalog">
                        <i class="fas fa-box-open mr-2"></i>Каталог
                    </a>
                </nav>
            </div>
            <div class="flex items-center space-x-8">
                <div class="flex items-center space-x-2">
                    <img src="images/Logo.png" alt="sanchess logo" class="rounded-full w-10 h-10">
                    <span class="text-lg font-semibold">sanchess</span>
                </div>
                <nav class="hidden md:flex space-x-6">
                    <a href="#catalog" class="nav-link hover:text-gray-200 flex items-center rounded-md p-2" data-page="catalog">
                        <i class="fas fa-th-large mr-2"></i>Категории
                    </a>
                    <a href="#cart" class="nav-link hover:text-gray-200 flex items-center rounded-md p-2" data-page="cart">
                        <i class="fas fa-shopping-cart mr-2"></i>Корзина
                    </a>
                    <a href="#favorites" class="nav-link hover:text-gray-200 flex items-center rounded-md p-2" data-page="favorites">
                        <i class="fas fa-heart mr-2"></i>Избранное
                    </a>
                    <a href="#contact" class="nav-link hover:text-gray-200 flex items-center rounded-md p-2" data-page="contact">
                        <i class="fas fa-envelope mr-2"></i>Контакты
                    </a>
                </nav>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow container mx-auto px-4 py-8">
        <!-- Home Page -->
        <section id="home" class="page-section active text-center">
            <h2 class="text-4xl font-bold mb-6">Добро пожаловать на наш сайт!</h2>
            <p class="text-2xl text-green-300 max-w-2xl mx-auto mb-8">
                Здесь вы найдете мощные видеокарты для геймеров и профессионалов!
            </p>
            <img src="images/41f7a12c-5475-437d-815d-e081ab3eecea.png"
                 alt="Коллекция видеокарт" class="mx-auto rounded-lg shadow-lg">
        </section>

        <!-- Catalog Page -->
        <section id="catalog" class="page-section grid grid-cols-1 md:grid-cols-4 gap-6">
            <!-- Sidebar -->
            <aside class="md:col-span-1 bg-red-700 p-6 rounded-lg shadow-lg">
                <h2 class="text-2xl font-bold mb-6 text-white">Каталог</h2>
                <!-- Search -->
                <div class="mb-6">
                    <label for="search-input" class="block text-white text-lg font-bold mb-2">Поиск:</label>
                    <input type="text" id="search-input" placeholder="Найти видеокарту..."
                           class="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <!-- Categories -->
                <h3 class="text-xl font-bold mt-8 mb-4 text-white">Производители</h3>
                <ul class="space-y-4">
                    <li><a href="#" class="category-link text-white hover:text-gray-200 text-lg" data-category="all">Все</a></li>
                    <li><a href="#" class="category-link text-white hover:text-gray-200 text-lg" data-category="amd">AMD</a></li>
                    <li><a href="#" class="category-link text-white hover:text-gray-200 text-lg" data-category="nvidia">NVIDIA</a></li>
                    <li><a href="#" class="category-link text-white hover:text-gray-200 text-lg" data-category="intel">INTEL</a></li>
                </ul>
                <!-- Price Range Slider -->
                <h3 class="text-xl font-bold mt-8 mb-4 text-white">Цена: <span id="price-range-display">0 Р - 500000 Р</span></h3>
                <div class="relative mb-6">
                    <input type="range" id="min-price-slider" min="0" max="500000" value="0"
                           class="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-slider-thumb">
                    <input type="range" id="max-price-slider" min="0" max="500000" value="500000"
                           class="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-slider-thumb mt-2">
                </div>
                <!-- Video Memory Filter -->
                <h3 class="text-xl font-bold mt-8 mb-4 text-white">Объем видеопамяти</h3>
                <div class="space-y-2">
                    <label class="flex items-center text-white">
                        <input type="checkbox" class="memory-filter h-5 w-5 text-blue-600 rounded-md" value="2">
                        <span class="ml-2 text-lg">2 ГБ</span>
                    </label>
                    <label class="flex items-center text-white">
                        <input type="checkbox" class="memory-filter h-5 w-5 text-blue-600 rounded-md" value="4">
                        <span class="ml-2 text-lg">4 ГБ</span>
                    </label>
                    <label class="flex items-center text-white">
                        <input type="checkbox" class="memory-filter h-5 w-5 text-blue-600 rounded-md" value="8">
                        <span class="ml-2 text-lg">8 ГБ</span>
                    </label>
                    <label class="flex items-center text-white">
                        <input type="checkbox" class="memory-filter h-5 w-5 text-blue-600 rounded-md" value="16">
                        <span class="ml-2 text-lg">16 ГБ</span>
                    </label>
                    <label class="flex items-center text-white">
                        <input type="checkbox" class="memory-filter h-5 w-5 text-blue-600 rounded-md" value="24">
                        <span class="ml-2 text-lg">24 ГБ</span>
                    </label>
                </div>
            </aside>

            <!-- Product List -->
            <section class="md:col-span-3">
                <h2 class="text-2xl font-bold mb-6">Видеокарты</h2>
                <div id="product-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
            </section>
        </section>

        <!-- Product Detail Page -->
        <section id="product-detail" class="page-section mt-12">
            <button onclick="showPage('catalog')" class="btn-primary py-2 px-4 rounded-md hover:opacity-90 mb-6">
                <i class="fas fa-arrow-left mr-2"></i> Вернуться в каталог
            </button>
            <div class="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-center md:items-start gap-8">
                <img id="detail-product-image" src="" alt="Изображение видеокарты"
                     class="w-full md:w-1/2 h-auto object-cover rounded-md shadow-lg">
                <div class="flex-1">
                    <h2 id="detail-product-title" class="text-4xl font-bold mb-4"></h2>
                    <p id="detail-product-description" class="text-gray-300 text-lg mb-6"></p>
                    <p id="detail-product-price" class="text-3xl font-bold mb-6"></p>
                    <div class="flex space-x-4">
                        <button id="detail-add-to-cart-btn" class="btn-primary py-3 px-6 rounded-md text-xl font-semibold hover:opacity-90">
                            <i class="fas fa-shopping-cart mr-2"></i> В корзину
                        </button>
                        <button id="detail-add-to-favorites-btn" class="bg-gray-600 text-white py-3 px-6 rounded-md text-xl font-semibold hover:opacity-90">
                            <i class="fas fa-heart mr-2"></i> В избранное
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Cart Page -->
        <section id="cart" class="page-section mt-12">
            <h2 class="text-3xl font-bold mb-6">Корзина</h2>
            <div id="cart-items-container" class="bg-gray-800 p-6 rounded-lg shadow-lg">
                <p id="cart-empty-message" class="text-gray-400 text-center text-lg">Корзина пуста.</p>
            </div>
        </section>

        <!-- Favorites Page -->
        <section id="favorites" class="page-section mt-12">
            <h2 class="text-3xl font-bold mb-6">Избранное <i class="fas fa-heart text-red-500"></i></h2>
            <div id="favorites-items-container" class="bg-gray-800 p-6 rounded-lg shadow-lg">
                <p id="favorites-empty-message" class="text-gray-400 text-center text-lg">Избранное пусто.</p>
            </div>
        </section>

        <!-- Contact Page -->
        <section id="contact" class="page-section mt-12">
            <h2 class="text-3xl font-bold text-center mb-6">Свяжитесь с нами</h2>
            <div class="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto">
                <form id="feedback-form" method="POST" action="ajax.php">
                    <input type="hidden" name="form_type" value="feedback_form">
                    <div class="mb-4">
                        <label for="name" class="block text-white text-lg font-bold mb-2">Ваше имя:</label>
                        <input type="text" id="name" name="name" required
                               class="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div class="mb-4">
                        <label for="email" class="block text-white text-lg font-bold mb-2">Ваш Email:</label>
                        <input type="email" id="email" name="email" required
                               class="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div class="mb-6">
                        <label for="message" class="block text-white text-lg font-bold mb-2">Сообщение:</label>
                        <textarea id="message" name="message" rows="5" required
                                  class="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>
                    <button type="submit" class="btn-primary w-full py-3 rounded-md text-xl font-semibold hover:opacity-90">
                        Отправить сообщение
                    </button>
                </form>

                <div class="mt-8 text-center">
                    <button id="load-feedback-btn" class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                        <i class="fas fa-sync-alt mr-2"></i>Загрузить сообщения
                    </button>
                </div>

                <div id="feedback-messages-container" class="mt-6 space-y-4 text-white">
                    <p id="no-feedback-message" class="text-gray-400 text-center text-lg">Сообщения пока отсутствуют.</p>
                </div>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="bg-green-700 py-8 mt-auto">
        <div class="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-white">
            <div>
                <h3 class="text-xl font-bold mb-4">Социальные сети</h3>
                <ul class="space-y-2">
                    <li><a href="#" class="hover:text-gray-200 flex items-center"><i class="fab fa-vk mr-2"></i>Вконтакте</a></li>
                    <li><a href="#" class="hover:text-gray-200 flex items-center"><i class="fab fa-telegram-plane mr-2"></i>Телеграмм</a></li>
                </ul>
            </div>
            <div>
                <h3 class="text-xl font-bold mb-4">Контакты</h3>
                <p class="flex items-center"><i class="fas fa-phone mr-2"></i>+7999888777</p>
            </div>
            <div>
                <h3 class="text-xl font-bold mb-4">Адреса магазинов</h3>
                <p class="flex items-center"><i class="fas fa-map-marker-alt mr-2"></i>Ульяновск, Проспект 5</p>
            </div>
            <div>
                <h3 class="text-xl font-bold mb-4">Поддержка</h3>
                <ul class="space-y-2">
                    <li><a href="#" class="hover:text-gray-200 flex items-center"><i class="fas fa-robot mr-2"></i>Телеграмм Бот</a></li>
                    <li><a href="#" class="hover:text-gray-200 flex items-center"><i class="fas fa-question-circle mr-2"></i>Помощь покупателям</a></li>
                    <li><a href="#" class="hover:text-gray-200 flex items-center"><i class="fas fa-undo-alt mr-2"></i>Возврат</a></li>
                    <li><a href="#" class="hover:text-gray-200 flex items-center"><i class="fas fa-truck mr-2"></i>Отследить заказ</a></li>
                </ul>
            </div>
        </div>
    </footer>

    <!-- Модальное окно -->
    <div id="custom-modal" class="hidden fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div class="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full relative">
            <button onclick="hideModal()" class="absolute top-3 right-3 text-white text-2xl">&times;</button>
            <h3 id="modal-title" class="text-2xl font-bold mb-4 text-white"></h3>
            <p id="modal-message" class="text-gray-300 mb-6"></p>
            <button onclick="hideModal()" class="btn-primary w-full py-2 rounded-md">OK</button>
        </div>
    </div>

    <!-- Передача данных о продуктах из PHP в JS -->
    <script>
        window.allProductsData = <?= json_encode($products) ?>;
    </script>

    <!-- Подключение JS -->
    <script src="script.js"></script>
</body>
</html>