/**
 * @package militant-moderates-css-parent-selector-mmps
 * @version 1.0.2
 */
/*
Plugin Name: Militant Moderates CSS Parent Selector MMPS
Plugin URI: http://www.militantmoderates.org/mmps-quick-start/
Description: Adds support for the Parent Selector syntax in CSS Styles. Parent Selectors are used to apply the styling to a specific Parent element.
Version: 1.0.2
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

jQuery(document).ready(function( $ ) {

	var k = 0, i, j,

	 // Class that's added to every styled element
	CLASS = 'MMPS',

	eventMap = {
		hover: 'mouseover mouseout',
		checked: 'click',
		focus: 'focus blur',
//		active: 'mousedown mouseup',
		selected: 'change',
		changed: 'change'
	},

	pairedEventMap = {
		mousedown: 'mouseup mouseout'
	},

	singleEventMap = {
		mouseup: 'mouseout'
	},

	pseudoElements = [
		'after', 'before', 'first-letter', 'first-line', 'selection'
	],

	parsed, parsedSelectors, matches, selectors, selector,
	parent, target, child, pseudoTarget, declarations,
	pseudoParent, childSelector,

	REGEX = new RegExp((function(aryRegExp) {
		var ret = '';

		for (var i = 0; i < aryRegExp.length; i++)
			ret += aryRegExp[i].source;

		return ret;
	})([
		/[\w\s\/\.\-\:\=\[\]\(\)\~\+\|\,\*\'\"\^$#>]*(?=!)/,
		/[\w\s\/\.\-\:\=\[\]\(\)\~\+\|\,\*\'\"\^$#>!]*\{{1}/,
		/[^\}]+\}{1}/
	]), "gi");

	parse = function(sRawCSS) {
		// Remove comments.
		sRawCSS = sRawCSS.replace(/(\/\*([\s\S]*?)\*\/)/gm, '');

		if ( matches = sRawCSS.match(REGEX) ) {
			parsed = '';
			console.log('Initial RegExp match found ' + matches.length + ' matching Styles');
			
			for (i = -1; ++i < matches.length; ) {
				style = $.trim(matches[i]);
				console.log(i + ' Style="' + style + '"');

				// parse Selector portion of Style
				selectors = $.trim(style.split('{')[0]).split(',');
				console.log(i + ' Parsed Selectors[' + selectors.length + ']="' + selectors.toString() + '"');

				// parse Declarations portion of Style
				declarations = '{' + style.split(/\{|\}/)[1].replace(/^\s+|\s+$[\t\n\r]*/g, '') + '}';

				// skip empty declarations
				if ( declarations === '{}' ) {
					console.log('Skipping Empty Declaration');
					continue;
				}
				console.log(i + ' Declaration="' + declarations + '"');

				if (! /;}$/.test(declarations))
					declarations = declarations.replace(/}/g, ';}');
				declarations = declarations.replace(/;/g, ' !important;');

				console.log('Scrubbed Style="' + selectors + declarations + '"');

				parsedSelectors = '';
				for (j = -1; ++j < selectors.length; ) {
					selector = $.trim(selectors[j]);
					console.log(i + '/' + j + ' Selector="' + selector + '"');

					(parsedSelectors.length) && (parsedSelectors += ",");

					if (/!/.test(selector) ) {
						// Parse Parent from Selector
						parent = $.trim(selector.split('!')[0].split(/[>~+\s]+/).reverse()[0].split(/[\:]+/)[0]);
						// parse Pseudo Parent :before :after :hover :click etc.
						pseudoParent = $.trim(selector.split('!')[0].split(/[>~+\s]+/).reverse()[0].split(/[\:]+/)[1]) || []._;
						console.log(i + '/' + j + ' Parent="' + parent + '" PseudoParent="' + pseudoParent + '"');

						// parse Target from Selector
						target = $.trim(selector.split('!')[1].split(/[>~+\s]+/).reverse()[0].split(/[\:]+/)[0]) || []._;
						// parse Pseudo Target
						pseudoTarget = target ? ($.trim(selector.split('!')[1].split(/[>~+\s]+/).reverse()[0].split(/[\:]+/)[1]) || []._) : []._;
						console.log(i + '/' + j + ' Target="' + target + '" PseudoTarget="' + pseudoTarget + '"');

						// Build Child Selector - Same as Selector but without '!'
						childSelector = selector.replace(/!/g, '');
						// Remove any Parent Pseudo Classes or Elements from Child Selector
						childSelector = childSelector.replace('::', ':').replace(parent + ':' + pseudoParent, parent);
						// Remove any Target Pseudo Classes or Elements from Child Selector
						childSelector = childSelector.replace('::', ':').replace(target + ':' + pseudoTarget, target);
						console.log(i + '/' + j + ' Stripped Selector="' + childSelector + '"');

						// if we have at least two elements in the selector then we can proceed
						if (childSelector.split(/[>~+\s]+/).length > 1) {
							// Gather up all the elements that match
							child = $(childSelector);
							console.log(i + '/' + j + ' Selector matched ' + child.length + ' DOM subtrees');

							// Time to set up events and classes from Child Elements
							child.each(function(idx) {
								console.log(i + '/' + j + '/' + idx + ' Selected Element="' + $(this).prop('tagName') + '"');

								// grab a hook to the child's current element
								var subject = $(this);
								
								// chop up the Selector and throw away the last element
								var tmpNodes = childSelector.split(/[>~+\s]+/).slice(0, -1);
								
								// Iterate up the DOM to get the element that is at the top of the selector chain
								var n = $.trim(tmpNodes.pop());
								do {
									console.log('Current Element="' + n + '"');
									subject = (n == '*' ? subject.parent() : subject.closest(n));
								} while (subject && n != parent && (n = $.trim(tmpNodes.pop())));
								console.log('Done parsing Selector: Parent Element=' + subject.prop('tagName'));
								console.log(' > Parent="' + subject.text() + '"');

								// If we successfully walked up the DOM tree and found the right parent...
								if (subject) {
									var id = CLASS + k++,
									toggleFn = function(e) {
										if (e) {
											// if we have an attach type event then build a reverse handler
											if (pairedEventMap[e.type]) {
												$(subject).on(pairedEventMap[e.type], function() {
													$(subject).toggleClass(id);
													$(subject).off(pairedEventMap[e.type]);
												});
											}
											if (singleEventMap[e.type]) {
												$(subject).off(singleEventMap[e.type]);
											}
										}

										// Turn on our special Class in the final subject element
										$(subject).toggleClass(id);
									};

									idx && (parsedSelectors.length) && (parsedSelectors += ",");
									parsedSelectors += '.' + id;

									// test if Parent has a Pseudo Class or Element
									if (pseudoParent) {
										console.log('PseudoParent: ' + pseudoParent);
										if (pseudoElements.indexOf(pseudoParent) >= 0) {
											parsedSelectors += '::' + pseudoParent;
											$(subject).toggleClass(id);
											console.log('Adding PseudoElement to ID="' + '.' + id + '::' + pseudoParent + '"');
										} else {
											// it's one of the other Pseudo Classes :hover :click etc.
											// Build a handler for the specified Pseudo Class
											$(subject).on( eventMap[pseudoParent] || pseudoParent , toggleFn );
											console.log('Adding Subject Handler for ' + (eventMap[pseudoParent] || pseudoParent) + ' Pseudo Class');
										}
									}
									
									if (pseudoTarget) {
										// Target has a Pseudo Class or Pseudo Element modifier
										if (pseudoElements.indexOf(pseudoTarget) >= 0) {
											// It's a Pseudo Element ::after, ::before, etc.
											// Ignored on the Target element
										} else {
											// Clear our special class if it was set as part of the Parent Pseudo Element
											if (pseudoParent && $(subject).hasClass(id)) {
												$(subject).toggleClass(id);
												console.log('Clearing Subject Class "' + id + '"');
											}
											// Build a handler for the Event
											$(this).on( eventMap[pseudoTarget] || pseudoTarget , toggleFn );
											console.log('Adding Target Handler for ' + (eventMap[pseudoTarget] || pseudoTarget) + ' Pseudo Class on ' + $(this).prop('tagName') + ' Element');
										}
									} else if (! pseudoParent) {
										// Simple Target with no Pseudo crap
										$(subject).toggleClass(id);
										console.log('Setting Subject Class "' + id + '"');
									}

									// Handle existing Checked state
//									var $this = $(this);
//									if($this.is(':checked') && pseudoTarget === 'checked') {
//										// Target includes 'checked' Pseudo Class and this element is already checked
//										// So make sure we preset our special Class name in the subject elements
//										$(subject).toggleClass(id);
//									}
								}
							});
						}
					} else {
						child = $(selector);
						if (child.length) parsedSelectors += selector;
					}
				}

				if (parsedSelectors.length) {
					parsedSelectors += ' ' + declarations;
					console.log('Final Style="' + parsedSelectors + '"');
					parsed += parsedSelectors + "\n";
				}
			}

			if (parsed.length)
				$('<style type="text/css" mmps_gen="yes">' + parsed + '</style>').appendTo('head');

		} else {		// else "if !matches"
			console.log('No Styles matched!');
		}
	};					// end "parse function"

	$('link[rel="stylesheet"],style').each(function(i) {
		if ($(this).is('link')) {
			var href = $(this).attr('href');

			$.ajax({
				type: 'GET',
				url: href,
				dataType: 'text'
			}).done(function(css) {
				console.log('Retrieved CSS from ' + href + ' : ' + css.length);
				parse(css);
			}).fail(function() {
				console.log('FAILED to retrieve CSS from ' + href);
			});
		} else {
			console.log('Retrieved CSS from inline');
			parse($(this).text());
		}
	});
});
