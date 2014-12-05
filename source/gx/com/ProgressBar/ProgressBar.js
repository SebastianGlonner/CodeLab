/**
 * @class gx.com.ProgressBar
 * @description Advanced input select element
 * @extends gx.ui.Container
 *
 * @param {string|node} display The input element.
 * @param {json object} options
 *
 * @option {string} cssClassPrefix Prefix for all css class names in use.
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
 *
 * @sample ProgressBar A small progress bar sample.
 */
gx.com.ProgressBar = new Class({
	Extends: gx.ui.Container,

	options: {
		cssPrefix: 'gxCom',
		text: false,
		start: 0
	},

	initialize: function(display, options) {
		this.parent(display, options);
		this._ui.border = new Element('div.' + this.options.cssPrefix + 'ProgressBar');

		this._ui.bar = new Element('div.bar', {'style': 'width:1px;'});
		this._ui.text = new Element('div.' + this.options.cssPrefix + 'ProgressBarText', {'style': 'width:100%;'});
		this._ui.border.adopt(this._ui.text, this._ui.bar);
		this._ui.root.adopt(this._ui.border);

		if ( this.options.start > 0 )
			this.setPercent(this.options.start);
	},

	setPercent: function (percent) {
		var width = this._ui.border.getStyle('width').toInt();
		var toWidth = (width / 100) * percent;
		var morph = new Fx.Morph(this._ui.bar, {
			duration: 500
		});
		morph.start({
			'width': ( percent == 0 ? 1 : toWidth ),
		});
		if ( this.options.text !== false ) {
			if ( typeof this.options.text == 'function' ) {
				this.options.text(this._ui.text);
			} else
				this._ui.text.set('html', percent + ' %');
		}
	}
});
