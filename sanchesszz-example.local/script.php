<?php

$dbHost = 'MySQL-8.4'; // Хост (по умолчанию localhost)
$dbPort = '3306';
$dbName = 'videocards_db';
$dbUser = 'root';
$dbPassword = '';

function connectDB() {
    global $dbHost, $dbPort, $dbName, $dbUser, $dbPassword;
    try {
        $dsn = "mysql:host=$dbHost;port=$dbPort;dbname=$dbName;charset=utf8mb4";
        $pdo = new PDO($dsn, $dbUser, $dbPassword);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        error_log("Ошибка подключения к БД: " . $e->getMessage());
        throw new Exception("Не удалось подключиться к базе данных");
    }
}

function getProducts() {
    try {
        $pdo = connectDB();
        $stmt = $pdo->query("SELECT * FROM products ORDER BY id ASC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        return [];
    }
}

function saveFeedback($name, $email, $message) {
    try {
        $pdo = connectDB();
        $stmt = $pdo->prepare("INSERT INTO feedback (name, email, message) VALUES (?, ?, ?)");
        return $stmt->execute([$name, $email, $message]);
    } catch (Exception $e) {
        error_log("Error saving feedback: " . $e->getMessage());
        return false;
    }
}

function getFeedbackMessages() {
    try {
        $pdo = connectDB();
        $stmt = $pdo->query("SELECT id, name, email, message, submission_date FROM feedback ORDER BY submission_date DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        error_log("Error getting feedback messages: " . $e->getMessage());
        return [];
    }
}
?>