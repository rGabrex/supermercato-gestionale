<?php
header('Content-Type: application/json');
require_once 'db.php';

$rawData = file_get_contents('php://input');
$input = json_decode($rawData, true);

if (!is_array($input) || !isset($input['id'])) {
    echo json_encode(array(
        'success' => false,
        'error' => 'Dati non validi'
    ));
    exit;
}

$id = intval($input['id']);

$query = "DELETE FROM filiali WHERE id = ?";
$stmt = mysqli_prepare($conn, $query);

if (!$stmt) {
    echo json_encode(array(
        'success' => false,
        'error' => 'Errore nella preparazione della query: ' . mysqli_error($conn)
    ));
    exit;
}

mysqli_stmt_bind_param($stmt, 'i', $id);
$esecuzione = mysqli_stmt_execute($stmt);

if ($esecuzione) {
    echo json_encode(array('success' => true));
} else {
    echo json_encode(array(
        'success' => false,
        'error' => 'Errore durante esecuzione: ' . mysqli_stmt_error($stmt)
    ));
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
