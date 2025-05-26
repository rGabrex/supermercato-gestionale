<?php
header('Content-Type: application/json');
require_once(__DIR__ . '/../db.php');

$rawData = file_get_contents('php://input');
$input = json_decode($rawData, true);

if ($input === null || !is_array($input)) {
    echo json_encode(array(
        'success' => false,
        'error' => 'JSON non valido: ' . json_last_error_msg()
    ));
    exit;
}

if (!isset($input['nome'], $input['citta'], $input['paese'])) {
    echo json_encode(array(
        'success' => false,
        'error' => 'Alcuni dati sono mancanti: ' . json_last_error_msg()
    ));
    exit;
}

$nome = trim($input['nome']);
$citta = trim($input['citta']);
$paese = trim($input['paese']);

if ($nome === '' || $citta === '' || $paese === '') {
    echo json_encode(array(
        'success' => false,
        'error' => 'Tutti i campi sono obbligatori'
    ));
    exit;
}

$query = "INSERT INTO filiali (nome, citta, paese) VALUES (?, ?, ?)";
$stmt = mysqli_prepare($conn, $query);

if (!$stmt) {
    echo json_encode(array(
        'success' => false,
        'error' => 'Errore nella preparazione della query: ' . mysqli_error($conn)
    ));
    exit;
}

mysqli_stmt_bind_param($stmt, 'sss', $nome, $citta, $paese);
$result = mysqli_stmt_execute($stmt);

if ($result) {
    echo json_encode(array('success' => true));
} else {
    echo json_encode(array(
        'success' => false,
        'error' => 'Errore nel esecuzione della query: ' . mysqli_stmt_error($stmt)
    ));
}

mysqli_stmt_close($stmt);
mysqli_close($conn);

?>