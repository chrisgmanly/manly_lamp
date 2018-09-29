<?php

define( 'DVWA_WEB_PAGE_TO_ROOT', '' );

require_once DVWA_WEB_PAGE_TO_ROOT.'dvwa/includes/dvwaPage.inc.php';

dvwaPageStartup( array( 'authenticated', 'phpids' ) );

$page = dvwaPageNewGrab();

$page[ 'title' ] .= $page[ 'title_separator' ].'Welcome';

$page[ 'page_id' ] = 'home';

$page[ 'body' ] .= "

<div class=\"body_padded\">

	<h1>Welcome to Damn Vulnerable Web App!</h1>

	<p>Damn Vulnerable Web App (DVWA) is a PHP/MySQL web application that is damn vulnerable. Its main goals are to be an aid for security professionals to test their skills and tools in a legal environment, help web developers better understand the processes of securing web applications and aid teachers/students to teach/learn web application security in a class room environment.</p>

		<h2> WARNING! </h2>

		<p>Damn Vulnerable Web App is damn vulnerable! Do not upload it to your hosting provider's public html folder or any internet facing web server as it will be compromised. We recommend downloading and installing ".dvwaExternalLinkUrlGet( 'http://www.apachefriends.org/en/xampp.html','XAMPP' )." onto a local machine inside your LAN which is used solely for testing.</p>

	<h2>Our Users</h2>
	<table>
	<tr>
	<td valign=top><img src=\"".DVWA_WEB_PAGE_TO_ROOT."hackable/users/bobsmith.jpg\" /><br>Bob Smith</td>
	<td valign=top><img src=\"".DVWA_WEB_PAGE_TO_ROOT."hackable/users/fred.gif\" /><br>Fred Jones</td>
	<td valign=top><img src=\"".DVWA_WEB_PAGE_TO_ROOT."hackable/users/juliemiller.jpg\" /><br>Julie Miller</td>
	<td valign=top><img src=\"".DVWA_WEB_PAGE_TO_ROOT."hackable/users/locoh-donou.jpg\" /><br>François L</td>
	<td valign=top><img src=\"".DVWA_WEB_PAGE_TO_ROOT."hackable/users/chris.gif\" /><br>Manly</td>
	</tr></table><br/>

	<h2>User Policy</h2>
	<p>View our <a href=\"".DVWA_WEB_PAGE_TO_ROOT."userpolicy.html\">user policy</a> that all users must adhere to.</p></br>
	<h2>DVWA Documentation</h2>
	<p>View documentation for this web site in this <a href=\"".DVWA_WEB_PAGE_TO_ROOT."/docs/DVWA_v1.3.pdf\">PDF file</a>.</p>

</div>";


dvwaHtmlEcho( $page );

?>