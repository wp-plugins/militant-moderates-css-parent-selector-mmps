=== Militant Moderates CSS Parent Selector MMPS ===
Contributors: mmtechmaster
Donate link: http://www.militantmoderates.org/donate-to-militant-moderates/
Tags: CSS,Parent Selector,Custom CSS,Pseudo Class,Pseudo Element
Requires at least: 4.0.0
Tested up to: 4.2.2
Stable tag: 1.2.1
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

MMPS adds "Parent Selector" CSS support: apply Styles to Parent elements. Add custom CSS to the website and to specific posts and pages.

== Description ==
Getting your Theme to look exactly right is an art form. Sometimes you need more flexibility. The Militant Moderates CSS Parent Selector (**MMPS**) plugin gives you that flexibility.

MMPS adds **Parent Selectors** to standard CSS. Parent Selector CSS can apply style changes to any element in the Selector, not just the last one.

Parent Selectors are easy to learn. Convert a standard CSS Selector to a Parent Selector by putting an exclamation mark '!' at the end of the Parent Element to style.

**New in 1.2.0**: _MMPS adds a place to enter custom CSS rules that will always be searched for Parent Selectors. Add CSS and Parent Selector style rules to the whole web site and to specific posts and pages._

Complete details are available on the **[MMPS Plugin Home Page](http://www.militantmoderates.org/mmps-quick-start/ "MMPS Quick Start")**

== Installation ==
* Upload the Plugin to the '/wp-content/plugins/' directory
* Activate the plugin in the WP Admin Panel » Plugins

== Frequently Asked Questions ==
= I can't make the Parent Selector Style work =
Double-check that the **Militant Moderates CSS Parent Selector MMPS** plugin is activated using the Plugins menu in WordPress. If it is properly enabled, try testing your Style without the exclamation mark '!' modifier. Make sure the Style works and is applied to the Child element. Once you have made sure the Selector and Style rules work then put the '!' back into the Selector and try again.

= Can I add custom CSS to my site with MMPS? =
Yes. Space is provided to enter custom CSS *and* Parent Selector style rules to the entire website. Specific posts and pages may also have their own custom CSS.

= Will MMPS recognize Parent Selectors I add to my Theme or using other custom CSS plugins? =
Yes. MMPS will always search within its own custom CSS rules, but it can be configured to read external stylesheets and inline CSS as well.

== Screenshots ==

1. This screenshot shows five examples of style changes applied to the Parent Element, in this case a table. The table's background color changes when the mouse `hovers` over the cells at (Row:Column) 1:1, 3:3, and 2:2. The color also changes when the mouse `clicks` in the cell at 3:1.

2. This screenshot shows the MMPS plugin settings screen where you add custom CSS and Parent Selector Rules to your site. The custom CSS Rules are applied to your site exactly as any other CSS Rules, however any Parent Selector Rules will also be processed by MMPS. If you have added Parent Selector Rules to other CSS sources then you can also configure MMPS to scan them as well.

== Changelog ==
= 1.2.2 (development) =
* Fixed link from Plugin admin to MMPS Settings - 'MMPS' was not highlighted in the Settings menu.
* Added a 'Please Review' section and link at the top of the Settings page.
* (more changes pending)

= 1.2.1 =
* Changed parameter passing method for sending run-time options to JavaScript
* Massive rework on Action and Filter hooks; sequence makes more sense now
* Moved MMPS Settings from main menu on Admin bar into a submenu in General Settings
* Removed the /images sub-folder as it's no longer used for the MMPS Settings menu

= 1.2.0 =
* Added the ability to save custom CSS rules for the entire site and on a per page/post basis
* Added options to search external CSS files and inline CSS Styles for Parent Selector styles
* Massive rework under the event handling hood; switching to bind/unbind instead of on/off
* Handle `<a>` link elements differently because of the `:link` and `:visited` behavioral differences
* Added error handling around calls into the DOM that might fail under older browsers
* Optimizations in run-time performance greatly increase load speed

= 1.1.3 =
* Fixed issue that caused wrong Class to be removed at the end of a Paired Event (mouseover/mouseout for example). Resolves Support Issue at **[Anchor Hover behavior is two-state not true hover](https://wordpress.org/support/topic/anchor-hover-behavior-is-two-state-not-true-hover?replies=2)**.

= 1.1.2 =
* Protected development version JavaScript against execution by anyone other than a site Admin - This is only an issue on the development platform where visitors to the main site might encounter errors from code in development.
* Smoothing and sanding in various places, especially around debugging code that results in inefficiencies
* Added all the Event Types specified at **[W3 UI Events](http://www.w3.org/TR/DOM-Level-3-Events/#event-types-list)**
* Added unique Namespace to all event handlers; prevents crosstalk and inadvertant event handler removal
* Further obfuscated the MMPS "Class Prefix" used to generate unique Class Names

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
= 1.2.2 =
General bug cleanup. We recommend you upgrade, but this revision contains only cosmetic fixes.
