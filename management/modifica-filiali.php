<?php
header('Content-Type: application/json');
ob_start();

require_once 'db.php';

$rawData = file_get_contents('php://input');
$input = json_decode($rawData, true);

$output = ob_get_clean();

if ($input === null && json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(array(
        'success' => false,
        'error' => 'JSON non valido: ' . json_last_error_msg(),
        'received_raw' => $rawData,
        'output_buffer' => $output
    ));
    exit;
}

if (!isset($input['id'], $input['nome'], $input['citta'], $input['paese'])) {
    echo json_encode(array(
        'success' => false,
        'error' => 'Mancano campi obbligatori',
        'received_raw' => $rawData,
        'output_buffer' => $output
    ));
    exit;
}

$id = intval($input['id']);
$nome = trim($input['nome']);
$citta = trim($input['citta']);
$paese = trim($input['paese']);

if ($id <= 0 || empty($nome) || empty($citta) || empty($paese)) {
    echo json_encode(array(
        'success' => false,
        'error' => 'Campi non validi o vuoti',
        'received_raw' => $rawData,
        'output_buffer' => $output
    ));
    exit;
}

$query = "UPDATE filiali SET nome = ?, citta = ?, paese = ? WHERE id = ?";
$stmt = mysqli_prepare($conn, $query);

if (!$stmt) {
    echo json_encode(array(
        'success' => false,
        'error' => 'Errore nella preparazione della query: ' . mysqli_error($conn),
        'received_raw' => $rawData,
        'output_buffer' => $output
    ));
    exit;
}

mysqli_stmt_bind_param($stmt, 'sssi', $nome, $citta, $paese, $id);

$result = mysqli_stmt_execute($stmt);

if ($result) {
    echo json_encode(array('success' => true));
} else {
    echo json_encode(array(
        'success' => false,
        'error' => 'Errore nell\'update: ' . mysqli_stmt_error($stmt),
        'received_raw' => $rawData,
        'output_buffer' => $output
    ));
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
exit;
