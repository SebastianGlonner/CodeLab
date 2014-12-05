/**
 * @class gx.com.ApiRequester
 * @description Wrapping the gx.com.Requester to make it usable for the *Api pattern methods.
 * @extends gx.core.Settings
 *
 * @param {object} requester The object/function which do the final request
 * @param {object} options
 *
 */
gx.com.RequesterContainer = new Class({
	Extends: gx.ui.Container,

	options: {
		requester: null,
		showLoading: null
	},

	_requester: null,

	initialize: function(display, options) {
		this.parent(display, options);

		this._requester = new this.options.type(this.options.requester);
	},

	inject: function(element) {
		this._ui.root.adopt(element);

		return this;
	},

	addFilter: function(name, filter, client) {
		if ( typeOf(filter) == 'object' && instanceOf(filter, gx.ui.Container) ) {
			this.inject(filter);

			if ( client === true )
				filter.addEvent('change', this.filter.bind(this));
			else
				filter.addEvent('change', this.request.bind(this));
		}

		if ( instanceOf(this._requester, gx.com.ApiRequester) )
			this._requester.setDataArgument(null, name, filter, client);
		if ( instanceOf(this._requester, gx.com.Requester) )
			this._requester.setDataArgument(name, filter, client);

		return this;
	},

	filter: function(result) {
		this._requester.filter(result);

		return this;
	},

	request: function(onSuccess, onFailure) {
		if ( typeOf(this.options.showLoading) == 'function' )
			this.options.showLoading();

		return this._requester.request(onSuccess, onFailure);
	}
});