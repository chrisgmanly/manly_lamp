<?php

if(!array_key_exists ("name", $_GET) || $_GET['name'] == NULL || $_GET['name'] == ''){

 $isempty = true;

} else {
		
 $html .= '<br><b><font size=3>Display Text:</b><br><table width=100%><tr><td>';
 $html .= ''. $_GET['name'];
 $html .= '</font></td></tr></table>';
	
}

?>