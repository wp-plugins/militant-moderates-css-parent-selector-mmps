=== Militant Moderates CSS Parent Selector MMPS ===
Contributors: mmtechmaster
Donate link: http://www.militantmoderates.org/donate-to-militant-moderates/
Tags: CSS,Parent Selector
Requires at least: 4.0.0
Tested up to: 4.2.2
Stable tag: 1.1.1
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Adds CSS "Parent Selector" support to your Theme. Apply your CSS Style to Parent/Sibling elements not just the Selected element.

== Description ==
Getting your Theme to look exactly right is an art form. Sometimes you need more flexibility. The Militant Moderates CSS Parent Selector (or **MMPS**) plugin gives you that flexibility.

MMPS adds a feature called **Parent Selectors** to standard CSS. With enhanced Parent Selector CSS Styles, you can apply desired style changes to any element in the Selector, not just the last one.

Parent Selectors are easy to learn too. Converting a standard CSS Selector to a Parent Selector is simply a matter of putting an exclamation mark '!' at the end of the desired Parent Element.

> Complete details are available on the **[MMPS Plugin Home Page](http://www.militantmoderates.org/mmps-quick-start/ "MMPS Quick Start")**

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
= 1.1.2 (in development) =
* Changes in progress

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
= 1.1.1 =
This version cleans up many performance and operational issues. If you are having problems making MMPS understand a specific CSS Selector then make sure you upgrade to this version and test again.
