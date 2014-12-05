/**
 *
 * @class gx.form.Indicator
 * @description Handle field helper text dynamics.
 * @extends gx.core.Settings
 *
 * @param {json object} options
 *
 * @option {string} message Message shown if validation fail.
 * @option {string} merge Merge messages? Valuse: - merge: all messages will be merged. - extern: messages from extern (might be validator) will be shown only. - indicator: message of the indicator will be shown. - field: message of the field will be shown.
 * @option {string} separator Separator string in case of merging messages.
 *
 * @author Peter-Christoph Haider <peter.haider@zeyon.net>, Sebastian Glonner <sglonner@zeyon.net>
 * @version 1.00
 * @package form
 * @copyright Copyright (c) 2011-2013, Zeyon (www.zeyon.net)
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 *
 * @sample Validator A small validator example.
 */

gx.form.Indicator = new Class({
	Extends: gx.core.Settings,
	options: {
		cssPrefix: 'gxForm',
		message: '',
		merge: 'extern',
		separator: '<br>'

	},

	_visible: false,

	_field: null,

	initialize: function(options) {
		this.parent(options);
	},

	setField: function (field) {
		this._field = field;
	},

	/**
	 * Shows the indicator in case validation fails
	 *
	 * @param errorMsg The error message to display on mouseover
	 */
	show: function(msg) {
		try {
			if ( this._visible === true )
				return;

			msg = this.messageMerge(msg);
			var indicator = this._field.getIndicator();
			this._field.getLine().addClass(this.options.cssPrefix + 'Error');
			indicator.set('html', msg);
			indicator.setStyle('opacity', 0);
			indicator.get('tween').removeEvents('complete');
			indicator.show();
			indicator.fade(1);
			this._visible = true;
		} catch(e) { gx.util.Console('gx.form.Indicator->show', e.message); }
	},

	/**
	 * Hides the indicator
	 */
	hide: function() {
		try {
			var indicator = this._field.getIndicator();
			indicator.set('tween', {
				'onComplete': function() {
					this._field.getLine().removeClass(this.options.cssPrefix + 'Error');
					indicator.hide();
					indicator.set('tween', null);
				}.bind(this)
			});
			indicator.fade(0);
			this._visible = false;
		} catch(e) { gx.util.Console('gx.form.Indicator->hide', e.message); }
	},

	messageMerge: function (msg) {
		if ( msg == undefined ) {
			msg = '';
		}
		if ( this.options.merge == 'extern') {
			return msg;
		}
		if ( this.options.merge == 'indicator') {
			return this.options.msg;
		}
		if ( this.options.merge == 'field') {
			return this._field.options.MSG_INVALID;
		}
		if ( this.options.message != '' ) {
			msg = msg + this.options.separator + this.options.msg;
		}
		if ( this._field.options.MSG_INVALID != '' ) {
			msg = this._field.options.MSG_INVALID +  this.options.separator + msg;
		}
		return msg;
	}

});
