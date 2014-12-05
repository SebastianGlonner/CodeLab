
/**
 * @class gx.zeyos.Client
 * @description Component for performing HTTP requests while displaying a status bar as well as status messages.
 * @extends gx.core.Settings
 * @implements gx.com.Message
 * @event request
 * @event complete
 * @event failure
 * @option url The request URL
 */
gx.zeyos.Client = new Class({
	// gx.core.Settings
	options: {
		'url': './remotecall.php'
	},
	
	post: function(path, data, callback, resulttype) {
		this.request(data, 'POST', callback, resulttype, path);
	},
	
	get: function(path, data, callback, resulttype) {
		this.request(data, 'GET', callback, resulttype, path);
	},
	
	/**
	 * @method request
	 * @description Performs a request and displays the status
	 * @param {object} data The request data
	 * @param {string} method The HTTP method
	 * @param {function|object} callback The callback function or object
	 * @param {string} resulttype The result type
	 * @param {string} path
	 */
	request: function(data, method, callback, resulttype, path) {
		var root = this;
		var req = new Request({
			'url': root.options.url + (path == null ? '' : path),
			'method': (method == null ? 'GET' : method),
			'data': data,
			'onRequest': function() {
				// root._msg.showStatus(0.7, 'Requesting...');
			},
			'onComplete': function() {
				// root._msg.hideStatus();
			},
			'onFailure': function() {
				ZeyOSApi.showMsgRuntimeError('Connection error! Could not retrieve data from server!');
			}
		});
		if (isFunction(callback)) {
			req.addEvent('complete', function(res) {
				if (resulttype != null) {
					res = JSON.decode(res);
					var t = typeOf(res);
					if (t != resulttype) {
						if (t == 'object' && res.message != null)
							ZeyOSApi.showMsgRuntimeErrore('Server error: ' + res.message);
						else
							ZeyOSApi.showMsgRuntimeError('Invalid server response! Server returned "' + t + '", "' + resulttype + '" expected!');
						res = false;
					}
				}
				callback.run([res], root);
			})
		} else if (isObject(callback)) {
			for (evtType in callback)
				req.addEvent(evtType, callback[evtType]);
		}
		req.send();
	}
});