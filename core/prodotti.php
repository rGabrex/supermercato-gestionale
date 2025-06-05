<?php
header('Content-Type: application/json');
require_once(__DIR__ . '/../db.php');

$sql = "
    SELECT 
        p.id, 
        p.nome, 
        p.codice, 
        p.giacenza, 
        p.prezzo, 
        p.categoria, 
        p.id_fornitore, 
        p.id_filiale,
        f.nome AS nome_fornitore,
        fi.nome AS nome_filiale
    FROM prodotti p
    LEFT JOIN fornitori f ON p.id_fornitore = f.id
    LEFT JOIN filiali fi ON p.id_filiale = fi.id
    ORDER BY p.nome ASC
";

$result = mysqli_query($conn, $sql);

$prodotti = array();

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $prodotti[] = $row;
    }
    echo json_encode($prodotti);
} else {
    echo json_encode(array("error" => "Errore nella query: " . mysqli_error($conn)));
}

mysqli_close($conn);
?>
