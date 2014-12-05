/**
 * @class gx.zeyos.Request
 * @description Utility class to send REST requests
 * @extends gx.core.Settings
 *
 * @option {string} service
 * @option {string} accesskey
 *
 * @sample Msgbox Try the different messagebox types with custom text.
 */
gx.zeyos.Request = new Class({
	Extends: gx.core.Settings,
	options: {
		'service': false,
		'accesskey': false
	},
	initialize: function (options) {
		this.parent(options);
	},
	/**
	 * @method setService
	 * @description Sets the ZeyOS REST service
	 * @param {string} service The service name
	 * @param {string} accesskey The access key
	 */
	setService: function(service, accesskey) {
		this.options.service = service;
		this.options.accesskey = accesskey == null ? accesskey : false;
	},
	/**
	 * @method send
	 * @description Performs a HTTP request
	 * @param {string} path The REST path (e.g. "list/") - please mind the exact name of your resource (e.g. mind trailing slashes)
	 * @param {object|string} data The request data
	 * @param {function} callback The callback function
	 * @param {string} method
	 */
	send: function(path, data, callback, method) {
		var req = new Request({
			'url': '../remotecall/'+this.options.service+(this.options.accesskey ? ':'+this.options.accesskey : '')+'/'+path,
			'method': method,
			'data': data,
			'onRequest': function() {
				this.fireEvent('request');
			}.bind(this),
			'onComplete': function() {
				this.fireEvent('complete');
			}.bind(this),
			'onFailure': function(xhr) {
				if (xhr.responseType == 'text') {
					var json = xhr.responseText;
					res = JSON.decode(json);
					if (typeOf(res) == 'object') {
						if (res.error != null)
							ZeyOSApi.showMsgRuntimeError('Error: '+res.error);
						else
							ZeyOSApi.showMsgRuntimeError('Invalid response (no result): '+json);
					}
					this.fireEvent('failure', json);
				}
				this.fireEvent('failure');
			}.bind(this),
			'onSuccess': function(json) {
				this.fireEvent('success', json);
				res = JSON.decode(json);
				if (typeOf(res) == 'object') {
					if (res.error != null) {
						ZeyOSApi.showMsgRuntimeError('Error: '+res.error);
						this.fireEvent('failure', json);
					} else if (res.result == null) {
						ZeyOSApi.showMsgRuntimeError('Invalid response (no result): '+json);
						this.fireEvent('failure', json);
					} else
						callback(res.result);
				} else {
					ZeyOSApi.showMsgRuntimeError('Invalid response: '+json);
				}
			}.bind(this)
		});
		req.send();
	},
	/**
	 * @method post
	 * @description Performs a POST request
	 * @param {string} path The REST path (e.g. "list/") - please mind the exact name of your resource (e.g. mind trailing slashes)
	 * @param {object|string} data The request data
	 * @param {function} callback The callback function
	 */
	'post': function(path, data, callback) {
		this.send(path, data, callback, 'POST');
	},
	/**
	 * @method get
	 * @description Performs a GET request
	 * @param {string} path The REST path (e.g. "list/") - please mind the exact name of your resource (e.g. mind trailing slashes)
	 * @param {object|string} data The request data
	 * @param {function} callback The callback function
	 */
	'get': function(path, data, callback) {
		this.send(path, data, callback, 'GET');
	},
	/**
	 * @method put
	 * @description Performs a PUT request
	 * @param {string} path The REST path (e.g. "list/") - please mind the exact name of your resource (e.g. mind trailing slashes)
	 * @param {object|string} data The request data
	 * @param {function} callback The callback function
	 */
	'put': function(path, data, callback) {
		this.send(path, data, callback, 'PUT');
	},
	/**
	 * @method delete
	 * @description Performs a DELETE request
	 * @param {string} path The REST path (e.g. "list/") - please mind the exact name of your resource (e.g. mind trailing slashes)
	 * @param {object|string} data The request data
	 * @param {function} callback The callback function
	 */
	'delete': function(path, data, callback) {
		this.send(path, data, callback, 'PUT');
	}
});
