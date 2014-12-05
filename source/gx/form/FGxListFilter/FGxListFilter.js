/**
 * @class gx.form.FGxListFilter
 * @description Wrapper of gx.form.FSelect(). Formal class just do define places to hold the extra need fields 'filter field name' and 'filter field condition'
 * @extends gx.form.FSelect
 *
 * @author Sebastian Glonner <sglonner@zeyon.net>
 * @version 1.00
 * @package com
 * @copyright Copyright (c) 2011-2013, Zeyon (www.zeyon.net)
 */
gx.form.FGxListFilter = new Class({
	Extends: gx.form.FSelect,

	options: {
		buildFunction: 'GxListFilter',
		MSG_INVALID: 'You must choose field, condition, and compare value!',
	},

	initialize: function(attributes, label, validator, indicator, options) {

		this.parent(attributes, label, validator, indicator, options);
		indicator.options.merge = 'field';
		// Supposed to hold filter field names (instance of gx.form.FSelect)
		this._fieldName = null;
		// Supposed to hold filter field conditions (instance of gx.form.FSelect)
		this._fieldCond = null;
	},

	setCondField: function (field) {
		this._fieldCond = field;
	},

	getCondField: function () {
		return this._fieldCond;
	},

	setNameField: function (field) {
		this._fieldName = field;
	},

	getNameField: function () {
		return this._fieldName;
	},

	validate: function () {
		var valid = true;
		if ( this.getNameField().validate() !== true )
			valid = false;
		else if ( this.getCondField().validate() !== true )
			valid = false;
		else if ( this.parent() !== true )
			valid = false;

		if ( !valid )
			this.getValidator().fireEvent('invalid');
		else
			this.getValidator().fireEvent('valid');

		return valid;
	},

	getValue: function () {
		// Here you may want all three values and define a and extra method like getFilterValue
		return this.parent();
	},

	reset: function () {
		this.parent();
		if ( this._fieldName )
			this._fieldName.reset();

		if ( this._fieldCond )
			this._fieldCond.reset();
	}

});
