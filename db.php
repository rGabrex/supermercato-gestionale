<?php

$host = "localhost";
$user = "dariomoccia";       
$password = "pefforza"; 
$dbname = "supermercato";   

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die("Connessione fallita: " . $conn->connect_error);
}

?>
