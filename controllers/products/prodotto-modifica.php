<?php
header('Content-Type: application/json');
require_once(__DIR__ . '/../../db.php');
require_once(__DIR__ . '/../../utils/check-json.php');
require_once(__DIR__ . '/../../utils/check-fields.php');

$rawData = file_get_contents('php://input');
$input = json_decode($rawData, true);

$id = $input['id'];
$nome = $input['nome'];
$codice = $input['codice'];
$giacenza = $input['giacenza'];
$prezzo = $input['prezzo'];
$categoria = $input['categoria'];
$id_fornitore = $input['id_fornitore'];
$id_filiale = $input['id_filiale'];

$query = "UPDATE prodotti SET nome = ?, codice = ?, giacenza = ?, prezzo = ?, categoria = ?, id_fornitore = ?, id_filiale = ? WHERE id = ?";
$stmt = mysqli_prepare($conn, $query);

if (!$stmt) {
    echo json_encode(array(
        'success' => false,
        'error' => 'Errore nella preparazione della query: ' . mysqli_error($conn)
    ));
    exit;
}

mysqli_stmt_bind_param($stmt, 'ssidsiii', $nome, $codice, $giacenza, $prezzo, $categoria, $id_fornitore, $id_filiale, $id);
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
