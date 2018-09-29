<?php

define( 'DVWA_WEB_PAGE_TO_ROOT', '../../' );
require_once DVWA_WEB_PAGE_TO_ROOT.'dvwa/includes/dvwaPage.inc.php';

dvwaPageStartup( array( 'authenticated', 'phpids' ) );

$page = dvwaPageNewGrab();
$page[ 'title' ] .= $page[ 'title_separator' ].'Vulnerability: Brute Force';
$page[ 'page_id' ] = 'exec';

dvwaDatabaseConnect();

$vulnerabilityFile = '';
switch( $_COOKIE[ 'security' ] ) {
	case 'low':
		$vulnerabilityFile = 'low.php';
		break;

	case 'medium':
		$vulnerabilityFile = 'medium.php';
		break;

	case 'high':
	default:
		$vulnerabilityFile = 'high.php';
		break;
}

require_once DVWA_WEB_PAGE_TO_ROOT."vulnerabilities/exec/source/{$vulnerabilityFile}";

$page[ 'help_button' ] = 'exec';
$page[ 'source_button' ] = 'exec';

$page[ 'body' ] .= "
<div class=\"body_padded\">
	<h1>Vulnerability: Command Execution</h1>

	<div class=\"vulnerable_code_area\">

		<h2>Ping for FREE</h2>

		<p>Enter an IP address below:</p>
		<form name=\"ping\" action=\"#\" method=\"post\">
			<input type=\"text\" name=\"ip\" size=\"30\">
			<input type=\"submit\" value=\"Submit\" name=\"submit\">
		</form>

		{$html}

	</div>
</div>
";

dvwaHtmlEcho( $page );

?>