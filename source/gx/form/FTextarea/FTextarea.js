/**
 * @class gx.form.FTextarea
 * @description !!! UNCOMPLETE !!! Advanced input select element
 * @extends gx.form.Field
 *
 * @param {string|node} display The input element.
 * @param {json object} options
 *
 * @option {string} cssPrefix Prefix for all css class names in use.
 * @option {string} separator String which separators selected values while using multiple select.
 * @option {boolean} searchMode Activate search mode.
 * @option {boolean} touchpad Activate touchpad usability mode.
 * @option {boolean} multiple Allow multiple selections.
 * @option {boolean} autoTextarea Use textarea instead of input field. This textarea will automatically scale with selected values.
 * @option {boolean} fixedList Dont move the selection list while the textarea expand.
 * @option {integer} size The size of the selection list.
 * @option {integer} hideDelay (Milliseconds) The delay before hide selection list.
 *
 * @author Sebastian Glonner <sglonner@zeyon.net>
 * @version 1.00
 * @package com
 * @copyright Copyright (c) 2011-2013, Zeyon (www.zeyon.net)
 */
gx.form.FTextarea = new Class({
	Extends: gx.form.Field,

	options: {

	},

	initialize: function(attributes, label, validator, indicator, options) {
		this.parent(attributes, label, validator, indicator, options);
		this._ui.input = new Element('textarea', attributes);
		this._ui.edit = this._ui.input;
	},

});
