/**
 * Requires the gx.nav.SlidingContentBuilder
 */
gx.nav.SlidingSwitcher = new Class({
	Extends: gx.nav.Switcher,

	_theme: {
		switcher: 'scrollInOut'
	},

	_ocContainer: null,

	initContent: function(tab, content) {
		this.parent(tab, content);
		this._ocContainer = content._ocContainer;
		if ( !this._ocContainer )
			throw new Error('This switcher requires the SlidingContent builder!');

	},

	closeCurrent: function(tab, content, ready) {
		var _this = this;
		this._ocContainer.hide(function() {
			tab.element.removeClass(_this._theme.active);
			content.element.removeClass(_this._theme.active);

			if ( ready )
				ready();
		});
	},

	showTab: function(tab, content, callback) {
		this.parent(tab, content);
		this._ocContainer.show(callback);
	}
});