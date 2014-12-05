/**
 * @class gx.bootstrap.Editor
 * @description Creates an editor. In order to make it work, add ./ace/ace.js to your referenced scripts.
 * @extends gx.ui.Container
 * @implements gx.util.Console
 *
 * @param {element|string} display The display element
 *
 * @option {string} width The width of the panel + 'px'
 */
counter = 0;

gx.bootstrap.Editor = new Class({

	Extends: gx.ui.Container,

	options: {
		'width'          : '600px',
		'mode'			 : 'xml',
		'theme'			 : 'eclipse',
		'default'		 : false
	},

	staticCounter: 0,	// using this construct to simulate a static property that will be a reference to this very editor in arrEditors

	initialize: function (display, options) {
		var root = this;
		try {
			this.parent(display, options);

			this._display.root.addClass('gxBootstrapEditorWrapper');

			this.staticCounter = counter++;

			var text = "";
			if (this.options['default'])
				text = this.options['default'];

			if (this.options.width)
				this._display.root.setStyle('width', this.options.width);

			this._display.txtCode = new Element('div', {'id': this.options.id+this.staticCounter }).setStyles({
		        'position': 'absolute',
		        'top': '0',
		        'right': '0',
		        'bottom': '0',
		        'left': '0'
			});
			this._display.root.adopt(this._display.txtCode);

			var strScript = '';
			if (this.staticCounter == 0)
				strScript += 'var arrEditors = [];';
			strScript += 'var gxBootstrapEditor = ace.edit("'+this.options.id+this.staticCounter+'");';
			strScript += 'gxBootstrapEditor.setTheme("ace/theme/'+this.options.theme+'");'
			strScript += 'gxBootstrapEditor.getSession().setMode("ace/mode/'+this.options.mode+'");';
			strScript += 'arrEditors.push(gxBootstrapEditor);';
			this._display.root.adopt(new Element('script', {'html': strScript}));

		} catch(e) {
			gx.util.Console('gx.bootstrap.Editor->initialize', gx.util.parseError(e) );
		}
	},

	getValue: function() {
		return arrEditors[this.staticCounter].getValue();
	},

	setValue: function(value) {
		arrEditors[this.staticCounter].setValue(value);
		return this;
	}

});
