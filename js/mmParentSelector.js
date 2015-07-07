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

var mmps_packageName = 'militant-moderates-css-parent-selector-mmps';
var mmps_packageVersion = '1.2.2';

jQuery(document).ready(function( $ ) {

	var styleidx = -1, slctridx = 1, evidx = 0, clsidx = 0,

	 // Class that's added to every styled element
	CLASS = 'mmPpSsPrEfIx',

	eventMap = {
		abort: 'abort',
		active: 'focusin',
		click: 'click',
		dblclick: 'dblclick',
		focus: 'focusin',
		focusout: 'focusout',
		hover: 'mouseover',
		keyup: 'keyup',
		load: 'load',
		mouseleave: 'mouseleave',
		mousemove: 'mousemove',
		mouseout: 'mouseout',
		mouseup: 'mouseup',
		resize: 'resize',
		scroll: 'scroll',
		select: 'select',
		unload: 'unload',
		visited: 'click',
		wheel: 'wheel',
	},

	pairedEventMap = {
		focusin: 'focusout',
		keydown: 'keyup',
		mousedown: 'mouseup mouseout mouseleave',
		mouseenter: 'mouseleave',
		mouseover: 'mouseout',
	},

	stateMap = {
		active: ':active',
		disabled: ':disabled',
		empty: ':empty',
		enabled: ':enabled',
		first_child: ':first-child',
		first_of_type: ':first-of-type',
		in_range: ':in-range',
		invalid: ':invalid',
		lang: ':lang',
		last_child: ':last-child',
		last_of_type: ':last-of-type',
		link: ':link',
		not: ':not',
		nth_child: ':nth-child',
		nth_last_child: ':nth-last-child',
		nth_last_of_type: ':nth-last-of-type',
		nth_of_type: ':nth-of-type',
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

		for (var i = 0; i < aryRegExp.length; i++) {
			ret += aryRegExp[i].source;
		}

		return ret;
	})([
		/[\w\s\/\.\-\:\=\[\]\(\)\~\+\|\,\*\'\"\^$#>]*(?=!)/,
		/[\w\s\/\.\-\:\=\[\]\(\)\~\+\|\,\*\'\"\^$#>!]*/,
		/\{{1}[^\}]+\}{1}/
	]), "gi");


	// stick debug prefix function behind a console.log so it gets stripped when they get stripped

	parse = function(sRawCSS) {
		// Remove comments.
		sRawCSS = sRawCSS.replace(/(\/\*([\s\S]*?)\*\/)/gm, '');

		if ( matches = sRawCSS.match(REGEX) ) {
			parsed = '';

			for (styleidx = -1; ++styleidx < matches.length; ) {
				style = $.trim(matches[styleidx]);

				// parse Selector portion of Style
				selectors = $.trim(style.split('{')[0]).split( /\s*,\s*/ );

				// parse Declarations portion of Style
				declarations = '{' + style.split( /\{|\}/ )[1].replace( /^\s+|\s+$[\t\n\r]*/g, '' ) + '}';

				// skip empty declarations
				if ( declarations === '{}' ) {
					continue;
				}

				if (! /;}$/.test(declarations))
					declarations = declarations.replace(/}/g, ';}');
				declarations = declarations.replace(/;/g, ' !important;');


				parsedSelectors = '';
				for (slctridx = -1; ++slctridx < selectors.length; ) {
					selector = $.trim(selectors[slctridx]);

					(parsedSelectors.length) && (parsedSelectors += ",");

					// Split the selector on the '!' and save results
					var splitsel = selector.split('!');

					if (/!/.test(selector) ) {
						// Split the selector on the '!' and save results
						var splitsel = selector.split('!');

						// recombine remaining array members in case a second '!' was included
						if (splitsel.length > 2)
							splitsel[1] = splitsel.slice(1).join('!');

						// Parse Parent from Selector
						var splitp = splitsel[0].split(/[>~+\s]+/).reverse()[0].split(/[\:]+/);

						// parse Parent and ALL Pseudo Parents :before :after :hover :click etc.
						parent = $.trim(splitp[0]);				// first member is Parent Element
						pseudoParents = splitp.slice(1);		// all remaining members are Pseudo Classes or Elements

						// parse Target from Selector
						var splitt = splitsel[1].split(/[>~+\s]+/).reverse()[0].split(/[\:]+/);

						// parse Target and ALL Pseudo Targets
						target = $.trim(splitt[0]) || []._;
						pseudoTargets = splitt.slice(1);		// get all Pseudo Targets - not just first

						// Build Child Selector - Same as Selector but without '!'
						// Remove '!' Parent Selector designator and convert double colons to single
						childSelector = selector.replace(/!/g, '').replace('::', ':');

						// Remove ALL Parent Pseudo Classes and Pseudo Elements
						$(pseudoParents).each(function() {
							childSelector = childSelector.replace( ':' + this, '' );
						});
						// Remove any event-type Target Pseudo Classes from Child Selector
						$(pseudoTargets).each(function() {
							if ( eventMap[ this.toString() ] || pairedEventMap[ this.toString() ] )
								childSelector = childSelector.replace( ':' + this, '' );
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
									if ( childSelector.lastIndexOf( ep ) >= 0 ) {
										childSelector = childSelector.replace(new RegExp( ep, 'g' ), '' );
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
										break;
									default:
										subject = subject.closest(n);
										break;
									}

								} while (subject && n != parent && (n = $.trim(tmpNodes.pop())));


								// If we successfully walked up the DOM tree and found the right parent...
								if (subject) {
									var id = CLASS + clsidx++,

									addNamespace = function( eType ) {
										return eType.split(/[ ]+/).join('.e' + id + ' ') + '.e' + id;
									},

									getPseudoElement = function( ppNorm ) {
										return pseudoElements[ ppNorm.replace(/\-/g, '_') ];
									},

									getPseudoState = function( ppNorm ) {
										var ps = ppNorm.split( '(' );
										if ( stateMap[ ps[0].replace(/\-/g, '_') ] )
											return stateMap[ ps[0].replace(/\-/g, '_') ] + ps.slice(1).join( '(' );
										return false;
									},

									getPseudoEvent = function( ppNorm ) {
										if ( eventMap[ ppNorm ] )
											return eventMap[ ppNorm ];
										else if ( pairedEventMap[ ppNorm ] )
											return ppNorm;
										return false;
									},

									toggleFn = function(e) {
										var eid = 'E#' + evidx++;
										if (e) {
											// if this is a paired event then build a reverse handler
											if ( pairedEventMap[e.type] ) {
												$(e.currentTarget).bind( addNamespace( pairedEventMap[e.type] ), { id: e.data.id, subject: $(e.data.subject) }, function(oe) {
													// Make sure all paired event handlers are turned off, not just the one that fired
													$(oe.currentTarget).unbind( addNamespace( pairedEventMap[e.type] ) );
													// Then toggle the Class on the Subject element
													$(oe.data.subject).toggleClass(oe.data.id);
												});
											}
										}

										// Toggle our special Class in the final subject element
										$(e.data.subject).toggleClass(e.data.id);
									};

									checkVisitedLink = function(e) {
										var eid = 'E#' + evidx++, qClass = false;
										if (e) {
											// This is a Link element, check to see if it is 'visited'
											try {
												if ( $(e.currentTarget).is( ':visited' ) ) {		// use target attribute instead of visited
													if (! $(e.data.subject).hasClass( e.data.id ) ) {
														qClass = true;		// yes, toggle our Class
													}
												} else {
													if ( $(e.data.subject).hasClass( e.data.id ) ) {
														qClass = true;		// yes, toggle our Class
													}
												}
											}
											catch(err) {
												if ( $(e.data.subject).hasClass( e.data.id ) ) {
													qClass = true;		// yes, toggle our Class
												}
											}
										}

										// Toggle our special Class in the final subject element if qClass is set
										if ( qClass ) {
											$(e.data.subject).toggleClass(e.data.id);
										}
									};

									idx && (parsedSelectors.length) && (parsedSelectors += ",");
									parsedSelectors += '.' + id;

									// Flag set if we need to apply the CLASS to the Parent
									var qClass = false;

									// Loops through the Pseudo Parents and apply those that are needed
									$(pseudoParents).each(function() {
										var pe;
										if ( pe = getPseudoElement( this.toString() ) ) {
											parsedSelectors += pe;
											qClass = true;		// apply class later .. maybe
										} else if ( pe = getPseudoEvent( this.toString() ) ) {
											// *** MUST check Events before States
											// It's one of the Event Pseudo Classes :hover :checked :focus
											$(subject).bind( addNamespace( pe ), { id: id, subject: $(subject) }, toggleFn );
											// Do not apply Class to the subject - Event will apply it
											qClass = false;
										} else if ( pe = getPseudoState( this.toString() ) ) {
											parsedSelectors += pe;
											qClass = true;		// apply class later .. maybe
										} else {
											// A non-event, non-state Pseudo - Ignore it
										}
									});

									if ( pseudoTargets.length ) {
										var orgChild = $(this);

										$(pseudoTargets).each(function() {
											// Process each Target Pseudo Class or Pseudo Element modifier

											var pe;
											if ( pe = getPseudoElement( this.toString() ) ) {
											} else if ( this.toString() == 'visited' && $(orgChild).prop('tagName') == 'A' ) {
												// the Target Pseudo Class is visited and this is a Link 'A' Element
												try {
													qClass = $(orgChild).is(':visited');		// save state of visited in Target
												}
												catch(err) {
													qClass = false;
												}
												// Hook our special click event handler to check Link's visited status
												$(orgChild).bind( addNamespace( 'click focus blur' ), { id: id, subject: $(subject) }, checkVisitedLink );
											} else if ( pe = getPseudoEvent( this.toString() ) ) {
												// *** MUST check Events before States

												// It's one of the Event Pseudo Classes :hover :checked :focus
												$(orgChild).bind( addNamespace( pe ), { id: id, subject: $(subject) }, toggleFn );
												// Do not apply Class to the subject - Event will apply it
												qClass = false;
											} else if ( pe = getPseudoState( this.toString() ) ) {
												// It's one of the State Pseudo Classes :enabled, :disabled, :link
												// A normal or special Parameterized Pseudo Class State
												qClass = true;
											} else {
												// An unknown Pseudo Class - DEFAULT is to build a handler for it
											}
										});
									} else if (! pseudoParents.length ) {
										qClass = true;
									}

									// if qClass is set then we need to set the new Custom class 'id' on the Subject element
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
				$('<style type="text/css" mmps_ver="' + mmps_packageVersion + '">' + parsed + '</style>').appendTo('head');

		} else {		// else "if !matches"
		}
	};					// end "parse function"

	var parseExternal = false,
		parseInline = false,
		oldBrowser = false,
		mmpsVersion;
	
	if (mmps_ExternalOptions) {
		mmpsVersion = mmps_ExternalOptions['version'];
		parseExternal = ( mmps_ExternalOptions['external'] && mmps_ExternalOptions['external'] != 0 );
		parseInline = ( mmps_ExternalOptions['inline'] && mmps_ExternalOptions['inline'] != 0 );
		oldBrowser = ( mmps_ExternalOptions['browser'] && mmps_ExternalOptions['browser'] != 0 );
	}


	if ( oldBrowser ) {
		pseudoElements = {
			after: ':after',
			before: ':before',
			first_letter: ':first-letter',
			first_line: ':first-line',
			selection: ':selection'
		};

		stateMap = {
			active: ':active',
			disabled: ':disabled',
			empty: ':empty',
			enabled: ':enabled',
			invalid: ':invalid',
			lang: ':lang',
			link: ':link',
			not: ':not',
			optional: ':optional',
			required: ':required',
			target: ':target',
			valid: ':valid',
			visited: ':visited'
		};
	}

	$('link[rel="stylesheet"],style').each(function(i) {
		if ( $(this).attr('mmps_ignore') ) {
		} else if ( $(this).is('link') ) {
			var href = $(this).attr('href');
			if ( parseExternal || href.indexOf( 'display_mmps_ccss=css' ) >= 0 ) {
				$.ajax({
					type: 'GET',
					url: href,
					dataType: 'text'
				}).done(function(css) {
					parse(css);
				}).fail(function() {
				});
			}
		} else if ( parseInline || $(this).attr('mmps_ccss') ) {
			parse( $(this).text() );
		}
	});

});
