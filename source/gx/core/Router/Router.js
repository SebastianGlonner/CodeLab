
// gx.core.Router.Builder = function ...
// gx.core.Router.buildQueryString = function ...
// gx.core.Router.readQueryString = function ...

/**
 * Routers map faux-URLs to actions, and fire events when routes are
 * matched. Creating a new one sets its `routes` hash, if not set statically.
 */
gx.core.Router =  new Class({
	gx: 'gx.core.Settings',
	Extends: gx.core.Settings,
	options: {
		routes: [],
	},

	/* Requires: gx.core.History */

	// Cached regular expressions for matching named param parts and splatted
	// parts of route strings.
	optionalParam : /\((.*?)\)/g,
	namedParam    : /(\(\?)?:\w+/g,
	splatParam    : /\*\w+/g,
	escapeRegExp  : /[\-{}\[\]+?.,\\\^$|#\s]/g,

	// trailing slash between path and ?
	trailSlash    : '\\/?',
	// matchting the query ?test=m
	query         : '(?:\\?([^#]*))?',
	// matching the hash part #anyhash
	hash          : '(?:\\#([\\s\\S]*))?',

	initialize: function(options){
		this.parent(options);
		this.history = gx.core.History;
		this._bindRoutes();
	},

	// Manually bind a single named route to a callback. For example:
	//
	//     this.route('search/:query/p:num', 'search', function(query, num) {
	//       ...
	//     });
	//
	// Add a route to be tested when the fragment changes. Routes added later
	// may override previous routes.
	route: function(route, name, callback) {
		if ( typeOf(route) != 'regexp' )
			route = this._routeToRegExp(route);

		if ( typeOf(name) == 'function' ) {
			callback = name;
			name = '';
		}
		if (!callback)
			callback = this.options.methods[name];

		var router = this;
		this.history.route(route, function(fragment) {
			var args = router._extractParameters(route, fragment);
			router.execute(callback, args);
			router.fireEvent('route:' + name, [route, name, args]);
			router.fireEvent('route', [route, name, args]);
			router.history.fireEvent('route', [route, name, args]);
			return
		});
		return this;
	},

	// Execute a route handler with the provided parameters.  This is an
	// excellent place to do pre-route setup or post-route cleanup.
	execute: function(callback, args) {
		if (callback) callback.apply(this, args);
	},

	// Simple proxy to `gx.core.History` to save a fragment into the history.
	navigate: function(fragment, options) {
		return this.history.navigate(fragment, options);
	},

	// Bind all defined routes to `gx.core.History`. We have to reverse the
	// order of the routes here to support behavior where the most general
	// routes can be defined at the bottom of the route map.
	_bindRoutes: function() {
		if (!this.options.routes)
			return;

		var route, routes = Object.keys(this.options.routes);
		while ((route = routes.pop()) != null) {
			this.route(route, this.options.routes[route]);
		}
	},

	// Convert a route string into a regular expression, suitable for matching
	// against the current location.
	_routeToRegExp: function(route) {
		route = route.replace(this.escapeRegExp, '\\$&')
								 .replace(this.optionalParam, '(?:$1)?')
								 .replace(this.namedParam, function(match, optional) {
									 return optional ? match : '([^/?]+)';
								 })
								 .replace(this.splatParam, '([^?]*?)');
		return new RegExp('^' + route + this.trailSlash + this.query + this.hash +'$');
	},

	// Given a route, and a URL fragment that it matches, return the array of
	// extracted decoded parameters. Empty or unmatched parameters will be
	// treated as `null` to normalize cross-browser behavior.
	_extractParameters: function(route, fragment) {
		var params = route.exec(fragment).slice(1);

		return params.map(function(param, i) {
			// Don't decode the search params.
			if (i >= params.length - 2)
				return param || null;

			return param ? decodeURIComponent(param) : null;
		});
	}

});

/**
 * Helper method to dynamically create routes with helper functions.
 * See example at bottom.
 * @param {string} base the base url
 */
gx.core.Router.Builder = function(base) {
	/** add anchor param for navigation */
	this.tab = function(tab) {
		base += '/#';
		this.okvparam('tab', tab);

		return this;
	},

	/** add required simple param */
	this.param = function(value) {
		if ( !value )
			throw new Error('Routebuild missing required param!');

		return this.oparam(value);
	},

	/** add optional simple param */
	this.oparam = function(value) {
		if ( value )
			base += '/' + value;

		return this;
	}

	/** add required key value param */
	this.kvparam = function(key, value) {
		if ( !value )
			throw new Error('Routebuild missing required param: ' + key);

		return this.okvparam(key, value);
	},

	/** add option key value param */
	this.okvparam = function (key, value) {
		if ( value )
			base += '/' + key + '/' + value;

		return this;
	},

	this.kvsep = function() {
		base += '/_';
		return this;
	}

	this.toString = function() {
		if ( base == '/' )
			return '';

		if ( base.substr(-2) == '/_' )
			base = base.substr(0, base.length-2);

		if ( base.substr(-1) == '/' )
			return base;

		return base + '/';
	}
};

// gx.core.Router.Builder example:
/*
var Routes = {
	shop         : 'shop',
	shopSearch   : 'shop/search/:query',
	shopApp      : 'shop/app/:app',
	app          : 'appdetails/:app',
	user         : 'user(/:user)',
	organization : 'organization(/:organization)',

	logout       : 'logout',

	getShop: function() { return this.shop; },

	getShopSearch: function(query) {
		return new gx.core.Router.Builder('shop').param(query)
			.toString();
	},
	getShopApp: function(app) {
		return new gx.core.Router.Builder('shop/app').param('app', app)
			.toString();
	},
	getApp: function(app, tab) {
		return new gx.core.Router.Builder('appdetails').param('app', app).tab(tab)
			.toString();
	},
	getUser: function(user, tab) {
		return new gx.core.Router.Builder('user').oparam(user).tab(tab)
			.toString();
	},
	getOrganization: function(organization, tab) {
		return new gx.core.Router.Builder('organization').oparam(organization).tab(tab)
			.toString();
	},

	getLogout: function () { return this.logout; },
}
*/

/**
 * Build query string of object like:
 * {key:'value', app:'net.zeyon.test'}
 * ->
 * /key/value/app/net.zeyon.test
 *
 * Starts with slash and adds trailing slash.
 *
 * @param  {object} params
 * @return {string}
 */
gx.core.Router.buildQueryParams = function(params) {
	var i, query = '';
	for ( i in params ) {
		if ( !params.hasOwnProperty(i) )
			continue;

		if ( i && params[i] )
			query += '/' + i + '/' + params[i];
	}
	return query + '/';
}

/**
 * Read query string to object. The corresponding function
 * of @gx.core.Router.buildQueryString().
 *
 * @param  {string} params
 * @return {object}
 */
gx.core.Router.readQueryParams = function(url) {
	if ( !url )
		return [];

	if ( url.substr(-1) === '/' )
		url = url.substr(0, url.length-1);

	if ( url[0] === '/' )
		url = url.substr(1);

	var result = {}, key, value;
	params = url.split('/');
	while ( params.length > 0 ) {
		value = params.pop();
		if ( params.length == 0 ) {
			key = value;
			value = null;
		} else
			key = params.pop();

		result[key] = value;
	}

	return result;
}