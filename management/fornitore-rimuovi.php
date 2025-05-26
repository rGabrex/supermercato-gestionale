<?php
header('Content-Type: application/json');
require_once(__DIR__ . '/../db.php');

$rawData = file_get_contents('php://input'); // Prendo i dati grezzi dal POST del JS
$input = json_decode($rawData, true); // Li converto in JSON

if ($input === null && json_last_error() !== JSON_ERROR_NONE) { // Controllo errori nel decoding del JSON
    echo json_encode(array(
        'success' => false,
        'error' => 'JSON non valido: ' . json_last_error_msg()
    ));
    exit; 
}

if (!isset($input['id'])) { // Controllo l'effettiva presenza del ID
    echo json_encode(array(
        'success' => false,
        'error' => 'ID fornitore mancante'
    ));

    exit;
}

$id = $input['id']; 
$query = "DELETE FROM fornitori WHERE id = ?";
$stmt = mysqli_prepare($conn, $query);

if (!$stmt) { // Controllo errori nella preparazione della query
    echo json_encode(array(
        'success' => false,
        'error' => 'Errore nella preparazione della query: ' . mysqli_error($conn)
    ));
    exit;
}

mysqli_stmt_bind_param($stmt, 'i', $id); // Associo il parametro ID alla query
$result = mysqli_stmt_execute($stmt); // Eseguo la query

if ($result) {
    echo json_encode(array('success' => true));
} else {
    echo json_encode(array(
        'success' => false,
        'error' => 'Errore nel esecuzione: ' . mysqli_stmt_error($stmt)
    ));
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>