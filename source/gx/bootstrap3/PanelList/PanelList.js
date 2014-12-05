/**
 * @class gx.bootstrap.PanelList
 * @description Creates a panel list like horizontal tabbing.
 * @extends gx.ui.Container
 * @implements gx.ui.OC_Container
 *
 */
gx.bootstrap.PanelList = new Class({
	Extends: gx.ui.Container,

	options: {
		/**
		 * Each panel consists of {
		 *   'title': 'anyTitle',
		 *   'content': {mixed}
		 * }
		 * @type {Array}
		 */
		panels: [],
		icons: '',
		'default': 0,
		'multiple': false,

	},

	_theme: {
		root: 'gxBootstrapPanelList',
		title: 'title',
		content: 'content',
		active: 'active'
	},

	_current: null,

	_panels: [],

	initialize: function(display, options) {
		this.parent(display, options);

		if (this.options.multiple && !this.options.icons)
			this.options.icons = 'crosshair';

		this._ui.root.addClass('gxBootstrapPanelList');

		this.build(this._ui.root);
	},

	build: function(parent) {
		var panels = this.options.panels;
		var panel, i,l = panels.length;
		for ( i = 0; i < l; i++ ) {
			panel = panels[i];

			var title = this.buildTitle(i, panel);
			var content = this.buildContent(i, panel);

			this._panels.push({
				title: title,
				content: content
			});
			parent.adopt(
				title,
				content
			);

			if (i == this.options['default'])
				this._current = i;

			if (panel.disabled === true)
				this.setDisabled(i, true);
		}
	},

	buildTitle: function(index, panel) {
		var title = new Element('div.' + this._theme.title);

		title.addClass(this.options.icons);

		var text = new Element('span');
		title.adopt(
			new Element('div.outer').adopt(
				new Element('div.inner')
			),
			text
		);

		gx.util.setElementContentByType(text, panel.title);

		title.addEvent('click', function() {
			this.openTab(index);
		}.bind(this));

		if (index == this.options['default'])
			title.addClass('active');

		return title;
	},

	buildContent: function(index, panel) {
		panel.content.addClass(this._theme.content);
		var container = new gx.ui.OC_Container(panel.content, {
			'initclosed': index != this.options['default'],
			'effect': 'Sliding'
		});

		return container;
	},

	openTab: function(index) {
		if ( index === this._current && !this.options.multiple )
			return;

		var panel = this._panels[index];
		if (panel.disabled)
			return;

		if ( this._current !== null && !this.options.multiple ) {
			this._panels[this._current].title.removeClass('active');
			this._panels[this._current].content.close(function() {
				panel.title.addClass('active');
				panel.content.show();
			}.bind(this));

		} else {
			if (this.options.multiple && panel.title.hasClass('active')) {
				panel.title.removeClass('active');
				panel.content.hide();
				return;
			}
			panel.title.addClass('active');
			panel.content.show();

		}

		this._current = index;
	},

	setDisabled: function(index, value) {
		this._panels[index].disabled = value;
		this._panels[index].title[value ? 'addClass' : 'removeClass']('deactivated');

	},

	getActive: function() {
		return this._current;
	}
});