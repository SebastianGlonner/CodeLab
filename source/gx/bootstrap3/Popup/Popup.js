/**
 * @class gx.bootstrap.Popup
 * @description Displays a message box or status bar.
 * @extends gx.ui.Blend
 * @implements gx.util.Console
 *
 * @author Peter-Christoph Haider <peter.haider@zeyon.net>
 * @version 1.00
 * @package Gx
 * @copyright Copyright (c) 2010, Peter Haider
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 *
 * @param {string|node} display
 *
 * @option {string} color The color of the blend mask
 * @option {string} freezeColor The freeze color
 * @option {int} z-index The 'z' index
 * @option {float} opacity The opacity of the popup
 * @option {string} position The position modifier
 * @option {string} transition MooTools Fx.Transition function
 * @option {string} duration Blend effect duration
 * @option {bool} loader Show a loader bar
 * @option {bool} open Open on initialization
 * @option {object} content The content of the popup
 * @option {string} x The x coordinate of the popup
 * @option {string} y The y coordinate of the popup
 *
 * @sample Popup A sample popup window
 */
gx.bootstrap.PopupMeta = new (function() {
	this.zindex = 100;
	this.popups = [];

	this.register = function(popup) {
		this.popups.push(popup);
		this.zindex = this.zindex + 2;
		return this.zindex;
	}

	this.unregister = function(popup) {
		this.popups.erase(popup);
	}

	window.addEvent('keypress', function(e) {
		if (e.key == 'esc') {
			var popup = this.popups.pop();
			if (popup != null)
				popup.hide();
		}
	}.bind(this));
})();

gx.bootstrap.Popup = new Class({
	gx: 'gx.bootstrap.Popup',
	Extends: gx.ui.Blend,
	options: {
		'color': '#000',
		'freezeColor': '#000',
		'opacity': '0.40',
		'z-index': 110,
		'position': 'fixed',
		'transition': 'quad:in',
		'duration': '300',
		'loader': false,
		'open': false,
		'content': null,
		'x': 'center',
		'y': 'center',
		'width': 600,
		'closable': true,
		'closableOnModalClick': true,
		'borderbox': true,
		'contentType': 'auto',
		'emptyOnClose': false,
	},
	isOpen: false,
	initialize: function(options) {
		var root = this;
		this.parent($(document.body), options);

		this.build();
	},

	/**
	 * @method build
	 * @description Builds the popup
	 */
	build: function() {
		var root = this;
		this._display = Object.merge(this._display, {
			'modal': new Element('div', {
				'class': 'modal fade',
			}),
			'dialog': new Element('div', {'class': 'modal-dialog'}),
			'content': new Element('div', {'class': 'modal-content'}),
			'header' : new Element('div', {'class': 'modal-header'}),
			'footer': new Element('div', {'class': 'modal-footer'}),
			'body': new Element('div', {'class': 'modal-body'}),
		});

		if ( this.options.width )
			this._display.dialog.setStyle('width', this.options.width);

		if (this.options.title) {
			this._display.title = new Element('h3', {'html': this.options.title})
			this._display.header.adopt(this._display.title);
			this._display.content.adopt(this._display.header);
		}

		this._display.content.adopt(this._display.body);
		this._display.modal.adopt(this._display.dialog);
		this._display.dialog.adopt(this._display.content);

		if (this.options.footer) {
			this._display.content.adopt(this._display.footer.adopt(this.options.footer));
		}

		if (this.options.content)
			this.setContent(this.options.content);

		this._display.modal.inject(this._display.root);

		if (this.options.closable) {
			if (this.options.closableOnModalClick) {
				this._display.modal.addEvent('click', function(event) {
					root.hide();
				});
			}

			this._display.dialog.addEvent('click', function(event) {
				event.stopPropagation();
			});

			var closeX = new Element('a', {'class': 'close', 'html': '×'});
			closeX.addEvent('click', function() {
				root.hide();
			});
			closeX.inject(this._display.content, 'top');
		}

		this._parent.addEvent('resize', function() {
			root.setPosition();
		});

		this._display.modal.setStyle('display', 'none');

		if ( this.options.minHeight )
			this._display.body.setStyle('minHeight', this.options.minHeight);

		if ( this.options.contentType === 'fixed' ) {
			window.addEvent('resize', function() {
				root.setMaxContentHeight();
			});

			this.addEvent('show', this.setMaxContentHeight.bind(this));
		}
	},

	/**
	 * @method setTitle
	 * @description Sets the title of the popup
	 * @param {string} title The title to set
	 */
	setTitle: function(title) {
		this._display.title.set('html', title);
	},

	/**
	 * @method setContent
	 * @description Sets the content of the popup
	 * @param {string} content The content to set
	 */
	setContent: function(content) {
		try {
			this._display.body.empty();
			switch (typeOf(content)) {
				case 'element':
				case 'elements':
				case 'textnode':
					this._display.body.adopt(content);
					break;
				case 'object':
					this._display.body.adopt(__(content));
					break;
				case 'string':
				case 'number':
					this._display.body.set('html', content);
					break;
			}
		} catch(e) { gx.util.Console('gx.bootstrap.Popup->initialize', e.message); }
	},

	getContent: function() {
		return this._display.body;
	},

	/**
	 * @deprecated
	 *
	 * @param {integer} height
	 * @param {integer} adjust
	 */
	setMaxContentHeight: function(height, adjust) {
		if ( !height ) {
			// - 60 cause of 30px margin bottom and top
			// - 2 cause of borders from the modal-box
			height = window.getSize().y - 62;

			if ( this._display.footer )
				height -= this._display.footer.getSize().y;

			if ( this._display.header )
				height -= this._display.header.getSize().y;
		}

		this._display.body.setStyle('maxHeight', height);

		return height;
	},

	/**
	 * @deprecated
	 * @method setPosition
	 * @description Sets the popup position
	 * @param {string} x Horizontal position (left, right, center)
	 * @param {string} y Vertical position (top, bottom, center)
	 */
	setPosition: function() {
		// Positioning completely done with bootstraps css.
	},

	/**
	 * @method show
	 * @description Shows the popup
	 */
	show: function() {
		var root = this;
		try {
			var zindex = gx.bootstrap.PopupMeta.register(this);
			this._display.modal.setStyle('z-index', zindex);
			this._display.blend.setStyle('z-index', zindex-1);

			this._display.modal.setStyle('display', 'block');

			// Trigger browser style calculations
			root._display.modal.offsetWidth;

			root._display.modal.addClass('in');
			root.fireEvent('show');

			this.lock(1);
		} catch(e) { gx.util.Console('gx.bootstrap.Popup->show: ', e.message); }
	},

	/**
	 * @method hide
	 * @description Hides the popup
	 */
	hide: function() {
		// Preventing an immediate close of the popup on double click the
		// popup button, whereas the blend remaining visible (because the
		// second click will receive already the blend)
		if ( this._isOpen !== 1 )
			return;

		var root = this;
		try {
			gx.bootstrap.PopupMeta.unregister(this);
			root._display.modal.removeClass('in');
			(function() {
				root._display.modal.setStyle('display', 'none');
			}).delay(150);

			if ( this.options.emptyOnClose )
				this.setContent(new Element('div'));

			this.lock(0);
		} catch(e) { gx.util.Console('gx.bootstrap.Popup->hide: ', e.message); }
	},

	destroy: function() {
		gx.bootstrap.PopupMeta.unregister(this);

		[
			this._ui.blend,
			this._display.blend,
			this._ui.modal,
			this._display.modal
		].each(function(item) {
			if ( item != null ) {
				item.destroy();
			}
		});

		delete this;

	},

	doDestroy: function() {
		this.destroy();
	}
});
