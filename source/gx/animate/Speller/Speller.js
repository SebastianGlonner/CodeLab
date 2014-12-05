/**
 * @class gx.animate.Speller
 * @description Animate words|chars
 * @implements gx.ui.Container
 *
 * @author Sebastian Glonner <sebastian.glonner@zeyon.net>
 * @version 1.00
 * @package Gx
 * @copyright Copyright (c) 2010, Sebastian Glonner
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 */
gx.animate.Speller = new Class({
	Extends: gx.ui.Container,

	options: {
		type: 'words', // | 'chars'
		text: '',
		delay: 100
	},

	_theme: {
		root: 'gxAnimateSpeller'
	},

	_pieces: [],
	initialize: function(display, options) {
		if ( !display )
			display = new Element('span');

		this.parent(display, options);

		this._ui.root.addClass(this._theme.root);

		this.build();
	},

	build: function() {
		var ele = this._ui.root;
		var text = this.options.text;
		if (this.options.type == 'words') {
			text = text.split(' ');
		}
		var l = text.length, i, s;

		for ( i = 0; i < l; i++) {
			s = new Element('span', {'html' : text[i]});
			this._pieces.push(s);
			ele.adopt(s);

			if (this.options.type == 'words') {
				ele.adopt(new Element('span', {
					'class' : 'active',
					'html': '&nbsp;'
				}));
			}
		}

	},

	show: function() {
		this.activate(0, 'active');
	},

	showHard: function() {
		this._ui.root.addClass('hardActive');
	},

	activate: function(i, type) {
		this._pieces[i].addClass(type);

		if (this._pieces[i + 1]) {
			setTimeout(function() {
				this.activate(i + 1, type);
			}.bind(this), this.options.delay);
		}
	}

});