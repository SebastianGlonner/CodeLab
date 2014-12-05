/**
 * @class gx.zeyos.Factory
 * @description Use to easily create ZeyOS html elements.
 *
 * @extends gx.ui.Container
 */
gx.zeyos.Factory = {
	gx: 'gx.zeyos.Factory',

	/**
	 * icons: {
	 *	   'list'
	 *	   'plus'
	 *	   'clock'
	 *	   'range'
	 *	   'reload'
	 *	   'clear'
	 *	   'settings'
	 *	   'eye'
	 *	   'trash'
	 *	   'fields'
	 *	   'search'
	 *	   'lock'
	 *	   'checked'
	 * }
	 *
	 * @method Icon
	 * @description Get icon sign from icon name. Used for buttons.
	 * @param {string} ico Icon name.
	 */
	Icon: function(ico) {
		if ( ico == 'list' )
			ico = 'l';
		else if ( ico == 'plus' )
			ico = '⊕';
		else if ( ico == 'clock' )
			ico = '⌚';
		else if ( ico == 'range' )
			ico = 's';
		else if ( ico == 'reload' )
			ico = '⟲';
		else if ( ico == 'clear' )
			ico = 'd';
		else if ( ico == 'settings' )
			ico = 'e';
		else if ( ico == 'eye' )
			ico = 'E';
		else if ( ico == 'trash' )
			ico = 'T';
		else if ( ico == 'fields' )
			ico = 'g';
		else if ( ico == 'search' )
			ico = 'z';
		else if ( ico == 'lock' )
			ico = 'L';
		else if ( ico == 'checked' )
			ico = '✔';
		else if ( ico == 'question' )
			ico = '?';
		else
			alert('unsupported icon');

		return ico;
	},

	/**
	 * types: {
	 *    ''     = gray
	 *    'em'   = gray
	 *    'grey' = gray
	 *    'gray' = gray
	 *
	 *    'dark' = dark
	 * }
	 *
	 * ico @see gx.zeyos.Factory.Icon()
	 *
	 * @method Button
	 * @description Return button element.
	 * @param {string} ico Icon name.
	 */
	Button: function(text, type, ico, options) {
		if ( options == undefined )
			options = {};

		if ( type == null )
			type = '';
		else if ( type == 'dark' )
			type = 'em';
		else if ( type == 'gray' || type == 'grey' )
			type = '';

		if ( ico != undefined )
			ico = gx.zeyos.Factory.Icon(ico);
		else
			ico = '';

		var button = new Element('button', Object.merge({
			'type': 'button',
			'value': text,
			'class': type,
			'html': text
		}, options));

		if ( text == null || text == '' )
			button.set('data-ico', ico);
		else
			button.set('data-ico-a', ico);

		return button;
	},

	/**
	 * @method ButtonsGroup
	 * @description Create group of buttons
	 * @param {array} buttons Array of buttons to group.
	 */
	ButtonsGroup: function(buttons) {
		return new Element('div', {
			'class': 'grp'
		}).adopt(buttons);
	},

	/**
	 * @method Panel
	 * @description Create simple toggle panel
	 * @param {html element} display Html element to adopt the panel.
	 * @param {string|html element} title Title of the panel.
	 * @param {string|html element} content Content of the panel.
	 * @param {boolean} open Open panel after creation.
	 */
	Panel: new Class({
		Extends: gx.ui.Container,
		initialize: function(display, title, content, open) {
			var root = this;
			this._title = new Element('h1').addEvent('click', function(){
				root.toggle();
			});
			this._content = new Element('div', {
				'class': 'b-25 bg-W d-b'
			});
			this._section = new Element('section', {
				'class': 'bg-E br_b-5 bsd-3 p-7'
			});

			this.parent(display);
			this.toElement().set({'class': 'm_l-10 m_r-10 m_t-10'}).adopt([
				this._title,
				this._section.adopt([
					this._content
				])
			]);

			if ( title != null )
				this.setTitle(title);

			if ( content != null )
				this.setContent(content);

			if ( open == undefined || open != false )
				this.open();
		},

		setTitle: function(title) {
			if ( isString(title) ) {
				this._title.set('html', title);
			} else {
				this._title.empty();
				this._title.adopt(title);
			}
		},

		setContent: function(content) {
			if ( isString(content) ) {
				this._content.set('html', content);
			} else {
				this._content.empty();
				this._content.adopt(content);
			}
		},

		open: function() {
			this._title.addClass('act');
			this._section.show();
		},

		close: function() {
			this._title.removeClass('act');
			this._section.hide();
		},

		toggle: function() {
			if ( this._title.hasClass('act') )
				this.close();
			else
				this.open();
		}
	})
};
