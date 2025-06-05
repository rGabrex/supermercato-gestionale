<?php
header('Content-Type: application/json');
require_once(__DIR__ . '/../../db.php');
require_once(__DIR__ . '/../../utils/check-json.php');
require_once(__DIR__ . '/../../utils/check-fields.php');

$rawData = file_get_contents('php://input');
$input = json_decode($rawData, true);

$nome = trim($input['nome']);
$codice = trim($input['codice']);
$giacenza = (int)$input['giacenza'];
$prezzo = (float)$input['prezzo'];
$categoria = isset($input['categoria']) ? trim($input['categoria']) : null;
$id_fornitore = isset($input['id_fornitore']) ? (int)$input['id_fornitore'] : null;
$id_filiale = isset($input['id_filiale']) ? (int)$input['id_filiale'] : null;

$query = "INSERT INTO prodotti (nome, codice, giacenza, prezzo, categoria, id_fornitore, id_filiale) VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = mysqli_prepare($conn, $query);

if (!$stmt) {
    echo json_encode(array(
        'success' => false,
        'error' => 'Errore nella preparazione della query: ' . mysqli_error($conn)
    ));
    exit;
}

mysqli_stmt_bind_param($stmt, 'ssidsii', $nome, $codice, $giacenza, $prezzo, $categoria, $id_fornitore, $id_filiale);
$result = mysqli_stmt_execute($stmt);

if ($result) {
    echo json_encode(array('success' => true));
} else {
    echo json_encode(array(
        'success' => false,
        'error' => 'Errore nell\'esecuzione della query: ' . mysqli_stmt_error($stmt)
    ));
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>
