
/**
 * @class gx.bootstrap.Dropdown
 * @description Creates a bootstrap dropdown.
 * @extends gx.bootstrap.Container
 *
 */
gx.bootstrap.Dropdown = new Class({
	gx: 'gx.bootstrap.Dropdown',
	Extends: gx.ui.Container,

	options: {
		'label': '__dropdown__',
		'position': 'left',
		'dropup' : false,
	},

	isShown: false,

	_theme: {
		root   : 'dropdown',
		button : 'btn btn-default',
		list   : 'dropdown-menu',

	},

	toggleTrigger: 'open',

	initialize: function(display, options) {
		this.parent(display, options);

		this.build(this.options.items);
	},

	build: function(items) {
		this._ui.root.empty();
		this._ui.root.addClass('dropdown');

		if ( this.options.dropup )
			this._ui.root.addClass('dropup');

		this._ui.root.adopt(this.buildButton());
		this._ui.root.adopt(this.buildList(items));
	},

	buildButton: function() {
		var btn = new Element('button', {
			'type': 'button',
			'class': this._theme.button,
		});

		btn.addEvent('click', this.toggle.bind(this));

		gx.util.setElementContentByType(btn, this.options.label);
		return btn;
	},

	buildList: function(items) {
		var root = this,
		list = new Element('ul', {
			'class': this._theme.list,
		});

		if ( this.options.position == 'right' )
			list.addClass('dropdown-menu-right');

		this.iterateItems(items, function(item, index, items) {
			list.adopt(root.buildItem(item));
		});
		return list;
	},

	buildItem: function(item) {
		var li,
			properties = {
				// 'html' : item.label,
				// 'onClick': doSomething()
				// 'content': item.content
			},
			content;

		if ( item.content ) {
			content = item.content;
			delete item.content;
		}

		Object.merge(properties, item);

		li = new Element('li', properties);

		if ( content )
			gx.util.setElementContentByType(li, content);

		return li;
	},

	iterateItems: function(items, callback) {
		if ( typeOf(items) == 'object' ) {
			Object.each(items, callback);
		} else if ( typeOf(items) == 'array' ) {
			items.each(callback);
		} else
			throw new Error('InvalidArgumentException: Invalid type of items var.');
	},

	toggle: function() {
		if ( this.isShown ) {
			this.hide();
		} else {
			this.show();
		}
	},

	show: function() {
		this._ui.root.addClass(this.toggleTrigger);
		this.isShown = true;
	},

	hide: function() {
		this._ui.root.removeClass(this.toggleTrigger);
		this.isShown = false;
	}
});
