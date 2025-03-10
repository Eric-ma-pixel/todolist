<?php
/*include 'config.php';

$sql = "SELECT* FROM produits";
$result = $conn->query($sql);

$produits = [];
while ($row = $result-> fetch_assoc()){
$produits[] = $row;
}

header('content-Type: application/json');
echo json_encode($produits);

?>