/**
 * @class gx.com.Message
 * @description Displays a message box or status bar.
 * @extends gx.ui.Hud
 * @implements gx.com.Statusbar
 * @erquires Fx.Morph
 * @sample Message An example demonstrating message boxes and status bars.
 *
 * @param {string|node} display
 *
 * @option {int} messageWidth The width of the message
 * @option {float} opacity The opacity of the message
 * @option {int} duration The duration the message will stay
 * @option {bool} blend Apply a blend effect
 * @option {bool} fixed Set the message fixed
 * @option {string} x The x-value of the message's position
 * @option {string} y The y-value of the message's position
 */
gx.com.Message = new Class({
	Extends: gx.ui.Hud,
	options: {
		'messageWidth': 300,
		'opacity': 0.9,
		'duration': 3000,
		'blend': false,
		'fixed': true,
		'z-index': 120,
		'x': 'center',
		'y': 'top'
	},
	initialize: function(display, options) {
		var root = this;
		this.parent(display, options);
		this._messages = new Array();
		this._display.windows = new Element('div', {'class': 'gxMessage', 'styles': {
			'width': root.options.messageWidth,
			'position': 'absolute',
			'z-index': root.options['z-index']
		}});
		this.add('messages', this._display.windows, {'x': root.options.x, 'y': root.options.y}, root.options.fixed);
		this.show('messages');
	},

	/**
	 * @method addMessage
	 * @description Adds a Message
	 * @param {string} msg The message text
	 * @param {string} iconClass The icon class
	 * @param {bool} closable User can close the message
	 * @param {bool} blend Apply a blend effect
	 * @param {bool} autoclose Message will close automatically
	 */
	addMessage: function(msg, iconClass, closable, blend, autoclose) {
		var root = this;
		var elem = new Element('div', {'class': 'gxMessageBox', 'styles': {
			'position': 'absolute',
			'width': root.options.messageWidth,
			'opacity': 0,
			'visibility': 'hidden'
		}});
		if (typeOf(msg) != 'element') {
			msg = new Element('div', {'class': 'gxMessageInner', 'text': msg});
			if (iconClass == null) iconClass = 'info';
			msg.addClass(iconClass);
		}
		elem.adopt(msg);

		if (closable != false)
			elem.addEvent('click', function() {
				root.closeMessage(elem);
			});
		this._display.windows.adopt(elem);
		var dim = elem.getSize();
		elem.setStyles({
			'height': 0,
			'position': 'static',
			'visibility': 'visible',
			'overflow': 'hidden'
		});
		var tween = new Fx.Morph(elem, {'duration': 'short'})
		if (blend == true) this.showBlend();
		tween.start({
			'opacity': root.options.opacity,
			'height': dim.y
		});
		this._messages.push(elem);
		if (root.options.duration > 0 && autoclose !== false)
			root.closeMessage.delay(root.options.duration, this, elem);
		return elem;
	},

	/**
	 * @method closeMessage
	 * @description Closes a message box
	 * @param {node} elem The message's element
	 */
	closeMessage: function(elem) {
		var root = this;
		var tween = new Fx.Morph(elem, {
			onComplete: function() {
				root._messages.erase(elem);
				elem.destroy();
				if (root._messages.length < 1)
					root.hideBlend();
			}
		})
		tween.start({
			'opacity': 0,
			'height': 0
		});
	},

	/**
	 * @method clear
	 * @description Removes all open message boxes
	 */
	clear: function() {
		var root = this;
		this._messages.each(function(elem) {
			root.closeMessage(elem);
		});
		this._messages = [];
		this.hideBlend();
	},

	/**
	 * @method showStatus
	 * @description Shows a status bar
	 * @param {float} progress The progress made
	 * @param {string} message The message to display
	 * @param {bool} blend Apply a blend effect
	 */
	showStatus: function(progress, message, blend) {
		if (this._display.status == null) {
			var stat = new Element('div', {'class': 'gxMessageStatus'});
			this._display.status = this.addMessage(stat, null, false, blend, false)
			this._statusbar = new gx.com.Statusbar(stat, {
				'message': message,
				'progress': progress
			});
		} else
			this.incProgress(progress, message);
	},

	/**
	 * @method hideStatus
	 * @description Hides the status bar
	 */
	hideStatus: function() {
		var root = this;
		if (this._display.status != null) {
			this.closeMessage(this._display.status);
			this._display.status = null;
			this._statusbar = null;
		}
	},

	/**
	 * @method incProgress
	 * @description Increases the progress of the status bar
	 * @param {float} progress The amount by which to increase the progress
	 * @param {string} message The message to display
	 */
	incProgress: function(progress, message) {
		if (this._statusbar != null)
			this._statusbar.incProgress(progress, message);
	},

	/**
	 * @method setProgress
	 * @description Sets the progress of the status bar
	 * @param {float} progress The progress to set
	 * @param {string} message The message to display
	 * @param {object} tween The tween
	 */
	setProgress: function(progress, message, tween) {
		if (this._statusbar != null)
			this._statusbar.setProgress(progress, message, tween);
	}
});
