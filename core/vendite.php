<?php
header('Content-Type: application/json');
require_once(__DIR__ . '/../db.php');

$sql = "SELECT id, id_cliente, id_prodotto, quantità, data_vendita, id_filiale, metodo_pagamento 
        FROM vendite 
        ORDER BY data_vendita DESC";

$result = mysqli_query($conn, $sql);

$vendite = array();

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $vendite[] = $row;
    }
    echo json_encode($vendite);
} else {
    echo json_encode(array("error" => "Errore nella query: " . mysqli_error($conn)));
}

mysqli_close($conn);
?>
