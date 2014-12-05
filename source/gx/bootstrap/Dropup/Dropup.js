
/**
 * @class gx.bootstrap.Dropup
 * @description Creates a popup window
 * @extends gx.bootstrap.Popup
 * @implements Fx.Tween
 * @implements gx.core.Parse
 * @sample Dropup An example.
 *
 * @param {object} options
 *
 * @option {int} width Dropup width
 * @option {bool} closable Dropup closes if modal is clicked
 * @option {string|Element} content Dropup content
 * @option {element} target The target of the popup
 * @option {element|string} The popup window title
 * @option {bool} persist Set to true to keep the contents after closing. Default is false
 * @option {bool|function} onWindowResize function which will be cauled on window resize event. Default call Popup.updatePosition() to central popup
 */
gx.bootstrap.Dropup = new Class({
	gx: 'gx.bootstrap.Dropup',
	Extends: gx.bootstrap.Popup,
	options: {
		'borderbox': false,
		'y': 'top',
		'move': 45
	},
	initialize: function(options) {
		this.parent(options);
		this._display.modal.setStyle('top', this.options.move);
		this._display.modal.setStyle('left', '50%');
	},
	setMaxHeight: function(height, adjust) {
		if ( !adjust )
			adjust = this.options.move + 115;

		this.parent(height, adjust);
	},
	show: function(options) {
		try {
			if (this._display.modal.getStyle('display') == 'block')
				return;

			var zindex = gx.bootstrap.PopupMeta.register(this);
			this._display.modal.setStyle('z-index', zindex);
			this._display.blend.setStyle('z-index', zindex-1);
			var morph = new Fx.Morph(this._display.modal, {'transition': 'Sine:out'});
			this.lock(1);
			this._display.modal.setStyle('display', 'block');
			var s = this._display.modal.getSize();
			this._display.modal.setStyle('top', -s.y + this.options.move);
			this._display.modal.setStyle('opacity', 0);
			this._display.modal.setStyle('margin-left', -s.x/2+'px');
			morph.start({
				opacity: 1,
				'top': this.options.move
			});
			morph.addEvent('complete', function() {
				this.fireEvent('shown');
			}.bind(this));
			this.setPosition();
			this.isOpen = true;
			this.fireEvent('show', [options]);
		} catch(e) { gx.util.Console('AppManager.Dropup: ', e.message); }
	},
	hide: function() {
		try {
			if (this._display.modal.getStyle('display') == 'none')
				return;

			gx.bootstrap.PopupMeta.unregister(this)

			var morph = new Fx.Morph(this._display.modal);
			morph.addEvents({
				'complete': function() {
					this._display.modal.setStyle('display', 'none');
				}.bind(this)
			});
			this.lock(0);
			morph.start({
				opacity: 0.0001,
				'top': -(this._display.modal.getSize().y) + this.options.move
			});
			this.isOpen = false;
			//this.fireEvent('hide');
		} catch(e) { gx.util.Console('AppManager.Dropup: ', e.message); }
	}
});
