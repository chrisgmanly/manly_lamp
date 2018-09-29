<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1"><title>
	Demo Site - Make Transaction
</title><link href="websafe.css" rel="stylesheet" type="text/css" />
</head>
<body>
    
<?php include 'demotools.php'; ?>
<?php
$failed_login = 0;
if(isset($_POST)) {
    if(isset($_POST['OTP'])) {
        if($_POST['OTP'] == "7777777")   {
            $newtx =  "<tr><td>" . date('d/m/y H:i:s') . "</td>";
            $newtx .= "<td>" . $_POST['account'] . "</td>";
            $newtx .= "<td>" . $_POST['comment'] . "</td>";
            $newtx .= "<td>" . $_POST['amount'] . "</td></tr>\n";
            
            file_put_contents('./transactions.txt', $newtx, FILE_APPEND);

            header("Location: Home.php");
            exit;
        } else {
            $failed_login = 1;
        }
    }
}
?>


<center>
<div id="mainmenu" align="center">
<h2><a href="Home.php">Transactions</a> | Make Transaction | <a href="Logout.php">Logout</a></h2>
</div>    
    

<div id="login-box">
<h2>Make Transaction</h2>
<form name="MakeTransaction" method="post" action="" autocomplete="off">
<?php
    if($failed_login) {
        print '<h3 style="color: #FF0000; font-weight:bold">Incorrect OTP</h3>';
    }
?>
<div id="login-box-name" style="margin-top:20px;">Account:</div><div id="login-box-field" style="margin-top:20px;"><input name="account" class="form-login" title="account"  autocomplete="off" value="" size="30" maxlength="2048" /></div>
<div id="login-box-name">Comment:</div><div id="login-box-field"><input name="comment" class="form-login" title="comment"  autocomplete="off" value="" size="30" maxlength="2048" /></div>
<div id="login-box-name">Amount:</div><div id="login-box-field"><input name="amount" class="form-login" title="amount"  autocomplete="off" value="" size="30" maxlength="2048" /></div>
<div id="login-box-name">OTP:</div><div id="login-box-field"><input name="OTP"  autocomplete="off" type="password" class="form-login" title="OTP - Hint: 7777777" value="" size="30" maxlength="2048" /></div>
<br />

<input name="maketx" type="submit" value="Submit"/>
</form>

</div>
 </center> 
 <div style="margin-left: auto; margin-right: auto" align="center">
    <br>
    <br>
    <br>
    <img src="images/f5.png" height="5%" width="5%" style="opacity:0.4;filter:alpha(opacity=40);">
</div>
</body>
</html>
