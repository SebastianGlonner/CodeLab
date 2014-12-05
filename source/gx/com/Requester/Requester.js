/**
 * @class gx.com.Requester
 * @description Container for wrapping a request with arbitary filters for easy request repeating with these filters. Filters can be server or client side.
 * @extends gx.core.Settings
 *
 * @param {object} requester The object/function which do the final request
 * @param {object} options
 *
 */
gx.com.Requester = new Class({
	Extends: gx.core.Settings,

	options: {

	},

	_server: {},
	_client: {},
	_requester: null,

	_onSuccess: null,
	_onFailure: null,

	_result: null,

	initialize: function(requester, options) {
		if ( requester == null )
			throw new Error('Illegal argument exception');

		this.parent(options);

		this._requester = requester;
	},

	/**
	 * @method setDataArgument
	 * @description Sets a request data property. Can be simple string or object with method 'getData'(server side) | 'filter'(client side)
	 * @param {string} name Name of the request argument.
	 * @param {string/object} value Static string of object which will provide the value dynamically.
	 * @param {bool} client False|Null = server side request property, True = client side filter
	 */
	setDataArgument: function(name, value, client) {
		var type = this._server;

		if ( client === true ||
			(typeOf(value) == 'object' &&
			typeOf(value.filter) == 'function') )
			type = this._client;

		if ( type[name] == null )
			type[name] = [];

		type[name].push(value);

		return this;
	},

	/**
	 * @method request
	 * @description Do request. Methods get saved and reused on repeated requests.
	 * @param {function} onSuccess Function which will be processed to the requester object.
	 * @param {function} onFailure Function which will be processed to the requester object.
	 */
	request: function(onSuccess, onFailure) {
		var i, j, d, filer, filters, data = {};
		for ( var i in this._server ) {
			if ( !this._server.hasOwnProperty(i) )
				continue;

			filters = this._server[i];
			value = {};

			for ( j = 0; j < filters.length; j++ ) {
				filter = filters[j];

				if ( typeOf(filter['getData']) == 'function' )
					d = filter.getData();
				else
					d = filter;

				if ( typeOf(d) == 'object' && typeOf(value) == 'object' )
					Object.merge(value, d);
				else
					value = d;

			}

			if ( value == null )
				delete data[i];
			else
				data[i] = value;
		}

		this.serverRequest(data, onSuccess, onFailure);
	},

	setCallbacks: function(onSuccess, onFailure) {
		if ( onSuccess != null )
			this._onSuccess = onSuccess;

		if ( onFailure != null )
			this._onFailure = onFailure;

	},

	serverRequest: function(data, onSuccess, onFailure) {
		this.setCallbacks(onSuccess, onFailure);

		this._requester(
			data,
			this.filter.bind(this),
			this._onFailure != null ? this._onFailure.bind(this) : null
		);
	},

	filter: function(result) {
		if ( result == null )
			result = this._result;
		else {
			this._result = result;
		}

		this.clientFilter(result);
	},

	clientFilter: function(result) {
		var filtered;
		if ( typeOf(result) == 'object' )
			filtered = Object.clone(result);
		else if ( typeOf(result) == 'array')
			filtered = Array.clone(result);

		var i, filters, filter;
		for ( i in this._client ) {
			if ( !this._client.hasOwnProperty(i) )
				continue;

			filters = this._client[i];
			for ( j = 0; j < filters.length; j++ ) {
				filter = filters[j];

				filtered = filter.filter(filtered);
			}
		}

		if ( this._onSuccess != null )
			this._onSuccess(filtered);
	}
});