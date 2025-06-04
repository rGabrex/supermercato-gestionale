<?php
function getJsonInput() {
    $rawData = file_get_contents('php://input');
    $input = json_decode($rawData, true);

    if ($input === null || !is_array($input)) {
        echo json_encode(array(
            'success' => false,
            'error' => 'Input JSON non valido' . json_last_error_msg()
        ));
        exit;
    }

    return $input;
}
?>