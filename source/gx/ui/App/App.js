/**
 * @class gx.ui.App
 * @description Abstract class represents an application.
 * @extends gx.core.Settings
 * @implements gx.ui.Blend
 *
 * @author Sebastian Glonner <sglonner@zeyon.net>
 * @version 1.00
 * @package ria
 * @copyright Copyright (c) 2011-2013, Zeyon (www.zeyon.net)
 *
 * @sample Pages A small pages example.
 */
gx.ui.App = new Class({
	Extends: gx.core.Settings,

	options: {
		cssPrefix: 'gxUiApp',
		checkResponse: null,
		checkJSONSuccess: null,
		requestFailure: null,
		errorHandler: null,

		setLoading: null,
		resetLoading: null,

		blendOptions: {
			loader: true,
			opacity: 0,
		}
	},

	_blend: null,
	_onSuccess: null,
	_onFailure: null,

	initialize: function(options) {
		this.options.checkJSONSuccess = this.checkJSONSuccess.bind(this);
		this.options.requestFailure = this.requestFailure.bind(this);
		this.options.errorHandler = this.errorHandler.bind(this);
		this.options.setLoading = this.setLoading.bind(this);
		this.options.resetLoading = this.resetLoading.bind(this);

		this.parent(options);
	},

	Request: function (options, type) {
		if ( options == undefined )
			options = {};

		if ( options.onRequest == undefined ) {
			options.onRequest = this.options.setLoading.bind(this);
		}
		if ( options.onComplete == undefined ) {
			options.onComplete = this.options.resetLoading.bind(this);
		}

		switch ( type ) {
			case 'json':

				var onSuccess = options.onSuccess;
				options.onSuccess = function (response, text) {
					this.options.checkJSONSuccess(response, text);
					onSuccess(response, text);
				}.bind(this);

				if ( options.onError == undefined ) {
					options.onError = function (text, error) {
						this.errorHandler('gx.ui.Ap->checkJSONSuccess', 'json parse error: ' + error + '\n\ntext:' + text);
					}.bind(this);
				}

				return new Request.JSON(options);
				break;

			case 'html':
				return new Request.HTML(options);
				break;

			default:
				return new Request(options);
		}
	},
	RequestJSON: function (options) {
		return this.Request(options, 'json');
	},

	RequestHTML: function (options) {
		return this.Request(options, 'html');
	},

	checkJSONSuccess: function (response, text) {
		var t = typeOf(response);
		if ( t == 'object' ) {
			if (response.error != null)
				this.options.errorHandler('gx.ui.Ap->checkJSONSuccess', 'Server Request Error: ' + response.error);
			else if (response.result == null)
				this.options.errorHandler('gx.ui.Ap->checkJSONSuccess', 'Undefined Request Result');

		} else {
			this.options.errorHandler('gx.ui.Ap->checkJSONSuccess', 'parseResult: Invalid data type: ' + t);
		}
	},

	requestFailure: function (response) {
		alert('We are sry but the request failed. If this happens again contact the application administrator.');
		//this.options.errorHandler('gx.ui.Ap->requestFailure', 'Sry the request failed.');
	},

	errorHandler: function (from, msg) {
		gx.util.Console(from, msg);
	},

	setLoading: function () {
		if ( this._blend == null ){
			this._blend = new gx.ui.Blend(document.body, this.options.blendOptions);
		}
		this._blend.show();
	},

	resetLoading: function () {
		this._blend.hide();
	}
});
