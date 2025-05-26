<?php
header('Content-Type: application/json');
require_once(__DIR__ . '/../db.php');

$sql = "SELECT id, nome, nazione FROM fornitori ORDER BY nome ASC";
$result = mysqli_query($conn, $sql);

$fornitori = array();

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $fornitori[] = $row;
    }
    echo json_encode($fornitori);
} else {
    echo json_encode(array("error" => "Errore nella query"));
}

mysqli_close($conn);
?>
