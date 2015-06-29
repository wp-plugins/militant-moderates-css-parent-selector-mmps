<?php
/**
 * @package militant-moderates-css-parent-selector-mmps
 * @version 1.2.0
 */
/*
Plugin Name: Militant Moderates CSS Parent Selector MMPS
Plugin URI: http://www.militantmoderates.org/mmps-quick-start/
Description: Adds CSS "Parent Selector" support to your Theme. Apply your CSS Style to Parent/Sibling elements not just the Selected element.
Version: 1.2.0
Text Domain: militant-moderates-css-parent-selector-mmps
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
define( 'MMPS_SCRIPT_VERSION', '1.2.0' );			// set to script version number as in header

define( 'MMPS_SCRIPT_SLUG', 'militant-moderates-css-parent-selector-mmps' );

function mmps_js() {
	// This enqueues the Javascript code that supports the enhanced Parent Selector
	// functionality that allows modification of a Parent Element's attributes using
	// pure CSS rules. Depends on jQuery.
	
	// Here's where we get funky. The script version number is used to piggyback the option settings
	// that control which sources of CSS will be parsed and which will be ignored.
	// If the option to
	$mmps_ver = '';
	$mmps_ccss = get_option('mmpsccss_settings');
	if ( !isset( $mmps_ccss[ 'mmps_ccss_parse_external' ] ) )
		$mmps_ver .= 'X';
	if ( !isset( $mmps_ccss[ 'mmps_ccss_parse_inline' ] ) )
		$mmps_ver .= 'I';
	$mmps_ver = MMPS_SCRIPT_VERSION . ( $mmps_ver != '' ? '+' . $mmps_ver : '' );

	// If DEBUG mode is selected and the current user has capability to activate plugins ..
	// AND the .dev.js full debug version is available then ...
	if ( MMPS_SCRIPT_DEV == 2 && current_user_can( 'activate_plugins' ) && 
				file_exists( plugin_dir_path( __FILE__ ) . 'js/mmParentSelector.dev.js' ) ) {
		// the .dev.js version is the working copy with full debugging included
		// it is NOT included in the standard distribution, so protect against attempts to use it
		wp_enqueue_script( 'mmps_js', plugins_url( 'js/mmParentSelector.dev.js', __FILE__ ), array( 'jquery' ), $mmps_ver );

	} elseif ( MMPS_SCRIPT_DEV != 1 ) {
		// Either in full DEBUG mode but not allowed (not an admin) or FULL version NOT specified explicitly ...
		// the .min.js version is stripped of all debugging code and minified
		wp_enqueue_script( 'mmps_js', plugins_url( 'js/mmParentSelector.min.js', __FILE__ ), array( 'jquery' ), $mmps_ver );

	} else {
		// the .js version is stripped of debugging but is NOT minified
		wp_enqueue_script( 'mmps_js', plugins_url( 'js/mmParentSelector.js', __FILE__ ), array( 'jquery' ), $mmps_ver );

	}
}

add_action( 'wp_enqueue_scripts', 'mmps_js' );

if(!class_exists('MMPSccss')) {
	class MMPSccss     {
		private $options;

		public function __construct() {
			add_action( 'admin_menu', array($this, 'add_menu'));
			add_action( 'admin_init', array( $this, 'init_settings' ) );
			add_action( 'add_meta_boxes', array($this, 'add_meta_box' ) );
			add_action( 'save_post', array( $this, 'single_save' ) );
			add_action( 'init', array($this, 'init'));
			add_filter( 'query_vars', array($this, 'add_wp_var'));
			add_action( 'wp_enqueue_scripts', array($this, 'add_mmps'), 999 );
			add_action( 'wp_head', array($this, 'single_mmps_css'));
		}

		public function init() {
			load_plugin_textdomain( MMPS_SCRIPT_SLUG, false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
		}

		public static function uninstall() {
			self::delete_options();
			self::delete_custom_meta();
		}

		public function add_meta_box( $post_type ) {
			$post_types = array('post', 'page');
			if ( in_array( $post_type, $post_types )) {
				// delegate to the WP function add_meta_box
				add_meta_box( 'mmps_ccss_add_mmps', 
					__( 'Parent Selector CSS', MMPS_SCRIPT_SLUG ), 
					array( $this, 'render_meta_box_content' ), 
					$post_type, 'advanced', 'high'
				);
			}
		}

		public function single_save( $post_id ) {
			if ( ! isset( $_POST['mmps_ccss_add_mmps_box_nonce'] ) || ! wp_verify_nonce( $_POST['mmps_ccss_add_mmps_box_nonce'], 'single_add_mmps_box' ) ) {
				return;
			}
			if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
				return;
			}
			if ( 'page' == $_POST['post_type'] ) {
				if ( ! current_user_can( 'edit_page', $post_id ) )
					return;
			} else {
				if ( ! current_user_can( 'edit_post', $post_id ) )
					return;
			}

			$single_mmps_css = wp_kses( $_POST['single_mmps_css'], array( '\'', '\"' ) );
			update_post_meta( $post_id, '_single_add_mmps', $single_mmps_css );
		}

		public function render_meta_box_content( $post ) {
			wp_nonce_field( 'single_add_mmps_box', 'mmps_ccss_add_mmps_box_nonce' );
			$single_mmps_css = get_post_meta( $post->ID, '_single_add_mmps', true );
			echo '<p>'.  sprintf( __( 'The normal CSS and Parent Selector CSS Rules entered here will always be scanned by MMPS and will be applied to this %s irregardless of the MMPS Ignore settings.', MMPS_SCRIPT_SLUG ), $post->post_type ). '</p>';
			echo '<textarea id="single_mmps_css" name="single_mmps_css" style="width:100%; min-height:200px;">' . esc_attr( $single_mmps_css ) . '</textarea>';
		}

		public function add_menu() {
			global $mmpsccss_settings_page;
			$mmpsccss_settings_page = add_menu_page( __('Militant Moderates Parent Selector (MMPS)', MMPS_SCRIPT_SLUG), __('MMPS', MMPS_SCRIPT_SLUG), 'manage_options', 'mmps-ccss-add-custom-css_settings', array($this, 'create_settings_page'), plugin_dir_url( __FILE__ ) . '/images/icon.png');
		}

		public function create_settings_page() {
			if (! current_user_can( 'manage_options' ) ) {
			?>
			<div class="wrap">
		<h2><?php _e('Militant Moderates Parent Selector (MMPS)', MMPS_SCRIPT_SLUG); ?></h2>
		<p><?php _e('You do not have permission to change these options.', MMPS_SCRIPT_SLUG); ?></p>
			</div>
	  <?php
			} else {
				$this->options = get_option( 'mmpsccss_settings' );
			?>
			<div class="wrap">
		<h2><?php _e('Militant Moderates Parent Selector (MMPS)', MMPS_SCRIPT_SLUG); ?></h2>
		<form id="mmps_ccss_form" method="post" action="options.php">
		<?php settings_fields( 'mmpsccss_group' ); ?>
		<?php do_settings_sections( 'mmps-ccss-add-custom-css_settings' ); ?>
				<?php submit_button( __('Save MMPS Settings', MMPS_SCRIPT_SLUG) ); ?>
				</form>
			</div>
	  <?php
	  		}
		}

		public function print_parse_info() {
			echo '<p>' . __('CSS Style Rules come from several different sources. Normally MMPS will scan all sources for Parent Selector Rules. Use the following options to select which sources will be ignored by MMPS.', MMPS_SCRIPT_SLUG) . "</p>\n";
			echo '<p>' . __('NOTE: All CSS sources will be used for normal styling. The Ignore Settings only control which sources MMPS searches for Parent Selector rules. Your pages will load faster if you put all Parent Selector Rules into the section provided below then enable both of the following Ignore options.', MMPS_SCRIPT_SLUG) . "</p>\n";
		}

		public function print_section_info() {
			_e('The following CSS Rules will be applied to the entire web site. You may include both normal and Parent Selector rules. All rules entered here will always be checked for Parent Selector rules.', MMPS_SCRIPT_SLUG);
		}

		public function parse_external_input() {
			$checked_state = isset( $this->options['mmps_ccss_parse_external'] ) ? ' checked="checked"' : '';
			echo '<label for="mmpsccss_settings[mmps_ccss_parse_external]"><input name="mmpsccss_settings[mmps_ccss_parse_external]" id="mmpsccss_settings[mmps_ccss_parse_external]" type="checkbox"' . $checked_state . '>' . __('Check this option to ignore Parent Selectors in External CSS Stylesheet files', MMPS_SCRIPT_SLUG) . '</label>';
		}
		public function parse_inline_input() {
			$checked_state = isset( $this->options['mmps_ccss_parse_inline'] ) ? ' checked="checked"' : '';
			echo '<label for="mmpsccss_settings[mmps_ccss_parse_inline]"><input name="mmpsccss_settings[mmps_ccss_parse_inline]" id="mmpsccss_settings[mmps_ccss_parse_inline]" type="checkbox"' . $checked_state . '>' . __('Check this option to ignore Parent Selectors in Inline CSS Styles', MMPS_SCRIPT_SLUG) . '</label>';
		}

		public function main_css_input() {
			$custom_rules = isset( $this->options['mmps_ccss_main_style'] ) ? esc_attr( $this->options['mmps_ccss_main_style'] ) : '';
			echo '<textarea name="mmpsccss_settings[mmps_ccss_main_style]" style="width:100%; min-height:300px;">' . $custom_rules . '</textarea>';
		}

		public function init_settings() {
			register_setting(
				'mmpsccss_group',
				'mmpsccss_settings'
			);
			add_settings_section(
					'mmpsccss_main_parse',
					__('Select CSS sources to ignore while scanning for Parent Selector Rules', MMPS_SCRIPT_SLUG),
					array( $this, 'print_parse_info' ),
					'mmps-ccss-add-custom-css_settings'
			);
			add_settings_field(
					'mmps_ccss_parse_external',
					__('Ignore External CSS files?', MMPS_SCRIPT_SLUG),
					array( $this, 'parse_external_input' ),
					'mmps-ccss-add-custom-css_settings',
					'mmpsccss_main_parse',
					array( 'label_for' => 'mmpsccss_settings[mmps_ccss_parse_external]' )
			);
			add_settings_field(
					'mmps_ccss_parse_inline',
					__('Ignore Inline CSS rules?', MMPS_SCRIPT_SLUG),
					array( $this, 'parse_inline_input' ),
					'mmps-ccss-add-custom-css_settings',
					'mmpsccss_main_parse',
					array( 'label_for' => 'mmpsccss_settings[mmps_ccss_parse_inline]' )
			);

			add_settings_section(
					'mmpsccss_main_style',
					__('Site-wide Normal and Parent Selector CSS Rules', MMPS_SCRIPT_SLUG),
					array( $this, 'print_section_info' ),
					'mmps-ccss-add-custom-css_settings'
			);
			add_settings_field(
					'mmps_ccss_main_style',
					__('Site-wide CSS rules:', MMPS_SCRIPT_SLUG),
					array( $this, 'main_css_input' ),
					'mmps-ccss-add-custom-css_settings',
					'mmpsccss_main_style'
			);
		}

		public function delete_options() {
			unregister_setting(
				'mmpsccss_group',
				'mmpsccss_settings'
			);
			delete_option('mmpsccss_settings');
		}

		public function delete_custom_meta() {
			delete_post_meta_by_key('_single_add_mmps');
		}

		public static function add_wp_var($public_query_vars) {
			$public_query_vars[] = 'display_mmps_ccss';
			return $public_query_vars;
		}

		public static function display_mmps_ccss(){
			$display_css = get_query_var('display_mmps_ccss');
			if ($display_css == 'css') {
				include_once (plugin_dir_path( __FILE__ ) . '/css/mmps-ccss.php');
				exit;
			}
		}

		public function add_mmps() {
			$this->options = get_option( 'mmpsccss_settings' );
			if ( isset($this->options['mmps_ccss_main_style']) && $this->options['mmps_ccss_main_style'] != '') {
				wp_register_style( MMPS_SCRIPT_SLUG, get_bloginfo('url') . '?display_mmps_ccss=css' );
				wp_enqueue_style( MMPS_SCRIPT_SLUG );
			}
		}

		public function single_mmps_css() {
			if ( is_single() || is_page() ) {
				global $post;
				$single_mmps_css = get_post_meta( $post->ID, '_single_add_mmps', true );
				if ( $single_mmps_css !== '' ) {
					$single_mmps_css = str_replace ( array( '&gt;', '&lt;' ), array( '>', '<' ), $single_mmps_css );
					$output = "<style type=\"text/css\" mmps_ccss=\"yes\">\n" . $single_mmps_css . "\n</style>\n";
					echo $output;
				}
			}
		}
	}
}

if(class_exists('MMPSccss')) {
	add_action('template_redirect', array('MMPSccss', 'display_mmps_ccss'));
	register_uninstall_hook(__FILE__, array('MMPSccss', 'uninstall'));
	$mmpsccss = new MMPSccss();
}

if(isset($mmpsccss)) {
	function mmpsccss_settings_link($links) {
		$settings_link = '<a href="admin.php?page=mmps-ccss-add-custom-css_settings">' . __('Settings', MMPS_SCRIPT_SLUG) . '</a>';
		array_unshift($links, $settings_link);
		return $links;
	}
	add_filter('plugin_action_links_' . plugin_basename(__FILE__), 'mmpsccss_settings_link');
}

?>
