/**
 * @class gx.core.History
 * @description Inspired and partly copied by http://backbonejs.org/#Router
 * @implements Events
 * @implements gx.core.Settings
 *
 * @author Sebastian Glonner <sebastian.glonner@zeyon.net>
 * @version 1.00
 * @package Gx
 * @copyright Copyright (c) 2010, Sebastian Glonner
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 */

if ( !window || !window.history || !window.history.pushState ) {
	if ( typeof console != 'undefined' && console.error )
		console.error('This browser does not support gx.core.History functionality!');
	/* else 
		Do not throw error because it might prevent other scripts from running.
	*/

}

gx.core.HistoryClass = new Class({
	gx: 'gx.core.Settings',
	Extends: gx.core.Settings,
	Bind: [
		"checkUrl",
	],

	options: {
		root: '/',
		useHashtag: false, // false is currently unsupported!
	},

	handlers: [],

	// Cached regex for stripping a leading hash/slash and trailing space.
	routeStripper: /^[#\/]|\s+$/g,

	// Cached regex for stripping leading and trailing slashes.
	rootStripper: /^\/+|\/+$/g,

	// Cached regex for removing a trailing slash.
	trailingSlash: /\/$/,

	// Cached regex for stripping urls of hash.
	pathStripper: /#.*$/,

  	// Has the history handling already been started?
	started: false,


	// The default interval to poll for hash changes, if necessary, is
	// twenty times a second.
	interval: 50,

    location: null,
    history: null,

    veryFirstPageLoadDone: false,

    initialize: function() {
	    this.location = window.location;
	    this.history  = window.history;


    },

	// Are we at the app root?
	atRoot: function() {
	  	return this.location.pathname.replace(/[^\/]$/, '$&/') === this.root;
	},

	// Gets the true hash value. Cannot use location.hash directly due to bug
	// in Firefox where location.hash will always be decoded.
	getHash: function(window) {
	  	var match = (window || this).location.href.match(/#(.*)$/);
	  	return match ? match[1] : '';
	},

	// Get the cross-browser normalized URL fragment, either from the URL,
	// the hash, or the override.
	getFragment: function(fragment) {
	  	if (fragment == null) {
	  		if ( this.options.useHashtag )
	  			fragment = this.getHash();
	  		else {
	          	// fragment = decodeURI(this.location.pathname + this.location.search);
	            fragment = decodeURI(this.location.pathname + this.location.search + this.location.hash);
	          	var root = this.root.replace(this.trailingSlash, '');
	          	if (!fragment.indexOf(root))
	          		fragment = fragment.slice(root.length);
	        }
	  	}
	  	return fragment.replace(this.routeStripper, '');
	},

	// Start the hash change handling, returning `true` if the current URL matches
	// an existing route, and `false` otherwise.
	start: function(options) {
		if (this.started)
	  		throw new Error("gx.core.History has already been started");

	  	this.started = true;

	  	this.restart(options);

	  	if ( !this.options.silent )
	  		return this.loadUrl();
	},

	restart: function(options) {
		if ( !this.started ) 
	  		throw new Error("gx.core.History has not been started yet");

	  	this.setOptions(options);

	  	this.root = this.options.root;
	  	this.fragment = null;

		window.onpopstate = function() {
			this.checkUrl();
		}.bind(this);

		// Normalize root to always include a leading and trailing slash.
		this.root = ('/' + this.root + '/').replace(this.rootStripper, '/');
	},

	// Disable gx.core.History, perhaps temporarily. Not useful in a real app,
	// but possibly useful for unit testing Routers.
	stop: function() {
		window.onpopstate = null;
	  	this.started = false;
	},

	// Add a route to be tested when the fragment changes. Routes added later
	// may override previous routes.
	route: function(route, callback) {
	  	this.handlers.unshift({route: route, callback: callback});
	},

	releaseRoutes: function() {
		this.handlers = [];
	},

	// Checks the current URL to see if it has changed, and if it has,
	// calls `loadUrl`, normalizing across the hidden iframe.
	checkUrl: function(e) {
		var current = this.getFragment();
		if (current === this.fragment)
	  		return false;

	  	this.loadUrl();
	},

	// Attempt to load the current URL fragment. If a route succeeds with a
	// match, returns `true`. If no defined routes matches the fragment,
	// returns `false`.
	loadUrl: function(fragment) {
		fragment = this.fragment = this.getFragment(fragment);
		var handler, i = 0, length = this.handlers.length;
		for ( i = 0; i < length; i++ ) {
			handler = this.handlers[i];
			if (handler.route.test(fragment)) {
				handler.callback(fragment);
				return true;
			}
		}
		return false;
	},

	// Save a fragment into the hash history, or replace the URL state if the
	// 'replace' option is passed. You are responsible for properly URL-encoding
	// the fragment in advance.
	//
	// The options object can contain `trigger: true` if you wish to have the
	// route callback be fired (not usually desirable), or `replace: true`, if
	// you wish to modify the current URL without adding an entry to the history.
	navigate: function(fragment, options) {
	  	if (!this.started)
	  		return false;

      	if (!options || options === true)
      		options = {trigger: !!options};

	  	var url = this.root + (this.options.useHashtag ? '#' : '') + (fragment = this.getFragment(fragment || ''));

	  	// Strip the hash for matching.
	  	// fragment = fragment.replace(this.pathStripper, '');

	  	if (this.fragment === fragment)
	  		return;

	  	this.fragment = fragment;

	  	// Don't include a trailing slash on the root.
	  	if (fragment === '' && url !== '/')
	  		url = url.slice(0, -1);

	  	// If pushState is available, we use it to set the fragment as a real URL.
	  	this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

	  	if ( options.trigger )
	  		return this.loadUrl(fragment);
	}

});

gx.core.History = new gx.core.HistoryClass();
/*gx.core.HistoryClass.initialize = function() {
	throw new Error('gx.core.History is meant to be used as singleton.');
}*/