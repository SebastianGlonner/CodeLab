gx.nav.Component = new Class({
	Extends: gx.ui.Container,

	navigation: null,
	initialize: function(nav, display, options) {
		this.parent(display, options);
		this.navigation = nav;
	}
});