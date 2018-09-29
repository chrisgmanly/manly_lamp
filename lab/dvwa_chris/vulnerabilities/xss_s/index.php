<?php

define( 'DVWA_WEB_PAGE_TO_ROOT', '../../' );
require_once DVWA_WEB_PAGE_TO_ROOT.'dvwa/includes/dvwaPage.inc.php';

dvwaPageStartup( array( 'authenticated', 'phpids' ) );

$page = dvwaPageNewGrab();
$page[ 'title' ] .= $page[ 'title_separator' ].'Vulnerability: Stored Cross Site Scripting (XSS)';
$page[ 'page_id' ] = 'xss_s';

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

require_once DVWA_WEB_PAGE_TO_ROOT."vulnerabilities/xss_s/source/{$vulnerabilityFile}";

$page[ 'help_button' ] = 'xss_s';
$page[ 'source_button' ] = 'xss_s';

$page[ 'body' ] .= "
<div class=\"body_padded\">
	<h1>Vulnerability: Stored Cross Site Scripting (XSS)</h1>

	<div class=\"vulnerable_code_area\">

		<form method=\"post\" name=\"guestform\" onsubmit=\"return validate_form(this)\">
		<table width=\"550\" border=\"0\" cellpadding=\"2\" cellspacing=\"1\">
		<tr>
		<td width=\"100\">Headline</td> <td>
		<input name=\"txtName\" type=\"text\" size=\"65\"></td>
		</tr>
		<tr>
		<td width=\"100\">Review</td> <td>
		<textarea name=\"mtxMessage\" cols=\"65\" rows=\"6\"></textarea></td>
		</tr>
		<tr>
		<td width=\"100\">&nbsp;</td>
		<td>
		<input name=\"btnSign\" type=\"submit\" value=\"Submit Review\" onClick=\"return checkForm();\"></td>
		</tr>
		</table>
		</form>

		{$html}
		
	</div>
	
	<br />
	
	".dvwaGuestbook()."
	<br />
</div>
";


dvwaHtmlEcho( $page );
?>
