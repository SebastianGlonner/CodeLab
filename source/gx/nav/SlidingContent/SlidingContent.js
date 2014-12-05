/**
 * @class gx.nav.SlidingContent
 * @description Creates content with the gx.com.OC_Container component.
 * @extends gx.nav.Content
 * @implements gx.com.OC_Container
 */
gx.nav.SlidingContent = new Class({
	Extends: gx.nav.Content,

	options: {
		'effect': 'Sliding'
	},

	_ocContainer: null,
	initialize: function(nav, options) {
		this.parent(nav, new Element('div'), options);
		this._ocContainer = new gx.ui.OC_Container($(this), {
			'effect'   : this.options.effect,
			'duration' : 400,
		});
		this._ui.root.addClass(this._theme.contentwrapper);
	},

	build: function(content, tab) {
		content = this.parent(content, tab);

		content._ocContainer = this._ocContainer;

		return content;
	}

});