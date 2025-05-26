<?php
header('Content-Type: application/json');
require_once(__DIR__ . '/../db.php');

$rawData = file_get_contents('php://input');
$input = json_decode($rawData, true);

if ($input === null || !isset($input['id']) || !isset($input['nome']) || !isset($input['citta']) || !isset($input['paese'])) {
    echo json_encode(array(
        'success' => false,
        'error' => 'Dati invalidi o incompleti: ' . json_last_error_msg()
    ));
    exit;
}

$id = $input['id'];
$nome = $input['nome'];
$citta = $input['citta'];
$paese = $input['paese'];

$query = 'UPDATE filiali SET nome = ?, citta = ?, paese = ? WHERE id = ?';
$stmt = mysqli_prepare($conn, $query);

if (!$stmt) {
    echo json_encode(array(
        'success' => false,
        'error' => 'Errore nella preparazione della query: ' . mysqli_error($conn)
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
        'error' => 'Errore nel esecuzione della query: ' . mysqli_stmt_error($stmt)
    ));
}

mysqli_stmt_close($stmt);
mysqli_close($conn);

?>