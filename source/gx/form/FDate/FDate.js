/**
 *
 * @class gx.form.FDate
 * @description !!! UNCOMPLETE !!! Form date field.
 * @extends gx.form.Field
 *
 * @param {string|node} display The input element.
 * @param {json object} options
 *
 * @option {date|int} default Default date! Date object or unix timestamp integer.
 * @option {string} format Mootools date format.
 * @option {string} validatorFormat Validate date format.
 * @option {boolean} unixTimestamp Value is unix timestamp?
 * @option {boolean} adjust Unix timestamp adjustment. Example: php unix timestamp in seconds. Javascript unix timestamp in milliseconds. Adjustment factor 1000!
 *
 * @author Peter-Christoph Haider <peter.haider@zeyon.net>, Sebastian Glonner <sglonner@zeyon.net>
 * @version 1.00
 * @package form
 * @copyright Copyright (c) 2011-2013, Zeyon (www.zeyon.net)
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 *
 * @sample Field A small formular example.
 */
gx.form.FDate = new Class({
	Extends: gx.form.Field,
	options: {
		'default': new Date(),
		format: '%d.%m.%Y %H:%M:%S',
		validatorFormat: 'ddmmyyyy',
		unixTimestamp: true,
		adjust: 1000,
		MSG_INVALID: 'Invalid Date'
	},

	initialize: function(attributes, label, validator, indicator, options) {
		this.parent(attributes, label, validator, indicator, options);
		validator.addRule(['date', this.options.validatorFormat]);
	},

	/**
	 * Validates the field using the assigned validator objects
	 */
	validate: function() {
		try {
			var valid = this._validator.validate(this.getInput().get('value'));
			if ( valid === true )
				return true;

			return this._validator.getErrors();
		} catch(e) { gx.util.Console('gx.form.Field->validate', e.message); return false; }
	},

	getValue: function () {
		if ( this.options.unixTimestamp ) {
			var date = new Date();
			Date.defineParser(this.options.format);
			date.parse(this.getInput().get('value'));
			return ( date.getTime() / this.options.adjust );
		} else {
			return this.parent();
		}
	},

	getDisplayValue: function () {
		return this.getInput().get('value');
	},

	setValue: function (value) {
		if ( this.options.unixTimestamp ) {
			var date = new Date();
			date.setTime(value);
			this.getInput().set('value', new Date(value * this.options.adjust).format(this.options.format));
		} else {
			this.parent(value);
		}
	},

	reset: function () {
		if ( this.options.default != '' ) {
			if ( this.options.unixTimestamp ) {
				this.setValue((this.options.default.getTime() / this.options.adjust));
			} else {
				this.parent(this.options.default.format(this.options.format));
			}
		} else {
			this.setValue(this.options.default);
		}

	}

});
