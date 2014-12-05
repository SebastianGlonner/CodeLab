
/**
 * @class gx.com.Client
 * @description Component for performing HTTP requests while displaying a status bar as well as status messages.
 * @extends gx.core.Settings
 * @implements gx.com.Message
 * @event request
 * @event complete
 * @event failure
 * @option {string} url The request URL
 */
gx.com.Client = new Class({
	Extends: gx.core.Settings,
	options: {
		'url': 'index.php'
	},
	initialize: function(options) {
		this.parent(options);
		this._msg = new gx.com.Message($(document.body), {'messageWidth': 400, 'duration': 10000});
	},
	
	/**
	 * @method addMessage
	 * @description Adds a Message
	 * @param {string} msg The message text
	 * @param {string} iconClass The icon class
	 * @param {bool} closable User can close the message
	 * @param {bool} blend Add a blend effect
	 * @param {bool} autoclose Close the message automatically
	 */
	addMessage: function(msg, iconClass, closable, blend, autoclose) {
		this._msg.addMessage(msg, iconClass, closable, blend, autoclose);
	},
	
	/**
	 * @method request
	 * @description Performs a request and displays the status
	 * @param {object} data The request data
	 * @param {string} method The HTTP method
	 * @param {function|object} callback The callback function or object
	 * @param {string} resulttype The result type
	 */
	request: function(data, method, callback, resulttype) {
		var root = this;
		var req = new Request({
			'url': root.options.url,
			'method': (method == null ? 'GET' : method),
			'data': data,
			'onRequest': function() {
				root._msg.showStatus(0.7, 'Requesting...');
			},
			'onComplete': function() {
				root._msg.hideStatus();
			},
			'onFailure': function() {
				root._msg.addMessage('Connection error! Could not retrieve data from server!', 'icoError', true, false, false);
			}
		});
		if (isFunction(callback)) {
			req.addEvent('complete', function(res) {
				if (resulttype != null) {
					res = JSON.decode(res);
					var t = typeOf(res);
					if (t != resulttype) {
						if (t == 'object' && res.message != null)
							root._msg.addMessage('Server error: ' + res.message, 'icoError', true, false, false);
						else
							root._msg.addMessage('Invalid server response! Server returned "' + t + '", "' + resulttype + '" expected!', 'icoError', true, false, false);
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
