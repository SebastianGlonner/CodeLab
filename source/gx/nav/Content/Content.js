gx.nav.Content = new Class({
	Extends: gx.nav.Component,

	_theme: {
		contentwrapper: 'contents',
		content:         'content',
	},

	initialize: function(nav, options) {
		this.parent(nav, new Element('div'), options);

		this._ui.root.addClass(this._theme.contentwrapper);
	},

	build: function(content, tab) {
		content = this.buildObject(content);

		if ( content.element != null && typeOf(content.element) == 'function')
			content.element = content.element();

		if ( !content.toElement )
			content.toElement = function() { return content.element; };

		var root = this.buildRoot(content, tab);
		this.setContent(root, content.element);

		content.element = root;
		return content;
	},

	show: function(ready) {
		ready();
	},

	buildObject: function(content) {
		if ( typeOf(content) == 'string' || typeOf(content) == 'element') {
			content = {
				element: content
			};
		}

		if ( content.show == null )
			content.show = this.show;

		return content;

	},

	buildRoot: function(content, tab) {
		var root = new Element('div', {
			'class': this._theme.content
		});

		if ( tab.identifier ) {
			root.set('selenium-id', tab.identifier);
		}

		return root;
	},

	setContent: function(parent, content) {
		parent.adopt(content);
	},

	inject: function(element) {
		this._ui.root.adopt(element);
	}

});