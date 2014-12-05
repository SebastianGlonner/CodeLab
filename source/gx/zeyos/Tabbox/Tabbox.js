/**
 * @class gx.zeyos.Tabbox
 * @description Creates a tabbed box
 * @extends gx.ui.Container
 * @implements gx.util.Console
 *
 * @param {node} display: The target node
 *
 * @option {array} frames: The array containing the frames. [{name: STRING, title: STRING, content: NODE/HTML}]
 * @option {int} height: The height of the content area
 * @option {int} show: The first tab to show
 * @option {function} onChange: Called when the tab is changed
 *  *
 * @event change When the tab is changed
 *
 * @sample Tabbox Simple tabboxes example.
 */
gx.zeyos.Tabbox = new Class({
	gx: 'gx.zeyos.Tabbox',
	Extends: gx.ui.Container,
	options: {
		'frames': [],
		'height': false,
		'show': 1,
		'onChange': false,
		'lang': 'ltr'
	},
	_tabs: [],
	_frames: [],
	_active: '',
	initialize: function(display, options) {
		var root = this;
		try {
			this.parent(display, options);
			this._display = Object.merge({}, this._display, {
				'div': new Element('div', {'class': 'tab'}),
				'content': new Element('div', {'styles': {'overflow': 'auto'}})
			});
			if (root.options.height)
				this._display.content.setStyle('height', root.options.height);

			this._display.root.adopt(this._display.div);
			this._display.root.adopt(this._display.content);

			var frames = this.options.frames;
			if (isArray(frames)) {
				frames.each(function(item) {
					root.addTab(item.name, item.title, item.content);
				});
			}

			if (isFunction(this.options.onChange))
				this.addEvent('change', this.options.onChange);

			if (isString(this.options.show))
				this.openTab(this.options.show);
			else if(isNumber(this.options.show)) {
				var index = this.getIndexName(this.options.show);
				if (index)
					this.openTab(index);
			}
		} catch(e) { gx.util.Console('gx.zeyos.Tabbox->initialize', e.message); }
	},

	/**
	 * @method setHeight
	 * @description Sets the height of the tabbed box
	 * @param {int} height The height to set
	 */
	setHeight: function(height) {
		this._display.content.setStyle('height', height);
	},

	/**
	 * @method addTab
	 * @description Adds a tab
	 * @param {string} name The name of the tab
	 * @param {string} title The title of the tab
	 * @param {string|node} content The content of the tab
	 */
	addTab: function(name, title, content) {
		var root = this;
		try {
			if (isString(content))
				content = new Element('div', {'html': content});

			if (isString(name) && isString(title) && isNode(content)) {
				if (!isNode(this._tabs[name])) {
					var link = new Element('fieldset', {'class': 'tab_item', 'html': title.replace(/ /g, '&nbsp;')});
					content.setStyle('display', 'none');
					this._frames[name] = content;
					this._tabs[name] = link;
					this._display.div.adopt(link);
					this._display.content.adopt(content);
					link.addEvent('click', function() {
						root.openTab(name);
					});
					return true;
				}
			}
			return false;
		} catch(e) {
			gx.util.Console('gx.zeyos.Tabbox->addTab', e.message);
			throw e;
		}
	},

	/**
	 * @method closeTab
	 * @description Closes the tab with the given name
	 * @param {string} name The name of the tab
	 */
	closeTab: function(name) {
		try {
			if (isNode(this._tabs[name])) {
				this._tabs[name].removeClass('act');
				this._frames[name].setStyle('display', 'none');
				this._active = false;
			}
		} catch(e) { gx.util.Console('gx.zeyos.Tabbox->closeTab', e.message); }
	},

	/**
	 * @method openTab
	 * @description Opens the tab with the given name
	 * @param {string} name The name of the tab
	 */
	openTab: function(name) {
		try {
			if (isNode(this._tabs[name])) {
				if (this._active)
					this.closeTab(this._active);
				this._active = name;
				this._tabs[name].addClass('act');
				this._frames[name].setStyle('display', 'block');
				this.fireEvent('change', name);
			}
		} catch(e) { gx.util.Console('gx.zeyos.Tabbox->openTab', e.message); }
	},

	/**
	 * @method getIndexName
	 * @description Returns the name of the tab at the given index
	 * @param {int} index The index
	 */
	getIndexName: function(index) {
		var i = 0;
		for (name in this._tabs) {
			i++;
			if (i == index)
				return name;
		}
		return false;
	}
});
