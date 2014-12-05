/**
 * @class gx.zeyos.Popup
 * @description Creates a popup window
 * @extends gx.core.Settings
 * @implements gx.core.Parse
 * @implements gx.ui.Popup
 * @implements gx.util.Console
 *
 * @option {int} width The width of the popup
 * @option {bool} closable The popup closes if modal is clicked
 * @option {string|Element} content The content of the popup
 *
 * @event show
 * @event hide
 *
 * @sample Popup A sample popup window
 */
gx.zeyos.Popup = new Class({
	gx: 'gx.zeyos.Popup',
	Extends: gx.core.Settings,
	options: {
		'width': 600,
		'closable': true,
		'overlayDismiss': true,
		'content': false
	},
	initialize: function(options) {
		var root = this;
		try {
			this.parent(options)
			this._display = {
				/*
				'popup': new Element('div', {
					'id': 'pop',
				}),
				*/
				'aside': new Element('aside'),
				'content': new Element('section')
			};

			if (this.options.closable) {
				this._display.aside.adopt(
					new Element('div', {
						'class': 'img_close',
						'title': 'Close'
					})
						.addEvent('click', function() {
							root.hide();
						})
				);
			}

			this._display.aside.adopt(this._display.content);

			this._popup = new gx.ui.Popup($(document.body), {
				'color': '#000',
				'freezeColor': '#000',
				'opacity': '0.40',
				'content': root._display.aside
			});
			this._popup._display.content.addClass('pop');
			if ( this.options.closable && this.options.overlayDismiss ) {
				this._popup.addEvent('click', function() {
					root.hide();
				});
			}
			//root._display.aside.inject(root._display.popup, 'after');

			if (this.options.content)
				this.setContent(this.options.content);

		} catch(e) { gx.util.Console('gx.zeyos.Popup->initialize', e.message); }
	},

	/**
	 * @method show
	 * @description Shows the popup
	 * @param {object} opt Additional options for the event handler
	 */
	show: function(opt) {
		this.fireEvent('show', opt);
		this._popup.show();
		this._popup._display.content.addClass('act');
		return this.setPosition();
	},

	/**
	 * @method hide
	 * @description Hides the popup
	 * @param {object} opt Additional options for the event handler
	 */
	hide: function(opt) {
		this.fireEvent('hide', opt);
		this._popup.hide();
		this._popup._display.content.removeClass('act');
		return this;
	},

	/**
	 * @method setContent
	 * @description Sets the content of the popup
	 * @param {string} content The content to set
	 */
	setContent: function(content) {
		try {
			this._display.content.empty();
			switch (typeOf(content)) {
				case 'element':
				case 'elements':
				case 'textnode':
					this._display.content.adopt(content);
					break;
				case 'object':
					this._display.content.adopt(__(content));
					break;
				case 'string':
				case 'number':
					this._display.content.set('html', content);
					break;
			}
		} catch(e) { gx.util.Console('gx.zeyos.Popup->initialize', e.message); }

		return this;
	},
	
	setPosition: function(x, y) {
		var root = this;
		try {
			if (x == null) x = this.options.x;
			if (y == null) y = this.options.y;
			var windowSize = window.getSize();
			var coordinates = this._display.content.getCoordinates();
			
			if (x == 'left')
				this._popup._display.content.setStyle('left', 5);
			else if (x == 'right')
				this._popup._display.content.setStyle('left', windowSize.x - coordinates.width - 35);
			else 
				this._popup._display.content.setStyle('left', (windowSize.x - coordinates.width)/2);

			if (y == 'top')
				this._popup._display.content.setStyle('top', 15);
			else if (y == 'bottom')
				this._popup._display.content.setStyle('top', windowSize.y - coordinates.height - 25);
			else
				this._popup._display.content.setStyle('top', (windowSize.y - coordinates.height)/2);
				
		} catch(e) { gx.util.Console('gx.zeyos.Popup->setPosition: ', e.message); }

		return this;
	}

});
