<!DOCTYPE html>
<html>
<body>
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
    <title>F5 WebSafe Demo Site</title>
    <link href="websafe.css" rel="stylesheet" type="text/css" />
</head>

<?php include 'demotools.php'; ?>

<?php
$failed_login = 0;
if(isset($_POST['username'])) {
    if(isset($_POST['username']) && isset($_POST['password'])) {
        if(($_POST['username'] == "user") && ($_POST['password'] == "12345678"))   {
            $failed_login = 0;
            header("Location: Home.php");
            exit;
        } else {
            $failed_login = 1;
        }
    }
}
?>

<center>
<div id="login-box">
    <div class="splitter"></div>
        <H2>Demo Site</H2>
        <H3>Protected</H3>
        
        <?php
            if($failed_login) {
                print '<h3 style="color:lightred;font-weight:bold">Wrong Username or Password</h3>';
            }
        ?>
        <h3 style="color:lightred;font-weight:bold"></h3>
    
        <form name="login" method="post" action="" autocomplete="off">

        <div id="login-box-name" style="margin-top:20px;">Username:</div><div id="login-box-field" style="margin-top:20px;"><input name="username" class="form-login" title="Username - Hint: user"  autocomplete="off" value="" size="30" maxlength="2048" /></div>
        <div id="login-box-name">Password:</div><div id="login-box-field">
            <input name="password" id="txtPassword" autocomplete="off" type="password" class="form-login-protected" title="Password - Hint: 12345678" value="" size="30" maxlength="2048" />
        </div>
        <br />

        <input type="image" src="images/login-btn.png" name="submit" value="Submit" width="103" height="42">
	</form>
</div>
</div>

<img src="images/f5.png" height="5%" width="5%" style="opacity:0.4;filter:alpha(opacity=40);">
</body>
</html>
