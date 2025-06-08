<?php
// ajax.php

// Подключаем скрипт для работы с базой данных
require_once 'script.php';

// Устанавливаем заголовок Content-Type для JSON ответа
header('Content-Type: application/json');

// --- Обработка POST-запроса (сохранение обратной связи) ---
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Проверяем, что запрос предназначен для формы обратной связи
    if (isset($_POST['form_type']) && $_POST['form_type'] === 'feedback_form') {
        $name = trim($_POST['name'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $message = trim($_POST['message'] ?? '');

        // Проверяем, что все обязательные поля заполнены
        if (!empty($name) && !empty($email) && !empty($message)) {
            // Дополнительно валидируем email
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                echo json_encode(['success' => false, 'message' => 'Некорректный email']);
                exit();
            }

            // Пытаемся сохранить данные в базу данных
            if (saveFeedback($name, $email, $message)) {
                echo json_encode(['success' => true, 'message' => 'Ваше сообщение успешно отправлено!']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Произошла ошибка при сохранении сообщения в базе данных.']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Пожалуйста, заполните все поля формы.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Неизвестный тип формы.']);
    }

// --- Обработка GET-запроса (получение списка сообщений) ---
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Проверяем, что запрос предназначен для получения сообщений
    if (isset($_GET['action']) && $_GET['action'] === 'get_feedback') {
        try {
            $pdo = connectDB();
            $stmt = $pdo->query("SELECT * FROM feedback ORDER BY submission_date DESC");
            $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode(['success' => true, 'messages' => $messages]);
        } catch (PDOException $e) {
            error_log("Ошибка получения сообщений: " . $e->getMessage());
            echo json_encode(['success' => false, 'message' => 'Не удалось загрузить сообщения.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Неизвестное действие GET-запроса.']);
    }

// --- Если метод не поддерживается ---
} else {
    echo json_encode(['success' => false, 'message' => 'Неподдерживаемый метод запроса.']);
}

exit(); // Важно завершить выполнение после отправки JSON-ответа