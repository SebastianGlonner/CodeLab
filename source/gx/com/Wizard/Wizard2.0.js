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
 * @option {string} title Title of the wizard.
 * @option {element} fixedContent *deprecated* Set fixed content present on every page.
 * @option {string} fixedPlace *deprecated* Set fixed content orientation: 'top' = at top, 'bottom' = at bottom.
 * @option {bool} paging Display paging or not
 * @option {bool} pagingPosition Where to place the pages
 * @option {bool} pagingCreator Class used to create the paging elements.
 * @option {int} duration Transition duration. Has to fit to css value only.
 *
 * @event onpageChange
 */
gx.com.Wizard2 = new Class({
	gx: 'gx.com.Wizard',
	Extends: gx.ui.Container,
	options: {
		title: '',
		height: 'auto',
		overflow: 'overflow-y: auto;',
		clickableTitles: true,
		fixedContent: null,
		fixedPlace: 'top', // 'bottom',
		paging: true,
		pagingPosition: 'bottom',
		pagingCreator: null,

		duration: 500
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
	_maxHeight: null,

	_howToAnimte: 'start',
	_pagingCreator: null,

	initialize: function (display, width, options) {
		var root = this;

		if (!this.options.pagingCreator)
			this._pagingCreator = new gx.com.Wizard2.PagingCreator(this);
		else
			this._pagingCreator = new this.options.pagingCreator(this);

		this._width = width;
		this.parent(display, options);
		this._display.root.addClass('gxComWizard');

		this._display.fixed = new Element('div');

		this._display.viewer = new Element('div', {'class': 'viewer'});
		this._display.pages = new Element('div', {'class': 'pages'});
		this._display.pagesClear = new Element('div', {'class': 'clear'});

		this._display.buttons = new Element('div.buttons');
		this._display.back = new Element('div.back');
		this._display.next = new Element('div.next');

		this._display.paging = this._pagingCreator._doCreateRoot();

		this.buttons = new gx.ui.OC_Container(this._display.buttons, {
			'initclosed': false,
		});

		this.initHeight(this.options.height);

		if ( this.options.title !== '' )
			this._display.root.adopt(this.createTitle(this.options.title));

		if ( this.options.fixedPlace == 'top' )
			this._display.root.adopt(this._display.fixed);

		var pagingTop = new Element('div', {'class': 'paging top'});
		var pagingBottom = new Element('div', {'class': 'paging bottom'});

		this._display.root.adopt(
			pagingTop,
			this._display.viewer.adopt(
				this._display.pages.adopt(
					this._display.pagesClear
				)
			),
			pagingBottom,
			this._display.buttons.adopt(
				this._display.back,
				this._display.next
			)
		);

		if ( this.options.fixedPlace == 'bottom' )
			this._display.root.adopt(this._display.fixed);

		if ( this.options.paging ) {
			if (this.options.pagingPosition === 'top') {
				pagingTop.adopt(this._display.paging);

			} else {
				pagingTop.adopt(this._display.paging);
			}

		}

		if ( options.pages != null )
			this.addPages(options.pages);

		if ( this.options.fixedContent != null )
			this.setFixed(this.options.fixedContent);

		this.initWidth();
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
			target = 'maxHeight';

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
	addPage: function(p) {
		var name = p.name;
		var title = p.title;
		var element = p.content;
		var buttons = p.buttons;

		if ( this._pages[name] !== undefined )
			alert('Wizard page name already exist: ' + name);

		this._count++;

		var page = new Element('div', {
			'class': 'page',
			'style': this.options.overflow
		}).adopt(element);

		var params = {
			name: name,
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

		params.pagingItem = this._pagingCreator._doCreateItem(p);

		this._display.pages.setStyle('width', this._width * (this._count + 1));

		if ( this._current == null ) {
			this.moveToPage(0);
		}

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
		if ( isNaN(parseInt(index)) )
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
		this.fireEvent('beforeChange', [this, _page]);
		this.fireEvent('beforeChange' + _page.name.capitalize(), [this, _page]);

		var previousePage;
		if ( this._current != null ) {
			previousePage = this.getPage(this._current);
			// page content active class will be removed after animation
			previousePage.pagingItem.removeClass('active');
			if ( this._current < index )
				previousePage.pagingItem.addClass('done');
			else
				previousePage.pagingItem.removeClass('done');
		}

		_page.content.addClass('active'); // set the content visible
		_page.pagingItem.addClass('active');

		this.applyPageHeight(_page);

		this.buttons.hide(function() {
			root._display.back.empty();
			root._display.next.empty();

			if ( _page.next != null )
				root._display.next.adopt(_page.next);

			if ( _page.back != null )
				root._display.back.adopt(_page.back);

			root.buttons.show();
		});

		this._display.pages.setStyles({
			'marginLeft': (-1 * index * this._width),
		});

		// Set the old content page hidden, but after animation
		if (previousePage && previousePage.index != index)
			(function() {previousePage.content.removeClass('active')})
			.delay(this.options.duration);

		this.fireEvent('pageChange', [this, _page]);
		this.fireEvent('pageChange' + _page.name.capitalize(), [this, _page]);

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
			page.content.setStyle('maxHeight', 'none');
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

gx.com.Wizard2.PagingCreator = new Class({
	_wizard: null,
	initialize: function(wizard) {
		this._wizard = wizard;
	},

	createRoot: function() {
		return new Element('div');
	},

	createItem: function(parentRootElement, page) {
		var item = new Element('div.item');
		var span = new Element('span.text');
		var line = new Element('div.line');
		var bar = new Element('div.bar');

		gx.util.setElementContentByType(span, page.title);
		item.adopt(span, line, bar);

		parentRootElement.adopt(item);

		return item;
	},

	_doCreateRoot: function() {
		this.root = this.createRoot();
		return this.root;
	},

	_doCreateItem: function(page) {
		return this.createItem(this.root, page).addClass(page.name);
	}
});
