/**
 * @class gx.ria.Pages
 * @description Manage pages of an application.
 * @extends gx.ui.Container
 * @implements gx.core.Parse
 *
 * @option {int} zIndexBase The z-index of the currently shown page
 * @option {string} childrenPageName identifier name of the children page
 * @option {string} cssPrefix Prefix for all css class names
 * @option {function} childrenPageFunc Function to create the childrens page content
 * @option {function} buildTopMenu Function which builds the top menu (link to parent page)
 * @option {function} buildBottomMenu Function which builds the bottom menu
 * @option {object} fxMoveOptions Options for Mootools FxMove class.
 * @option {string} childrenPageTitle Name of automatically created children page. to navigate through all pages
 *
 * @author Sebastian Glonner <sglonner@zeyon.net>
 * @version 1.00
 * @package ria
 * @copyright Copyright (c) 2011-2013, Zeyon (www.zeyon.net)
 *
 * @sample Pages A small pages example.
 */
gx.ria.Pages = new Class({
	Extends: gx.ui.Container,
	Implements: gx.ui.App,

	options: {
		zIndexBase: 10,
		childrenPageName: '###SHOW_CHILDRENS###',
		childrenPageTitle: 'History',
		cssPrefix: 'gxRiaPages',
		childrenPageFunc: null,
		buildTopMenu: null,
		buildBottomMenu: null,
		fxMoveOptions: {
			position: 'upperLeft',
			edge: 'upperLeft',
			offset: {x: 0, y: 0},
			duration: 'short'
		}
	},
	_resizing: false,
	_pages: {},
	_currentPage: null,

	initialize: function(display, options) {
		this.options.buildTopMenu = this.buildTopMenu.bind(this);
		this.options.buildBottomMenu = this.buildBottomMenu.bind(this);
		this.options.buildLoader = this.buildLoader.bind(this);
		this.options.setLoading = this.setLoading.bind(this);
		this.options.resetLoading = this.resetLoading.bind(this);

		this.parent((display ? display : document.body), options);
		this.setStyle('position', 'absolute');
		this._ui.root.addClass( this.options.cssPrefix + 'Root');

		this.options.buildLoader();

		this.addPage(this.options.childrenPageName, {
			loadContent: this.createChildrenPage,
			title: this.options.childrenPageTitle,
			className: this.options.cssPrefix + 'History',
			parentPage: null
		});

		window.addEvent('resizeComplete', function () {
			this.getCoordinates();
			this.getCurrent().show();
			this._resizing = false;
		}.bind(this));
		window.addEvent('resize', function () {
			if ( this._resizing === false ) {
				this._resizing = true;
				window.fireEvent('resizeComplete', [], 500);
			}
		}.bind(this));
	},

	/**
	 * @method addPage
	 * @description Add a new page to the page application.
	 * @param {string} name Name of the page
	 * @param {string} options Options of the new page.
	 */
	addPage: function  (name, options) {
		if ( options == undefined )
			options = {};

		if ( options.parentPage === undefined ) {
			options.parentPage = null;
		} else if ( typeof(options.parentPage) == 'string' ) {
			options.parentPage = this.getPage(options.parentPage);
		} else {
			options.parentPage = options.parentPage;
		}

		if ( options.cssPrefix == undefined ) {
			options.cssPrefix = this.options.cssPrefix;
		}

		var page = new gx.ria.Page(this, name, options);
		this._pages[name] = page;
		this._ui.root.adopt(page._ui.root);
		return page;
	},

	/**
	 * @method show
	 * @description Show the page
	 * @param {string} name Name of the page
	 * @param {string} direction From which direction you want the page come in.
	 * @param {multi} params The pages loading function will be called with this params
	 */
	show: function (name, direction, params) {
		direction = ( direction != undefined ? direction : 'right' );

		var page = this._pages[name];
		if ( page == undefined ) {
			alert('Page with name "'+name+'" does not exist!');
		}
		if ( params != undefined )
			page.params = params;
		else if ( page.params != null )
			params = page.params;
		else if ( params == undefined )
			params = {};

		this.options.buildTopMenu(page);

		if ( this.options.buildBottomMenu != null ){
			this.options.buildBottomMenu(page);
		}

		this.setLoading(page);

		if ( !page.shown || page.update )
			gx.util.setElementContentByType(page._ui.main, page.options.loadContent(page));

		page.update = false;

		this.movePage(page, direction);

		this.resetLoading(page);

		this._currentPage = page;
		page.shown = true;
	},

	movePage: function (page, direction) {
		var overlow = this._ui.root.getStyle('overflow');
		var coord = Object.clone(this._coordinates);
		coord.top = 0;
		if ( direction == 'right' ) {
			coord.left = coord.width;
		} else if ( direction == 'left' ) {
			coord.left = coord.width * -1;
		} else if ( direction == 'bottom' ) {
			coord.top = parseInt(coord.height) * 2;
			coord.left = 0;
			this.setStyle('overflow', 'hidden');
		} else if ( direction == 'top' ) {
			coord.left = 0;
			coord.top = (-1) * coord.height;
		}
		delete coord.height;
		page.setCoordinates(coord);

		if ( this._currentPage != null ) {
			this._currentPage.setStyle('z-index', this.options.zIndexBase);
		}
		page._ui.root.setStyles({
			'display': 'block',
			'z-index': this.options.zIndexBase + 1
		});

		var options = this.options.fxMoveOptions;
		options.relativeTo = this._ui.root;
		if ( this._currentPage != null ) {
			var onCompletePage = this._currentPage;
			options.onComplete = function () {
				if ( onCompletePage != page )
					onCompletePage.setStyle('display', 'none');
				this.setStyle('overflow', overlow);
				page.fireEvent('showComplete');
			}.bind(this);
		}
		var mover = new Fx.Move(page._ui.root, options);
		this._ui.root.scrollTo(0,0);
		mover.start();
	},

	/**
	 * @method showParent
	 * @description Show the parent page of the current page.
	 */
	showParent: function () {
		this.show(this._currentPage.options.parentPage.name, 'left');
	},

	buildTopMenu: function (page) {
		var css = this.options.cssPrefix;
		var table = __({
			'tag': 'table',
			'cellpadding': 0,
			'cellspacing': 0,
			'children': [
				{'tag': 'tr', 'children': [
					{'tag': 'td', 'class': css + 'TMBack ' + css + 'MenuIcon'},
					{'tag': 'td'}
				]},
			]
		});
		var td = table.getElements('td');

		var link = this.getBackLink(page)
		if ( link )
			td[0].adopt(link);

		var children = this.getChildren(page);
		if ( children.length > 0 ) {
			var a = __({'tag': 'a', 'html': this.options.childrenPageTitle});
			a.addEvent('click', function(e) {
				this.showChildrensPage(children);
			}.bind(this));
			//td[1].adopt(a);
		}
		gx.util.setElementContentByType(page._ui.topMenu, table);
		return table;
	},

	buildBottomMenu: function (page) {
		var css = this.options.cssPrefix;
		var table = __({
			'tag': 'table',
			'cellpadding': 0,
			'cellspacing': 0,
			'children': [
				{'tag': 'tr', 'children': [
					{'tag': 'td', 'class': css + 'MenuIcon ' + css + 'BTEdit'},
					{'tag': 'td', 'styles': 'width:100%;', 'html': '&nbsp;'},
				]},
			]
		});
		var tr = table.getElement('tr');
		for( var i in page.botMenuAdds ) {
			tr.adopt(page.botMenuAdds[i].addClass(css + 'MenuIcon'));
		}
		gx.util.setElementContentByType(page._ui.botMenu, table);
		page._ui.botMenuFake.setStyle('height', page._ui.botMenu.getStyle('height'));
		return table;
	},

	getBackLink: function (page) {
		if ( !page.options.parentPage )
			return false;

		var a = __({'tag': 'a', 'html': page.options.parentPage.title});
		a.addEvent('click', function() {
			//this.show(page.options.parentPage.name, 'left');
			page.showParent();
		}.bind(this));
		return a;
	},

	setLoading: function (page) {
		this.getLoader().addClass(this.options.cssPrefix + 'Loading');
	},

	resetLoading: function (page) {
		this.getLoader().removeClass(this.options.cssPrefix + 'Loading');
	},

	/**
	 * @method getPage
	 * @description Get object of given page name.
	 * @param {string} name Name of the page
	 */
	getPage: function (name) {
		return this._pages[name];
	},

	/**
	 * @method getCurrent
	 * @description Return the current page object.
	 */
	getCurrent: function () {
		return this._currentPage;
	},

	showChildrensPage: function (children) {
		this.show(this.options.childrenPageName, true, children);
	},

	getChildren: function (parentPage) {
		var children = new Array();
		var page;
		for( name in this._pages ) {
			page = this._pages[name];
			if ( page.options.parentPage &&
				 page.options.parentPage.name == parentPage.name &&
				 page.shown ) {
				children.push(this._pages[name]);
			}
		}
		return children;
	},

	// callback function ... called in class Page while create content
	// this means "this" is pointer to Page class instead of Pages class
	createChildrenPage: function (pages, parentPage, children) {
		// Caution: 'this' is reference to class Page !!!
		// this.show does not exist !
		var ul = new Element('ul');
		var a, li;
		// need function instead of loop to get new closure scope
		children.each( function(page) {
			li = new Element('li');
			a = new Element('a');
			a.set('html', page.title);
			a.addEvent('click', function(e) {
				this.show(page.name, true);
			}.bind(pages));
			li.adopt(a);
			ul.adopt(li);
		});
		return ul;
	},

	buildLoader: function () {
		var loader = new Element('div.' + this.options.cssPrefix + 'Loader', {
			style: 'z-index:' + this.options.zIndexBase + 2
		});
		loader.adopt(new Element('div'));
		this._ui.loader = loader;
		$$('body').adopt(loader);
	},

	getLoader: function () {
		return this._ui.loader;
	},
	setLoader: function (loader) {
		this._ui.loader = loader;
	},
});

/**
 * @class gx.ria.Page
 * @description Creates a menu line.
 * @extends gx.ui.Container
 *
 * @author Sebastian Glonner <sglonner@zeyon.net>
 * @version 1.00
 * @package ria
 * @copyright Copyright (c) 2011-2013, Zeyon (www.zeyon.net)
 *
 * @option {function} loadingContent Function which loads page content.
 * @option {string} parentPage Parent page of this page.
 *
 * @sample Page A small menu example.
 */
gx.ria.Page = new Class({
	Extends: gx.ui.Container,

	options: {
		loadContent: function() {
			return 'default loading content';
		},
		parentPage: null
	},

	myPages: null,

	params: {},
	shown: false,
	update: false,
	name: null,
	title: '',

	botMenuAdds: new Object(),

	navigation: null, // Top navigation menu div
	main: null,       // Main content div

	initialize: function(classRef, name, options) {
		this.parent(null, options);
		this.name = name;
		if ( options.title == undefined )
			this.title = name;
		else
			this.title = options.title;

		if ( options.className != undefined ) {
			this._ui.root.addClass(options.className);
		}

		this.myPages = classRef;

		this.setStyle('display', 'none');
		this.setStyle('position', 'absolute');

		var css = this.options.cssPrefix;
		this._ui.topMenu = new Element('div.' + css + 'Menu');
		this._ui.topMenu.addClass(css + 'TM');
		this._ui.botMenu = new Element('div.' + css + 'Menu');
		this._ui.botMenu.addClass(css + 'BM');
		this._ui.botMenuFake = new Element('div');
		this._ui.main = new Element('div');

		this._ui.root.adopt(this._ui.topMenu);
		this._ui.root.adopt(this._ui.main);
		this._ui.root.adopt(this._ui.botMenuFake);
		this._ui.root.adopt(this._ui.botMenu);
		this._ui.root.addClass(this.options.cssPrefix + 'PageBox');
	},

	show: function (direction, params) {
		this.myPages.show(this.name, direction, params);
	},

	showParent: function () {
		this.myPages.showParent();
	},

	buildTopMenu: function () {
		this.myPages.options.buildTopMenu(this);
	},

	buildBottomMenu: function () {
		this.myPages.options.buildBottomMenu(this);
	},

	addBotMenuItem: function (name, ele, options) {
		// !!! Do not use this function while you set custom buildBottomMenu() function
		if ( ele == undefined )
			ele = new Element('td');

		if ( ele.get('tag') != 'td' ) {
			if ( options == undefined )
				options = {};
			var td = new Element('td', options);
			gx.util.setElementContentByType(td, ele);

			this.botMenuAdds[name] = td;
			return td;
		} else {
			this.botMenuAdds[name] = ele;
			return ele;
		}
	},

	getBotMenuItem: function (name) {
		return this.botMenuAdds[name];
	},

	removeBotMenuItem: function (name) {
		delete this.botMenuAdds[name];
	},

	getDisplay: function () {
		return this._ui.main;
	},

	setLoading: function () {
		this.getPages().setLoading();
	},

	resetLoading: function () {
		this.getPages().resetLoading();
	},

	getPages: function () {
		return this.myPages;
	},

	getParent: function () {
		return this.options.parentPage;
	},

	getCurrent: function () {
		return this.getPages().getCurrent();
	}
});
