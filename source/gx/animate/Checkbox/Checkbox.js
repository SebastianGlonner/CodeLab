/**
 * @class gx.animate.Checkbox
 * @description Animated checkbox
 * @extends gx.ui.Container
 *
 * @author Sebastian Glonner <sebastian.glonner@zeyon.net>
 * @version 1.00
 * @package Gx
 * @copyright Copyright (c) 2010, Sebastian Glonner
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 */
gx.animate.Checkbox = new Class({
	Extends: gx.ui.Container,

	options: {
		'clickable': true,
	},

	_theme: {
		root: 'gxAnimateCheckbox'
	},

	_state: false,
	initialize: function(display, options) {
		if ( !display )
			display = new Element('label');

		this.parent(display, options);

		this._ui.root.addClass(this._theme.root);

		if ( this.options.clickable ) {
			this._ui.root.addClass('clickable');
			this._ui.root.addEvent('click', function() {
				this.set(!this._ui.root.hasClass('checked'));
			}.bind(this));
		}
	},

	toggle: function() {
		this._state = !this._state;
		this.set(this._state);
	},

	set: function(bool) {
		this._state = bool;
		this._ui.root.toggleClass('checked', bool);
		this.fireEvent('changed', bool);
	},

	getValue: function() {
		return this._state;
	}

});