/**
 * @class gx.com.ApiRequester
 * @description Wrapping the gx.com.Requester to make it usable for the *Api pattern methods.
 * @extends gx.core.Settings
 *
 * @param {object} requester The object/function which do the final request
 * @param {object} options
 *
 */
gx.com.ApiRequester = new Class({
	Extends: gx.com.Requester,

	dataToArgs: {},

	setDataArgument: function(argIndex, name, value, client) {
		if ( this.dataToArgs[name] != null )
			argIndex = this.dataToArgs[name];

		if ( argIndex == null ) {
			argIndex = Object.getLength(this.dataToArgs);
		}

		if ( value == null ) {
			delete this.dataToArgs[argIndex];
			return this.parent(name, value, client);
		}

		this.dataToArgs[name] = argIndex;
		return this.parent(name, value, client);
	},

	dataToArguments: function(data) {
		var arr = new Array(Object.getLength(data));
		for ( var i in this.dataToArgs ) {
			if ( !this.dataToArgs.hasOwnProperty(i) )
				continue;

			arr[this.dataToArgs[i]] = data[i];
		}

		return arr;
	},

	serverRequest: function(data, onSuccess, onFailure) {
		this.setCallbacks(onSuccess, onFailure);

		data = this.dataToArguments(data);
		data.push(this.filter.bind(this));

		if ( this._onFailure != null )
			data.push(this._onFailure);

		return this._requester.apply(this, data);
	}
});