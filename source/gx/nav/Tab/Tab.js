gx.nav.Tab = new Class({
	Extends: gx.nav.Component,

	_theme: {
		tabbar: 'nav nav-tabs', // bootstrap
		tab:    'tab',
	},

	initialize: function(nav, options) {
		this.parent(nav, new Element('div'), options);

		this._ui.root.addClass(this._theme.tabbar);
		this._ui.root.adopt(new Element('div', {
			'class': 'custombuttons',
			'style': 'float: right;'
		}));
	},

	build: function(tab) {

		var root = this.buildRoot(tab);
		var content = this.buildContent(tab);

		this.setContent(root, content);
		this.addResponseEvent(root, tab);

		tab.element = root;

		return tab;
	},

	addResponseEvent: function(root, tab) {
		root.addEvent('click', function() {
			this.navigation.openTab(tab.identifier);
		}.bind(this));
	},

	buildObject: function(tab) {
		if ( typeOf(tab) == 'string' ) {
			tab = {
				label: tab
			};
		}

		return tab;
	},

	buildRoot: function(tab) {
		return new Element('li', {
			'class': this._theme.tab
		});
	},

	buildContent: function(tab) {
		var params = {};
		if ( this.options.useanchor ) {
			params.href = '#' + this.navigation.toFragment(tab.identifier);
		}

		if ( tab.identifier && params['selenium-id'] == null ) {
			params['selenium-id'] = tab.identifier;
		}

		var a = new Element('a', params);
		gx.util.setElementContentByType(a, tab.label);

		return a;
	},

	setContent: function(tab, content) {
		tab.adopt(content);
	},

	inject: function(element) {
		//this._ui.root.adopt(element);
		element.inject(this._ui.root.getElement('.custombuttons'), 'before');
	},

	injectButtons: function(buttons) {
		var btnsDiv = this._ui.root.getElement('.custombuttons');
		if ( btnsDiv == null )
			return;

		btnsDiv.empty();

		if ( buttons != null )
			btnsDiv.adopt(buttons);
	},

	addElement: function(element) {
		this.inject(element);
	},

	setDisabled: function(tab, bool) {
		tab.element.toggleClass('disabled', bool);
	},

	isDisabled: function(tab) {
		return tab.element.hasClass('disabled');
	}

});