-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Хост: MySQL-8.4
-- Время создания: Июн 11 2025 г., 00:42
-- Версия сервера: 8.4.4
-- Версия PHP: 8.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `videocards_db`
--

-- --------------------------------------------------------

--
-- Структура таблицы `feedback`
--

CREATE TABLE `feedback` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `submission_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `feedback`
--

INSERT INTO `feedback` (`id`, `name`, `email`, `message`, `submission_date`) VALUES
(1, 'AleksanderChernyshev', 'chernysheva73@yandex.ru', 'еку', '2025-06-05 14:57:15'),
(2, 'AleksanderChernyshev', 'chernysheva73@yandex.ru', 'еку', '2025-06-05 14:57:15'),
(3, 'AleksanderChernyshev', 'chernysheva73@yandex.ru', 'еку', '2025-06-05 19:41:59'),
(4, 'AleksanderChernyshev', 'verycoolcoop@gmail.com', 'пкуеку', '2025-06-06 16:28:49'),
(5, 'AleksanderChernyshev', 'verycoolcoop@gmail.com', 'пкуеку', '2025-06-08 22:11:29'),
(6, 'AleksanderChernyshev', 'verycoolcoop@gmail.com', 'T4', '2025-06-10 20:41:18');

-- --------------------------------------------------------

--
-- Структура таблицы `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `category` varchar(255) NOT NULL,
  `price` int NOT NULL,
  `memory` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `image_url` text NOT NULL,
  `thumbnail_url` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `products`
--

INSERT INTO `products` (`id`, `category`, `price`, `memory`, `title`, `description`, `image_url`, `thumbnail_url`) VALUES
(1, 'nvidia', 259999, 24, 'Видеокарта NVIDIA GeForce RTX 4090', 'Видеочипсет NVIDIA GTX 4000, 2235 МГц (12530 МГц в режиме Восст.); Память 24 ГБ GDDR6X, 21000 МГц; Интерфейс PCI-E 4.0', 'images/RTX4090.2.png', 'images/RTX4090.png'),
(2, 'nvidia', 35000, 6, 'Видеокарта NVIDIA GeForce GTX 1660', 'Видеочипсет NVIDIA GTX 1660, 1530 МГц (1830 МГц в режиме Восст.); Память 6 ГБ GDDR5, 8000 МГц; Интерфейс PCI-E 3.0', 'images/GTX1660S.png', 'images/GTX1660S.2.png'),
(3, 'nvidia', 75000, 10, 'Видеокарта NVIDIA GeForce RTX 3080', 'Видеочипсет NVIDIA GTX 3080, 1440 МГц (1710 МГц в режиме Восст.); Память 10 ГБ GDDR6X, 19000 МГц; Интерфейс PCI-E 4.0', 'images/RTX3060TI.png', 'images/RTX3060TI.png'),
(4, 'amd', 180000, 16, 'Видеокарта AMD Radeon RX 7800 XT', 'Видеочипсет AMD RX 7800 XT, 2210 МГц; Память 16 ГБ GDDR6, 19.5 Гбит/с; Интерфейс PCI-E 4.0', 'images/RX7900.png', 'images/RX7900.png'),
(5, 'intel', 50000, 8, 'Видеокарта Intel Arc A770', 'Видеочипсет Intel Arc A770, 2100 МГц; Память 8 ГБ GDDR6, 16 Гбит/с; Интерфейс PCI-E 4.0', 'images/IntelArcA380.png', 'images/intelarca770.webp');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT для таблицы `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
