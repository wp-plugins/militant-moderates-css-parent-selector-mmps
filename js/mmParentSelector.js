/**
 * @package militant-moderates-css-parent-selector-mmps
 * @version 1.1.2
 */
/*
Plugin Name: Militant Moderates CSS Parent Selector MMPS
Plugin URI: http://www.militantmoderates.org/mmps-quick-start/
Description: Adds CSS "Parent Selector" support to your Theme. Apply your CSS Style to Parent/Sibling elements not just the Selected element.
Version: 1.1.2
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
//		active: 'mousedown mouseup',
		changed: 'change',
		checked: 'click',
//		click: 'click',
		focus: 'focus blur',
		hover: 'mouseover mouseout',
//		mousedown: 'mousedown',
//		mouseout: 'mouseout',
//		mouseover: 'mouseover',
//		mouseup: 'mouseup',
		selected: 'change',
	},

	pairedEventMap = {
		mousedown: 'mouseup mouseout'
	},

	singleEventMap = {
		mouseup: 'mouseout'
	},

	stateMap = {
		active: ':active',
//		checked: ':checked',
		disabled: ':disabled',
		empty: ':empty',
		enabled: ':enabled',
		first_child: ':first-child',
		first_of_type: ':first-of-type',
//		focus: ':focus',
//		hover: ':hover',
		in_range: ':in-range',
		invalid: ':invalid',
		last_child: ':last-child',
		last_of_type: ':last-of-type',
		link: ':link',
		only_of_type: ':only-of-type',
		only_child: ':only-child',
		optional: ':optional',
		out_of_range: ':out-of-range',
		read_only: ':read-only',
		read_write: ':read-write',
		required: ':required',
		target: ':target',
		valid: ':valid',
		visited: ':visited'
	},

	stateParamMap = {
		lang: ':lang(#)',							// **SPECIAL
		not: ':not(#)',								// **SPECIAL
		nth_child: ':nth-child(#)',					// **SPECIAL
		nth_last_child: ':nth-last-child(#)',		// **SPECIAL
		nth_last_of_type: ':nth-last-of-type(#)',	// **SPECIAL
		nth_of_type: ':nth-of-type(#)'				// **SPECIAL
	},

	pseudoElements = {
		after: '::after',
		before: '::before',
		first_letter: '::first-letter',
		first_line: '::first-line',
		selection: '::selection'
	},

	parsed, parsedSelectors, matches, selectors, selector,
	parent, target, child, pseudoTargets, declarations,
	pseudoParent, pseudoParents, childSelector, childElements,

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

			for (i = -1; ++i < matches.length; ) {
				style = $.trim(matches[i]);

				// parse Selector portion of Style
				selectors = $.trim(style.split('{')[0]).split(',');

				// parse Declarations portion of Style
				declarations = '{' + style.split(/\{|\}/)[1].replace(/^\s+|\s+$[\t\n\r]*/g, '') + '}';

				// skip empty declarations
				if ( declarations === '{}' ) {
					continue;
				}

				if (! /;}$/.test(declarations))
					declarations = declarations.replace(/}/g, ';}');
				declarations = declarations.replace(/;/g, ' !important;');


				parsedSelectors = '';
				for (j = -1; ++j < selectors.length; ) {
					selector = $.trim(selectors[j]);

					(parsedSelectors.length) && (parsedSelectors += ",");

					if (/!/.test(selector) ) {
						// Split the selector on the '!' and save results
						var splitsel = selector.split('!');

						// Parse Parent from Selector
						var splitp = splitsel[0].split(/[>~+\s]+/).reverse()[0].split(/[\:]+/);

						// parse Parent and ALL Pseudo Parents :before :after :hover :click etc.
						parent = $.trim(splitp[0]);
						pseudoParents = splitp.slice(1);		// get all Pseudo Parents

						// parse Target from Selector
						var splitt = splitsel[1].split(/[>~+\s]+/).reverse()[0].split(/[\:]+/);

						// parse Target and ALL Pseudo Targets
						target = $.trim(splitt[0]) || []._;
						pseudoTargets = splitt.slice(1);		// get all Pseudo Targets - not just first

						// Build Child Selector - Same as Selector but without '!'
						childSelector = selector.replace(/!/g, '').replace('::', ':');
						// Remove ALL Parent Pseudo Classes and Pseudo Elements from Child Selector
						$(pseudoParents).each(function(x) {
							childSelector = childSelector.replace( ':' + this, '' );
						});
						// Remove any event-type Target Pseudo Classes from Child Selector
						$(pseudoTargets).each(function(x) {
							if ( eventMap[ this ] ) childSelector = childSelector.replace( ':' + this, '' );
						});

						// Parse the Elements and Relationship Delimiters out of the Child Selector
						childElements = childSelector
									.match(/([\>\+\~]|(\:not\()?((\w[\-\w]*|\*)|[\.\#]\w[\-\w]*|\:{1,2}\w[\-\w\(\)]*|\[[^\]]*\])+\)?\!?)/gi);

						// if we have at least two elements in the selector then we can proceed
						if (childElements.length > 1) {
							var qDOM;
							
							do {
								qDOM = false;			// clear our flag
								try {
									// Gather up all the elements that match
									child = $(childSelector);
								}
								catch(err) {
									var ep = ':' + $.trim(err.toString().match( /[\w\-]+$/i ));
									var epp = childSelector.lastIndexOf( ep );
									if ( epp >= 0 ) {
										childSelector = childSelector.replace( ep, '' );
										qDOM = true;
									}
								}
							} while (qDOM);

							// Time to set up events and classes from Child Elements
							child.each(function(idx) {
								// grab a hook to the child's current element
								var subject = $(this);


								// throw away the last (current) selector element
								var tmpNodes = childElements.slice(0, -1);;

								// Iterate up the DOM to get the element that is at the top of the selector chain
								var n = $.trim(tmpNodes.pop());
								do {

									switch (n) {
									case '>':
										n = $.trim(tmpNodes.pop());
									case '*':						// same as '>' direct parent relationship delimiter
										subject = subject.parent(n);
										break;
									case '+':
										n = $.trim(tmpNodes.pop());
										subject = subject.prev(n);
										break;
									case '~':
										n = $.trim(tmpNodes.pop());
										subject = subject.prev();
										while ( subject && ! subject.is(n) ) {
											subject = subject.prev();
										}
										if ( subject ) {
										} else {
										}
										break;
									default:
										subject = subject.closest(n);
										break;
									}

									if (subject) {
									}
								} while (subject && n != parent && (n = $.trim(tmpNodes.pop())));

								// If we successfully walked up the DOM tree and found the right parent...
								if (subject) {
									var id = CLASS + k++,
									ptNormState,
									toggleFn = function(e) {
										if (e) {
											// if we have an attach type event then build a reverse handler
											if (pairedEventMap[e.type]) {
												e.data.subject.on(pairedEventMap[e.type], function(oe) {
													e.data.subject.toggleClass(e.data.id);
													e.data.subject.off(pairedEventMap[e.type]);
												});
											}
											if (singleEventMap[e.type]) {
												e.data.subject.off(singleEventMap[e.type]);
											}
										}

										// Toggle our special Class in the final subject element
										e.data.subject.toggleClass(e.data.id);
									};

									checkStateFn = function(e) {
										if ( $(e.target).is( e.data.eState ) ) {
											// Target Element has this State, so apply our Class to the Subject
											if (! ($(subject).hasClass(id)) ) {
												$(subject).toggleClass(id);
											}
										} else if ( $(subject).hasClass(id) ) {
											// Target Element does not currently have the state so Clear on Subject if set
											$(subject).toggleClass(id);
										}
//										e.stopPropogation();
									};

									idx && (parsedSelectors.length) && (parsedSelectors += ",");
									parsedSelectors += '.' + id;

									// Flag set if we need to apply the CLASS to the Parent
									var qClass = false;

									// test if Parent has a Pseudo Class or Element
									if (pseudoParents.length) {
										$(pseudoParents).each(function(pidx) {
											var ppNorm = this.replace(/\-/g, '_');
											if (pseudoElements[ ppNorm ]) {
												parsedSelectors += pseudoElements[ ppNorm ];
												qClass = true;		// apply class later .. maybe
											} else {
												// it's one of the other Pseudo Classes :hover :click etc.
												// Build a handler for the specified Pseudo Class
												$(subject).on( eventMap[ this ] || this, { id: id, subject: $(subject) }, toggleFn );
											}
										});
									}

									if (pseudoTargets.length) {
										var orgChild = $(this);

										$(pseudoTargets).each(function(tidx) {
											// Target has a Pseudo Class or Pseudo Element modifier
											var ptNorm = this.replace(/\-/g, '_');

											var ptParam = null;
											if ( /\(/.test(this) ) {
												// A special case Pseudo Class with a parameter
												var pcname = this.split(/(?:\(|\))/g);
												pcname[0] = pcname[0].replace( /\-/g, '_' );

												if ( stateParamMap[ pcname[0] ] ) {
													ptParam = stateParamMap[ pcname[0] ].replace(/\#/, pcname[1]);
												}
											}

											if ( pseudoElements[ ptNorm ] ) {
												// It's a Pseudo Element ::after, ::before, etc.
												// Ignored on the Target element
											} else if ( eventMap[ this ] ) {
												// It's one of the special Event Pseudo Classes :hover :checked :focus
												// Do not apply Class to the subject - Event will apply it
												qClass = false;
												// An event-based Pseudo Class - Build a handler for the Event
												$(orgChild).on( eventMap[ this ], { id: id, subject: $(subject) }, toggleFn );
											} else if ( stateMap[ ptNorm ] ) {
												// One of the Pseudo Class States
												ptNormState = stateMap[ ptNorm ];

												// Hook an event handler for changes in the Target
												$(orgChild).on( 'click load visibilitychange', { eState: ptNormState }, checkStateFn );

												if ( $(orgChild).is( ptNormState ) ) {
													// The State is already set on the Target; force the class on the Subject
													qClass = true;
												} else {
													// Target Element does not currently have the state so Clear on Subject if set
													qClass = false;
												}
											} else if ( ptParam ) {
												if ( $(orgChild).is( ptParam ) ) {
													// Target Element has this State, so apply our Class to the Subject
													qClass = true;
												}
											} else {
												qClass = false;
												// An unknown Pseudo Class - DEFAULT is to build a handler for the it
												$(orgChild).on( this.toString(), { id: id, subject: $(subject) }, toggleFn );
											}
										});
									} else if (! pseudoParents.length) {
										// Simple Target with no Pseudo crap
										qClass = true;
									}

									if (qClass) {
										$(subject).toggleClass(id);
									}
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
					parsed += parsedSelectors + "\n";
				}
			}

			if (parsed.length)
				$('<style type="text/css" mmps_gen="yes">' + parsed + '</style>').appendTo('head');

		} else {		// else "if !matches"
		}
	};					// end "parse function"

	navigator.browserInfo = (function() {
		var ua = navigator.userAgent, tem,
		M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
		if ( /trident/i.test(M[1]) ) {
			tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
			return 'IE '+(tem[1] || '');
		}
		if (M[1] === 'Chrome'){
			tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
			if ( tem != null )
				return tem.slice(1).join(' ').replace('OPR', 'Opera');
		}
		M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
		if ( (tem = ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
		return { 'browser': M[0], 'version': M[1] };;
	})();

	if ( navigator.browserInfo.browser == "MSIE" && navigator.browserInfo.version <= 8 ) {
		pseudoElements = {
			after: ':after',
			before: ':before',
			first_letter: ':first-letter',
			first_line: ':first-line',
			selection: ':selection'
		};

		stateMap = {
//			checked: ':checked',
			disabled: ':disabled',
			empty: ':empty',
			enabled: ':enabled',
			invalid: ':invalid',
			optional: ':optional',
			required: ':required',
			target: ':target',
			valid: ':valid'
		};
	}

	$('link[rel="stylesheet"],style').each(function(i) {
		if ($(this).is('link')) {
			var href = $(this).attr('href');

			$.ajax({
				type: 'GET',
				url: href,
				dataType: 'text'
			}).done(function(css) {
				parse(css);
			}).fail(function() {
			});
		} else {
			parse($(this).text());
		}
	});
});
