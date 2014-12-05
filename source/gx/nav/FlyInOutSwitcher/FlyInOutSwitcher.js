gx.nav.FlyInOutSwitcher = new Class({
	Extends: gx.nav.Switcher,

	options: {
		animationtype: 'horizontal',
		duration: 200,
	},

	_theme: {
		switcher: 'flyInOut',
		flyin:    'flyin',
		flyout:   'flyout',
		reverse:  'reverse'
	},

	order: [],

	initRoot: function(root) {
		this.parent(root);

		root.addClass(this.options.animationtype);
	},

	initContent: function(tab, content) {
		this.order.push(tab.identifier);
		content.element.addClass(this._theme.flyin);

	},

	closeCurrent: function(tab, content, ready) {
		var root = this,
			c = content.element,
			t = tab.element,
			fo = this._theme.flyout,
			fi = this._theme.flyin,
			a = this._theme.active;

		c.addClass(fo);
		t.removeClass(a);
		(function() {
			c.removeClass(a);
			c.removeClass(fo);
			c.addClass(fi);

			if ( ready )
				ready();
		}).delay(root.options.duration);
	},

	prepareChange: function(ctab, tab, ccontent, content, ready) {
		var direction = true; // top 2 bottom | left 2 right
		if ( ctab != null ) {
			var cIndex = this.order.indexOf(ctab.identifier);
			var nIndex = this.order.indexOf(tab.identifier);
			direction = cIndex < nIndex;
		}

		if ( direction ) {
			content.element.removeClass(this._theme.reverse);
			if ( ccontent )
				ccontent.element.removeClass(this._theme.reverse);

		} else {
			content.element.addClass(this._theme.reverse);
			if ( ccontent )
				ccontent.element.addClass(this._theme.reverse);
		}

		this.parent(ctab, tab, ccontent, content, ready);
	},

	showTab: function(tab, content, callback) {
		var root = this;
		tab.element.addClass(this._theme.active);
		content.element.addClass(this._theme.active);
		(function() {
			content.element.removeClass(root._theme.flyin);

			if ( callback )
				callback();

		}).delay(100);
	}
});