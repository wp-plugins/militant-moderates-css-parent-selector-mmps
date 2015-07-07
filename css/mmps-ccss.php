<?php
/**
 * @package militant-moderates-css-parent-selector-mmps
 * @version 1.2.2
 */
/*
Plugin Name: Militant Moderates CSS Parent Selector MMPS
Plugin URI: http://www.militantmoderates.org/mmps-quick-start/
Description: Adds CSS "Parent Selector" support to your Theme. Apply your CSS Style to Parent/Sibling elements not just the Selected element.
Version: 1.2.2
Text Domain: militant-moderates-css-parent-selector-mmps
Domain Path: /languages
Author: MM Techmaster
Author URI: https://profiles.wordpress.org/mmtechmaster
License URI: https://www.gnu.org/licenses/gpl-2.0.html
License: GPL2
 
{Plugin Name} is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 2 of the License, or
any later version.
 
{Plugin Name} is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.
 
You should have received a copy of the GNU General Public License
along with {Plugin Name}. If not, see {License URI}.
*/

header("Content-type: text/css");
$mmps_ccss = get_option('mmpsccss_settings');
$mmps_ccss = wp_kses( $mmps_ccss['mmps_ccss_main_style'], array( '\'', '\"' ) );
$mmps_ccss = str_replace ( array( '&gt;', '&lt;' ), array( '>', '<' ), $mmps_ccss );
echo '
/* START Militant Moderates Parent Selector MMPS v' . MMPS_SCRIPT_VERSION . ' | http://www.militantmoderates.org/mmps-quick-start/ */
' . $mmps_ccss . '
/* END MMPS */
';
?>