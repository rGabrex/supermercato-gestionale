<?php
header('Content-Type: application/json');
require_once(__DIR__ . '/../db.php');

$sql = "SELECT id, nome, citta, paese FROM filiali ORDER BY nome ASC";
$result = mysqli_query($conn, $sql);

$filiali = array();

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $filiali[] = $row;
    }
    echo json_encode($filiali);
} else {
    echo json_encode(array("error" => "Errore nella query"));
}

mysqli_close($conn);
?>
