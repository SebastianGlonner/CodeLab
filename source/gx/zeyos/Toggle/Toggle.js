/**
 * @class gx.zeyos.Toggle
 * @description Creates a switch component
 * @extends gx.ui.Container
 *
 * @param {element|string} display The display element
 *
 * @option {mixed} value
 * @option {boolean} on The initial switch state (default: off)
 *
 * @event check
 * @event uncheck
 */
gx.zeyos.Toggle = new Class({
	Extends: gx.ui.Container,

	options: {
		'value': true,
		'on': false
	},

	initialize: function(display, options) {
		this.parent(display, options);

		var root = this;
		this._display.root.addClass('tgl');
		this._display.root.addEvent('click', function() {
			root.toggle();
		});

		if ( this.options.on )
			this._display.root.addClass('act');
	},

	getState: function() {
		if ( this._display.root.hasClass('act') )
			return true;
		else
			return false;
	},

	getValue: function() {
		if ( this._display.root.hasClass('act') )
			return this.options.value;
		else
			return false;
	},

	toggle: function() {
		if ( this._display.root.hasClass('act') )
			this.setUnchecked();
		else
			this.setChecked();
	},

	setChecked: function() {
		this._display.root.addClass('act');
		this.fireEvent('check');
	},

	setUnchecked: function() {
		this._display.root.removeClass('act');
		this.fireEvent('uncheck');
	}
});
