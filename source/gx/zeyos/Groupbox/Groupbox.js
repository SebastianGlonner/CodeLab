/**
 * @class gx.zeyos.Groupbox
 * @description Creates a collapsable groupbox
 * @extends gx.ui.Container
 *
 * @param {element|string} display The display element
 *
 * @option {string} title: The title of the groupbox
 * @option {bool} show: Show or collapse the groupbox
 *
 * @sample Groupbox Simple groupbox example.
 */
gx.zeyos.Groupbox = new Class({
	gx: 'gx.zeyos.Groupbox',
	Extends: gx.ui.Container,
	options: {
		'title': '',
		'show': true
	},
	_isOpen: true,
	initialize: function(display, options) {
		var root = this;
		try {
			this.parent(new Element('div', {'class': 'm_l-10 m_r-10'}), options);
			this._display.body = display;
			this._display.root.inject(this._display.body, 'before');
			this._display.inner = new Element('div', {'class': 'bg-F br_b-5 bsd-2 fs-11 tsd_b-W8'});
			this._display.bar = new Element('h1', {'html': root.options.title});
			this._display.root.adopt([this._display.bar, this._display.inner.adopt(this._display.body)])

			this._display.bar.addEvent('click', function() {
				this.toggle();
			}.bind(this));
			if (this.options.show)
				this._display.bar.addClass('act');
		} catch(e) { gx.util.Console('gx.zeyos.Groupbox->initialize', e.message); }
	},

	/**
	 * @method toggle
	 * @description Toggles the visibility of the groupbox (hide/show)
	 */
	toggle: function() {
		this._display.bar.toggleClass('act');
	},

	/**
	 * @method show
	 * @description Shows the groupbox
	 */
	show: function() {
		this._display.bar.addClass('act');
	},

	/**
	 * @method hide
	 * @description Hides the groupbox
	 */
	hide: function() {
		this._display.bar.removeClass('act');
	},

	/**
	 * @method isOpen
	 * @return {Boolean}
	 */
	isOpen: function() {
		return this._display.bar.hasClass('act');
	}
});
