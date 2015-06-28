<?php
/**
 * @package militant-moderates-css-parent-selector-mmps
 * @version 1.1.4
 */
/*
Plugin Name: Militant Moderates CSS Parent Selector MMPS
Plugin URI: http://www.militantmoderates.org/mmps-quick-start/
Description: Adds CSS "Parent Selector" support to your Theme. Apply your CSS Style to Parent/Sibling elements not just the Selected element.
Version: 1.1.4
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

if (!defined('ABSPATH')) die ('No direct access allowed');

/*
 * Define constant that controls which version of the JavaScript is loaded
 *
 * MMPS_SCRIPT_DEV : 0, 1, or 2
 *	0 = All debugging stripped, minified - Use this for distribution release
 *	1 = All debugging stripped but NOT minified
 *	2 = Includes all debugging and NOT minified - NOT included in distribution release
 *-------------------------------------------------------------------------------------*/
define( 'MMPS_SCRIPT_DEV', 0 );						// set as above: 0, 1, 2
define( 'MMPS_SCRIPT_VERSION', '1.1.4' );			// set to script version number as in header

function mmps_js() {
	// This enqueues the Javascript code that supports the enhanced Parent Selector
	// functionality that allows modification of a Parent Element's attributes using
	// pure CSS rules. Depends on jQuery.
	
	// If DEBUG mode is selected and the current user has capability to activate plugins ..
	// AND the .dev.js full debug version is available then ...
	if ( MMPS_SCRIPT_DEV == 2 && current_user_can( 'activate_plugins' ) && 
				file_exists( plugin_dir_path( __FILE__ ) . 'js/mmParentSelector.dev.js' ) ) {
		// the .dev.js version is the working copy with full debugging included
		// it is NOT included in the standard distribution, so protect against attempts to use it
		wp_enqueue_script( 'mmps_js', plugins_url( 'js/mmParentSelector.dev.js', __FILE__ ), array( 'jquery' ), MMPS_SCRIPT_VERSION );

	} elseif ( MMPS_SCRIPT_DEV != 1 ) {
		// Either in full DEBUG mode but not allowed (not an admin) or FULL version NOT specified explicitly ...
		// the .min.js version is stripped of all debugging code and minified
		wp_enqueue_script( 'mmps_js', plugins_url( 'js/mmParentSelector.min.js', __FILE__ ), array( 'jquery' ), MMPS_SCRIPT_VERSION );

	} else {
		// the .js version is stripped of debugging but is NOT minified
		wp_enqueue_script( 'mmps_js', plugins_url( 'js/mmParentSelector.js', __FILE__ ), array( 'jquery' ), MMPS_SCRIPT_VERSION );

	}

	if ( file_exists( plugin_dir_path( __FILE__ ) . 'js/mmParentSelector.dev.js' ) &&
		 file_exists( plugin_dir_path( __FILE__ ) . 'css/mmParentSelector.css' ) )
		wp_enqueue_style( 'mmps_js', plugins_url( 'css/mmParentSelector.css', __FILE__ ) );
}

add_action( 'wp_enqueue_scripts', 'mmps_js' );

?>
