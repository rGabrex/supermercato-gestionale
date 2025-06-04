<?php
header('Content-Type: application/json');
require_once(__DIR__ . '/../db.php');

$sql = "SELECT id, nome, cognome, email, data_nascita FROM clienti ORDER BY cognome ASC";
$result =  mysqli_query($conn, $sql);

$clienti = array();

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $clienti[] = $row;
    }
    echo json_encode($clienti);
} else {
    echo json_encode(array("error" => "Errore nella query"));
}

mysqli_close($conn);

?>