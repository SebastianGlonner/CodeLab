/**
 * @class gx.form.Button
 * @description Button with types in Bootstrap from Twitter style.
 * @extends gx.core.Settings
 *
 * @param {json object} attributes Button attributes.
 * @param {json object} options
 *
 * @option {string} cssClassPrefix Prefix for all css class names in use.
 * @option {string} type Button type: default (default), primary, danger, success, info
 *
 * @author Sebastian Glonner <sglonner@zeyon.net>
 * @version 1.00
 * @package ui
 * @copyright Copyright (c) 2011-2013, Zeyon (www.zeyon.net)
 *
 * @sample Select A efesadvanced select example.
 */
gx.form.Button = new Class({
	Extends: gx.core.Settings,

	options: {
		cssPrefix: 'gxFormButton',
		type: 'default'
	},

	initialize: function(attributes, options) {
		this.parent(options);

		if ( attributes == undefined )
			attributes = {};

		if ( attributes.class == undefined ) {
			attributes.class = this.options.cssPrefix
		}
		attributes.type = 'button';
		var button = new Element('input', attributes);
		button.addClass(this.options.type);
		return button;
	}

});
