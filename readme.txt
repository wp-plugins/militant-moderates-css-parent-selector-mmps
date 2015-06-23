=== Militant Moderates CSS Parent Selector MMPS ===
Contributors: mmtechmaster
Donate link: http://www.militantmoderates.org/donate-to-militant-moderates/
Tags: CSS,Parent Selector
Requires at least: 4.0.0
Tested up to: 4.2.2
Stable tag: 1.1.1
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Adds support for the Parent Selector syntax in CSS Styles. Parent Selectors are used to apply the styling to a specific Parent element.

== Description ==
The right *Look and Feel* of your Theme can sometimes require that you modify the style of the **Parent** Element rather than that of the **Selected** Element. (The Selected Element is the last one matched by the CSS Selector.)

The **Militant Moderates CSS Parent Selector MMPS** plugin for WordPress lets you write CSS Selectors that use an extended syntax for CSS Styles. When this plugin is installed and enabled, the **Parent Selector** syntax will be properly recognized and executed.

== Installation ==
1. Extract the distribution ZIP file into the '/wp-content/plugins/' folder.
1. Verify the new folder named 'militant-moderates-css-parent-selector-mmps' is created and populated.
1. Activate the 'Militant Moderates CSS Parent Selector MMPS' plugin through the 'Plugins' menu in WordPress.

== Frequently Asked Questions ==
= I can't make the Parent Selector Style work =
Double-check that the **Militant Moderates CSS Parent Selector MMPS** plugin is activated using the Plugins menu in WordPress. If it is properly enabled, try testing your Style without the exclamation mark '!' modifier. Make sure the Style works and is applied to the Child element. Once you have made sure the Selector and Style rules work then put the '!' back into the Selector and try again.

== Screenshots ==

It all happens 'Inside'. There are no screenshots to show.

== Changelog ==
= 1.1.1 =
* Fixed an issue with the Any Sibling '~' Relationship Delimiter in CSS Selectors - The proper Parent element is now selected
* Reworked Target Event handling to compartmentalize parameters
* Added support for multiple Pseudo Classes and Pseudo Elements on Parent Selector
* Added support for multiple Pseudo Classes on Target Element

= 1.1.0 =
* Overhauled parsing of CSS Selectors and chasing a Selector up the DOM tree to its correct Parent. Using a new technique to parse the Selector that retains 'Relationship Delimiters' such as '>', '+' and '~',
* Resolved a number of IE8 compatibility issues.
* Rebuilt the handling of Pseudo Classes and Elements on both the Parent and Selected Elements.

= 1.0.2 =
* Regular Expression Fixes

The Regular Expression patterns that are used to pull apart CSS Selectors and Declarations had some tiny errors that caused parsing errors.

= 1.0.1 =
* Folder naming issues fixed

Naming problems with the base folder of the plugin have been addressed. Prior versions used the base folder name 'mmParentSelector'. In order to prepare it for hosting on WordPress.org the base folder name was changed to 'militant-moderates-css-parent-selector-mmps'.

= 1.0.0 =
* Initial release.

== Upgrade Notice ==
= 1.1.0 =
Initial Public Release - First genuine release through WordPress.org. You should upgrade if you have an older version.
