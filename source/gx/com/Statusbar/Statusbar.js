/**
 * @class gx.com.Statusbar
 * @description Component for displaying a message box or statusbar.
 * @extends gx.ui.Container
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
 * @option {string} message The message to display
 * @option {float} progress The progress to start from
 */
gx.com.Statusbar = new Class(
	{
	gx: 'gx.com.Statusbar',
	Extends: gx.ui.Container,
	options: {
		'message': null,
		'progress': 0
	},
	isOpen: true,
	_progress: 0,
	
	initialize: function(display, options) {
		var root = this;
		try {
			this.parent(display, options);
			this._progress = this.options.progress;
			this.build();
			this.addEvent('resize', function() { root.getBarWidth(); });
		} catch(e) { gx.util.Console('gx.com.Statusbar->initialize: ', e.message); }
	},
	
	
	/**
	 * @method build
	 * @description Builds the component
	 */
	build: function() {
		var root = this;
		try {
			Object.append(this._display, {
				'frame': new Element('div', {'class': 'gxStatusbarFrame'}),
				'bar': new Element('div', {'class': 'gxStatusbarBar'}),
				'label': new Element('div', {'class': 'gxStatusbarLabel'})
			});
			this._display.root.adopt(this._display.frame);
			this._display.frame.adopt(this._display.bar);
			this._display.frame.adopt(this._display.label);
			this.getBarWidth();
			this.setProgress(root.options.progress, root.options.message, false);
		} catch(e) { gx.util.Console(root.gx + '->build', e.message); }
	},
	
	/**
	 * @method getBarWidth
	 * @description Gets the available width for the statusbar
	 */
	getBarWidth: function() {
		this._barWidth = this._display.frame.getSize().x - this._display.frame.getStyle('padding-left').toInt() - this._display.frame.getStyle('padding-right').toInt() - this._display.frame.getStyle('border-left-width').toInt() - this._display.frame.getStyle('border-right-width').toInt();
	},
	/**
	 * @method setMessage
	 * @description Sets a status message
	 * @param {string} msg The message (text) to set
	 */
	setMessage: function(msg) {
		if (msg == null)
			this._display.label.setStyle('display', 'none');
		else {
			this._display.label.setStyle('display', 'block');
			this._display.label.set('text', msg);
		}
	},
	/**
	 * @method incProgress
	 * @description Increase the progress
	 * @param {float} prog The percentage to increase
	 * @param {string} msg The new status message
	 */
	incProgress: function(prog, msg) {
		var target = this._progress;
		if (typeOf(prog) == 'number')
			target = target + prog;
		if (target > 1)
			target = 1;
		this.setProgress(target, msg);
	},
	/**
	 * @method setProgress
	 * @description Sets the current progess of the statusbar
	 * @param {float} prog The target progress
	 * @param {string} msg The new status message
	 * @param {bool} useTween Animate the bar
	 */
	setProgress: function(prog, msg, useTween) {
		if (typeOf(prog) == 'number') {
			this._progress = prog;
			var width = this._barWidth * this._progress;
			if ( useTween ) {
				tween = new Fx.Tween(this._display.bar);
				tween.start('width', width);
			} else
				this._display.bar.setStyle('width', width);
			if (msg != null)
				this.setMessage(msg);
		}
	}
});
