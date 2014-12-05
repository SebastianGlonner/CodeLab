gx.nav.Switcher = new Class({
	Extends: gx.nav.Component,

	_theme: {
		switcher: '',
		active: 'active' // bootstrap
	},

	initialize: function(nav, options) {
		this.parent(nav, null, options);
	},

	initRoot: function(root) {
		if ( this._theme.root != '')
			root.addClass(this._theme.switcher);
	},

	initContent: function(tab, content) {
	},

	closeCurrent: function(tab, content, ready) {
		tab.element.removeClass(this._theme.active);
		content.element.removeClass(this._theme.active);

		if ( ready )
			ready();
	},

	prepareChange: function(ctab, tab, ccontent, content, ready) {
		content.show(ready);
	},

	showTab: function(tab, content, callback) {
		tab.element.addClass(this._theme.active);
		content.element.addClass(this._theme.active);

		if( callback )
			callback();
	}
});