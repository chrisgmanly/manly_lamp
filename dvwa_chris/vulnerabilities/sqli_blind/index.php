<?php

define( 'DVWA_WEB_PAGE_TO_ROOT', '../../' );
require_once DVWA_WEB_PAGE_TO_ROOT.'dvwa/includes/dvwaPage.inc.php';

dvwaPageStartup( array( 'authenticated', 'phpids' ) );

$page = dvwaPageNewGrab();
$page[ 'title' ] .= $page[ 'title_separator' ].'Vulnerability: SQL Injection (Blind)';
$page[ 'page_id' ] = 'sqli_blind';

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

require_once DVWA_WEB_PAGE_TO_ROOT."vulnerabilities/sqli_blind/source/{$vulnerabilityFile}";

$page[ 'help_button' ] = 'sqli_blind';
$page[ 'source_button' ] = 'sqli_blind';

$magicQuotesWarningHtml = '';

// Check if Magic Quotes are on or off
if( ini_get( 'magic_quotes_gpc' ) == true ) {
	$magicQuotesWarningHtml = "	<div class=\"warning\">Magic Quotes are on, you will not be able to inject SQL.</div>";
}

$page[ 'body' ] .= "
<div class=\"body_padded\">
	<h1>Vulnerability: SQL Injection (Blind)</h1>

	{$magicQuotesWarningHtml}

	<div class=\"vulnerable_code_area\">

		<h3>User ID:</h3>

		<form action=\"#\" method=\"GET\">
			<input type=\"text\" name=\"id\" size=\"65\">
			<input type=\"submit\" name=\"Submit\" value=\"Submit\">
		</form>

		{$html}

	</div>
</div>
";

dvwaHtmlEcho( $page );

?>
