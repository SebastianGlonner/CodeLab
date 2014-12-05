/**
 * @class gx.zeyos.Msgbox
 * @description Displays a message box.
 * @extends gx.core.Settings
 * @implements gx.core.Parse
 *
 * @option {int} top The top margin
 * @option {bool} closable The message box closes if it is clicked
 * @option {string|Element} content The content of the message box
 *
 * @sample Msgbox Try the different messagebox types with custom text.
 */
gx.zeyos.Msgbox = new Class({
	gx: 'gx.zeyos.Msgbox',
	Extends: gx.core.Settings,
	options: {
		'closable': true,
		'content': false
	},
	initialize: function(options) {
		var root = this;
		try {
			this.parent(options);
			this._display = {'frame': new Element('div', {
				'class': 'msg',
				'valign': 'center',
				'styles': {
					'left': '50%'
				}
			})};
			this._display.content = new Element('p');
			this._display.img = new Element('div');

			this._display.frame.adopt(this._display.img);
			this._display.frame.adopt(this._display.content);

			if (this.options.closable) {
				this._display.frame.addEvent('click', function() {
					root.hide();
				});
			}

			if (this.options.content)
				this.setContent(this.options.content);

			$(document.body).adopt(this._display.frame);
		} catch(e) { gx.util.Console('gx.zeyos.Msgbox->initialize', e.message); }
	},

	/**
	 * @method setContent
	 * @description Sets the content of the message box
	 * @param {string} content
	 */
	setContent: function(content) {
		try {
			this._display.content.empty();
			if (isNode(content)) {
				this._display.content.emptyy();
				this._display.content.adopt(content);
			}
			else if (isString(content)) {
				this._display.content.set('html', content);
			}
		} catch(e) { gx.util.Console('gx.zeyos.Msgbox->setContent', e.message); }
	},

	/**
	 * @method show
	 * @description Shows the message box
	 * @param {string} msg The message text to display
	 * @param {string} msg_class The class of the message
	 */
	show: function(msg, msg_class) {
		try {
			if (msg != null) {
				if (msg_class == null)
					msg_class = 'info';

				this._display.img.set('class', 's_msg_32_' + msg_class);

				this.setContent(msg);
			}
			this._display.frame.setStyle('margin-left', this._display.frame.getStyle('width').toInt() / -2);
			this._display.frame.addClass('act');
		} catch(e) { gx.util.Console('gx.zeyos.Msgbox->show', e.message); }
	},

	/**
	 * @method hide
	 * @description Hides the message box
	 */
	hide: function() {
		this._display.frame.removeClass('act');
	}
});
