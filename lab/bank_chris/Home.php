<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Demo Site - Transactions</title>
    <link href="websafe.css" rel="stylesheet" type="text/css" />
</head>
<body>

<?php include 'demotools.php'; ?>

<?php
    if(isset($_GET["cleartrans"])) {
        file_put_contents('./transactions.txt', "");
        header("Location: Home.php");
        exit;
 }
?>

<div id="mainmenu" align="center">
    <h2>Transactions | <a href="MakeTransaction.php">Make Transaction</a> | <a href="Logout.php">Logout</a></h2>
</div>

<br />
<br />

<table border="1" align="center" class="gridtable">
    <tr align="center">
        <th>Date</th>
        <th>Account</th>
        <th>Comment</th>
        <th>Amount</th>
    </tr>
<?php
$file = file_get_contents('./transactions.txt', FILE_USE_INCLUDE_PATH);
echo $file;
?>
</table>
</center> 

<div style="margin-left: auto; margin-right: auto" align="center">
    <br>
    <br>
    <br>
    <img src="images/f5.png" height="5%" width="5%" style="opacity:0.4;filter:alpha(opacity=40);">
    <br>
    <a href="Home.php?cleartrans" style="color: #f0f0f0">Clear Transactions</a>
</div>
</body>
</html>
