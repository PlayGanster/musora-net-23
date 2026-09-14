<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.html');
    exit;
}

$name    = trim($_POST['name'] ?? '');
$phone   = trim($_POST['phone'] ?? '');
$service = trim($_POST['service'] ?? '');
$message = trim($_POST['message'] ?? '');
$page    = trim($_POST['page'] ?? 'Неизвестная страница');

if ($name === '' || $phone === '') {
    header('Location: index.html?error=1');
    exit;
}

$to      = 'emanuilov.a2006@gmail.com';
$subject = "Новая заявка с сайта — {$service}";

$body  = "Новая заявка с сайта Мусора Нет 23\n\n";
$body .= "Имя: {$name}\n";
$body .= "Телефон: {$phone}\n";
$body .= "Услуга: {$service}\n";
$body .= "Описание: {$message}\n";
$body .= "Страница: {$page}\n\n";
$body .= "Дата: " . date('d.m.Y H:i') . "\n";
$body .= "IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'Неизвестен') . "\n";

$headers  = "From: noreply@musora-net23.ru\r\n";
$headers .= "Reply-To: {$name} <{$phone}>\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

@mail($to, $subject, $body, $headers);

header('Location: thank-you.html');
exit;
