/**
 * @class gx.com.Wizard
 * @description Create a dynamic wizard with pages. Do not style the root element. Wrap it and style the wrapper!.
 * @extends gx.ui.Container
 * @implements gx.util.Console
 * @sample Wizard Sample wizard.
 *
 *
 * @param {element|string} display The display element
 * @param {int} width The display element width
 * @param {object} options Options
 *
 * @option {int} height Height of the moving content. Means real height equals this
 * @option {int} duration Transition duration (Mootools).
 * @option {int} transition The effect transition (Mootools).
 * @option {string} title Title of the wizard.
 * @option {bool} clickableTitles Switch pages with there titles in paging bar.
 * @option {element} fixedContent Set fixed content present on every page.
 * @option {string} fixedPlace Set fixed content orientation: 'top' = at top, 'bottom' = at bottom.
 * @option {bool} paging Display paging or not
 *
 * @event onpageChange
 */
gx.com.Wizard = new Class({
	gx: 'gx.com.Wizard',
	Extends: gx.ui.Container,
	options: {
		title: '',
        height: 'auto',
        overflow: 'overflow-y: auto;',
		duration: 'short',
		transition: Fx.Transitions.Sine.easeOut,
		clickableTitles: true,
		fixedContent: null,
		fixedPlace: 'top', // 'bottom',
		paging: true,
	},
	_theme: {
		title: 'title' // title styling class
	},

	_pages: {
		/*
		'name': {
			index: int
			content: element (page element)
			next: element (btn) optional
			back: element (btn) optional
		}
		*/
	},
    _current: null,
	_width: 0,
	_count: -1,
	_switchPage: null,
	_switchButtons: null,
	_maxHeight: null,

	initialize: function (display, width, options) {
		var root = this;
		try {
			this._width = width;
			this.parent(display, options);
			this._display.root.addClass('gxComWizard');

			this._display.fixed = new Element('div');

            this._display.viewer = new Element('div', {'class': 'viewer'});
            this._display.pages = new Element('div', {'class': 'pages'});
            this._display.pagesClear = new Element('div', {'class': 'clear'});

            this._display.paging = new Element('tr');

			this._display.buttons = new Element('div.buttons', {
				'style': 'width:' + width + 'px'
			});
			this._display.back = new Element('div.back');
			this._display.next = new Element('div.next');

			this.initHeight(this.options.height);

			if ( this.options.title != '' )
				this._display.root.adopt(this.createTitle(this.options.title));

			if ( this.options.fixedPlace == 'top' )
				this._display.root.adopt(this._display.fixed);

            this._display.root.adopt(
				this._display.viewer.adopt(
					this._display.pages.adopt(
						this._display.pagesClear
					)
				)
			);

			if ( this.options.fixedPlace == 'bottom' )
				this._display.root.adopt(this._display.fixed);

			if ( this.options.paging ) {
				this._display.root.adopt(
					new Element('hr'),
					new Element('div', {'class': 'paging'}).adopt(
						this._display.buttons.adopt(
							this._display.back,
							this._display.next
						),
						new Element('table').adopt(
							this._display.paging
						)
					)
				);
			}

			if ( options.pages != null )
				this.addPages(options.pages);

			if ( this.options.fixedContent != null )
				this.setFixed(this.options.fixedContent);

			this.initWidth();
		} catch(e) {
			gx.util.Console('gx.com.Wizard->initialize', e.stack);
		}
	},

	/**
	 * @method initWidth
	 * @description Set new width. If width is null try to read from container. In this case make sure _ui.root is visible and can be read. You might want call this after initialization.
	 * @param {integer} width
	 * @return {this}
	 */
	initWidth: function(width) {
		if ( !this._width ) {
			if ( width == null ) {
				var coords = this.getCoordinates();
				width = coords.innerwidth;
			}

		}

		if ( width != null && width != 0 && !isNaN(width) )
			this._width = width;

		this._display.viewer.setStyles({
			'width': this._width
		});

		this._display.pages.setStyle('width', this._width * (this._count + 1));

		for ( var name in this._pages ) {
			if ( !this._pages.hasOwnProperty(name) )
				continue;

			this._pages[name].content.setStyle('width', this._width);
		}
	},

	initHeight: function(height, target) {
		if ( !target )
			target = 'max-height';

		if ( height == 'auto' ) {
			target = 'height';

		} else if ( this.options.paging )
			height -= 40;

	    this._display.viewer.setStyle(target, height);
		this._display.pages.setStyle(target, height);

		this._maxHeight = height;
		if ( this._current !== null )
			this.applyPageHeight(this.getPage(this._current));
	},

	createTitle: function(label) {
		return new Element('div', {
			'html': label,
			'class': this._theme.title,
			'styles': {
				'margin-top': (-(this.options.padding+1)) + 'px'
			}
		});
	},

	setFixed: function(content) {
		this._display.fixed.empty();
		this._display.fixed.adopt(content);
	},

	setContent: function(name, content) {
		var page = this._pages[name].content;
		page.empty();
		page.adopt(content);
		return this;
	},

	/**
	 * @method addPages
	 * @description Adds pages
	 * @param {object} pages See addPage()
	 * @return {this}
	 */
	addPages: function(pages) {
		for ( var i in pages ) {
			if ( !pages.hasOwnProperty(i) )
				continue;

			var page = pages[i];
			this.addPage(page.name, page.title, page.content);
		}

		return this;
	},

	/**
	 * @method addPage
	 * @description Add page
	 * @param {string} name Identifier name
	 * @param {string} title Label of the page in the paging bar
	 * @param {element} element Content element
	 * @param {object} buttons Optional next and back buttons. Displayed in the paging bar
	 * @return {this}
	 */
    addPage: function(name, title, element, buttons) {
		if ( this._pages[name] != undefined )
			alert('Wizard page name already exist: ' + name);

		this._count++;

		var page = new Element('div', {
			'class': 'page',
			'style': this.options.overflow
		}).adopt(element);

		var params = {
			index: this._count,
			content: page,
			pagingItem: null,
			next: null,
			back: null
		};
		if ( buttons != null ) {
			if ( buttons.next != null )
				params.next = buttons.next;

			if ( buttons.back != null )
				params.back = buttons.back;
		}

		this._pages[name] = params;
		//this._display.pages.adopt(page);
		page.inject(this._display.pagesClear, 'before');
		page.setStyles({
			'min-height': 1,
			'width': this._width
		});

		var root = this;
        (function() {
			var i = root._count;
			params.pagingItem = new Element('td', {'class': 'item' + ( root.options.clickableTitles ? ' pointer' : '' )}).adopt(
				new Element('div', {'class': 'point'}),
				new Element('span', {'class': 'title', 'html': title})
			).addEvent('click', function() {
				if ( root.options.clickableTitles )
					root.moveToPage(i);
			});
			root._display.paging.adopt(params.pagingItem);
		})();

		this._display.pages.setStyle('width', this._width * (this._count + 1));

		if ( this._current == null ) {
			this._current = 0;
		}

		this.moveToPage(this._current);
		return this;
    },

	/**
	 * @method getPage
	 * @description get internal page element
	 * @param {mixed} index Page name or index number
	 */
	getPage: function(name) {
		if ( !isNumber(name) )
			return this._pages[name];

		else {
			for ( var i in this._pages ) {
				if ( !this._pages.hasOwnProperty(i) )
					continue;

				if ( this._pages[i].index == name )
					return this._pages[i];
			}
		}

		alert('gx.com.Wizard error get page: ' + name);
		return null;
	},

	/**
	 * @method moveToPage
	 * @description move to page
	 * @param {mixed} index Page name or index number
	 */
	moveToPage: function(index) {
		if ( parseInt(index) == NaN )
			index = this._pages[index].index;

		if ( index < 0 || index > this._count )
			return;

		var _page = this.getPage(index);
		if ( _page.disabled ) {
			if ( this._current > index )
				this.moveToPage(index-1);
			else
				this.moveToPage(index+1);

			return;
		}

		var root = this;
		this.fireEvent('beforeChange', [index, this]);

		if ( this._switchPage != null && this._switchPage.isRunning() ) {
			this._switchPage.cancel();
		}

		if ( this._switchButtons != null && this._switchButtons.isRunning() ) {
			this._switchButtons.cancel();
		}

		var items = this._display.paging.getElements('td');

		items[this._current].removeClass('active');
		items[index].addClass('active');

		this._switchPage = new Fx.Morph(this._display.pages, {
			duration: this.options.duration,
			transition: this.options.transition
		});
		var pos = -1 * index * this._width;

		// Fix: Morph effect fails when set margin-left: 0
		if ( pos == 0 )
			pos = 1;

		var root = this;
		this._switchPage.addEvent('complete', function() {
			if ( pos == 1 )
				root._display.pages.setStyle('margin-left', 0);

		});

		this.applyPageHeight(_page);

		this._switchButtons = new Fx.Tween(this._display.buttons, {
			duration: this.options.duration,
			transition: this.options.transition
		});
		this._switchButtons.start('opacity', 1, 0).chain(function() {
			root._display.back.empty();
			root._display.next.empty();

			if ( _page.next != null )
				root._display.next.adopt(_page.next);

			if ( _page.back != null )
				root._display.back.adopt(_page.back);

			root._switchButtons.start('opacity', 0, 1);
		});

		this._switchPage.start({
			'margin-left': pos,
		});

		this.fireEvent('pageChange', [index, this]);

		this._current = index;
	},

	/**
	 * Apply the given pages height to all others. This way the wizards
	 * current page is always in perfect height instead of as high as the
	 * highest of all pages.
	 * You might want to trigger this method while you are creating the wizard
	 * in hidden state and displaying later.
	 *
	 * @param  {array} page The page we are navigating to.
	 * @return
	 */
	applyPageHeight: function(page) {
		if ( this._maxHeight === 'auto' )
			return;

		if ( page === undefined )
			page = this.getPage(this._current);

		var preserveCurrent = page.content.getStyle('max-height');
		page.content.setStyles({
			'position': 'absolute',
			'max-height': 'none'
		});
		var resultingHeight = page.content.getSize().y;
		page.content.setStyles({
			'max-height': preserveCurrent,
			'position': 'static'
		});

		// This will trigger browser GUI updating.
		// We need this to guarantee that page.content is set back to static
		// before applying the new max height.
		preserveCurrent = page.content.offsetHeight;

		if ( !isNaN(this._maxHeight) && resultingHeight > this._maxHeight )
			resultingHeight = this._maxHeight;

		for ( var name in this._pages ) {
			if ( !this._pages.hasOwnProperty(name) )
				continue;

			this._pages[name].content.setStyle('max-height', resultingHeight);
		}

		(function() {
			page.content.setStyle('max-height', this._maxHeight);
		}.bind(this)).delay(500);
	},

	nextPage: function() {
		if ( this._current == this._count )
			return;

		this.moveToPage(this._current + 1);
	},

	previousPage: function() {
		if ( this._current == 0 )
			return;

		this.moveToPage(this._current - 1);
	},

	/**
	 * Enable or disable a page. Causes to jump over while moving through pages.
	 */
	setPageDisabled: function(page, disabled) {
		var page = this.getPage(page);

		page.disabled = disabled;
		page.pagingItem[disabled ? 'addClass' : 'removeClass']('disabled');
	}
});
