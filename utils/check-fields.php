<?php
function validateFields($input, $requiredFields = array()) {
    foreach ($requiredFields as $field) {
        if (!isset($input[$field]) || trim($input[$field]) === '') {
            echo json_encode(array(
                'success' => false,
                'error' => "Il campo e' mancante o vuoto: $field"
            ));
            exit;
        }
    }
}

?>