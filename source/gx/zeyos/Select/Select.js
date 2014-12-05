/**
 * @class gx.zeyos.Select
 * @description Creates a dynamic select box, which dynamically loads the contents from a remote URL
 * @extends gx.ui.Container
 * @implements gx.util.Console
 *
 * @param {element|string} display The display element
 *
 * @option {string} method Request method
 * @option {string} url Request URL
 * @option {string} height The height of the select box + 'px', default is '100px'
 * @option {string} width The width of the select box + 'px', default is '150px'
 * @option {object} requestData Additional request data
 * @option {string} requestParam Parameter for the request, default is 'search'
 * @option {string} listValue The key name for element values
 * @option {function} listFormat Formatting function for the list output
 * @option {function} formatID Formatting function for the list output
 * @option {function} decodeResponse Calls JSON.decode
 *
 * @event request When the list is requested
 * @event select When an element is selected
 * @event noselect When no element is selected
 *
 * @sample Select Simple search in select box example.
 */
gx.zeyos.Select = new Class({
	gx: 'gx.zeyos.Select',
	Extends: gx.ui.Container,
	options: {
		'method': 'GET',
		'url': 'index.php',
		'height': '150px',
		'width': '300px',
		'requestData': {},
		'requestParam': 'search',
		'default': '*',
		'searchFilter': undefined,
		'localOptions': null,
		'itemImage': function (elem) {
			return (
				elem.img != null
				? '<img src="'+ elem.img +'"/>'
				: '<img src=""/>'
			)
		},
		'listFormat': function (elem) {
			return elem.name;
		},
		'formatID': function (elem) {
			return elem.ID;
		},
		'decodeResponse': function (json) {
			return JSON.decode(json);
		},
		/* Messages */
		'msg': {
			'de': {
				'noSelection': '(Keine Auswahl)'
			},
			'noSelection': '(No Selection)'
		},
		/* Events */
		'onRequest': false, 	// When the list is requested
		'onSelect': false, 		// When an element is selected
		'onNoSelect': false		// When no element is selected
	},
	_running: false,
	_closed: true,
	_lastSearch: false,
	_selected: null,
	_selectedItem: null,
	_search: '',
	$items: [],
	initialize: function (display, options) {
		var root = this;
		try {
			this.parent(display, options);

			this._display.root.addClass('searchbox');
			this._display.fieldset = new Element('fieldset', {
				'class': 'sel',
				'name': 'view',
				'style': 'max-width:' + root.options.width,
				'data-text': 'test',
				'data-value': 'test'
			});
			this._display.textbox = new Element('input', {
				'placeholder': root.options.msg.noSelection
			});

			this._display.listbox = new Element('section', {
				'style': 'min-height:' + this.options.height
				/*
				'class': 'listbox list',
				'styles': {
					'height': this.options.height,
					'width': this.options.width
				}
				*/
			});
			this._display.fieldset.adopt(this._display.textbox);
			this._display.fieldset.adopt(this._display.listbox);
			this._display.root.adopt(this._display.fieldset);

			this._display.textbox.addEvent('click', function () {
				root.show();
			});
			this._display.textbox.addEvent('keyup', function () {
				root.search();
			});
			this._display.textbox.addEvent('blur', function () {
				root.hide.delay(500, root);
			});

			if (isFunction(this.options.onRequest))
				this.addEvent('request', this.options.onRequest);
			if (isFunction(this.options.onSelect))
				this.addEvent('select', this.options.onSelect);
			if (isFunction(this.options.onNoSelect))
				this.addEvent('noselect', this.options.onNoSelect);

			this._display.textbox.set('value');
		} catch(e) {
			gx.util.Console('gx.zeyos.Select->initialize', gx.util.parseError(e) );
		}
	},

	/**
	 * @method search
	 * @description Initiates a search request
	 * @param {string} search The search string
	 */
	search: function (search) {
		var root = this;
		try {
			if (search == null)
				search = this._display.textbox.get('value').trim();
			if (search == '' || search == null)
				search = this.options['default'];

			// search === this._lastSearch strict comparison is necessary.
			// Because on focus select: '' != false => results in false -> no search will be executed
			// only '' !== false => results in true
			if ( search === this._lastSearch ) {

			} else if ( this.options.localOptions ) {
				this._lastSearch = search;
				this.buildList(
					this.options.searchFilter
					? this.options.searchFilter.apply(this, [this.options.localOptions, this._lastSearch])
					: this.options.localOptions
				);

			} else if ( this._running !== true ) {
				this.fireEvent('request');
				this._running = true;
				this._lastSearch = search;
				var data = this.options.requestData;
				data[this.options.requestParam] = search;

				req = new Request({
					'method': root.options.method,
					'url': root.options.url,
					'data': data,
					'onSuccess': function (json) {
						root.evalResponse(json);
					},
					'onFailure': function () {
						alert('Request failed');
					}
				});
				req.send();
			}
		} catch(e) { gx.util.Console('gx.zeyos.Select->search', e.message); }
	},

	/**
	 * @method evalResponse
	 * @description Evaluates the response: Decodes the JSON, calls buildList with the result and then calls search
	 * @param {string} json The JSON response to evaluate
	 */
	evalResponse: function (json) {
		try {
			var obj = this.options.decodeResponse(json);
			if (typeOf(obj) == 'array')
				this.buildList(
					this.options.searchFilter
					? this.options.searchFilter.apply(this, [obj, this._lastSearch])
					: obj
				);
			else
				gx.util.Console('gx.zeyos.Select->evalResponse.', 'Invalid object type. Array expected.');
		} catch(e) { gx.util.Console('gx.zeyos.Select->evalResponse', gx.util.parseError(e)); }
		this._running = false;
		this.search();
	},

	/**
	 * @method buildList
	 * @description Builds a list of links from the provided array
	 * @param {array} list The provided array
	 */
	buildList: function (list) {
		var root = this;
		try {
			this._display.listbox.empty();
			var len = list.length;
			var addCLink = function (el, link) {
				link.addEvent('click', function () {
					root.set(el, link);
				});
			};

			this.$items = [];

			for (i = 0 ; i < len ; i++) {
				var active = '';
				if ( this._selected != null && this.options.formatID(list[i]) == this.options.formatID(this._selected))
					active = ' act';

				var link = new Element('div', {
					'class'     : 'sel_item ico' + active,
					'html'      : this.options.itemImage(list[i]),
					'data-text' : this.options.listFormat(list[i]),
					'data-value': this.options.formatID(list[i])
				});

				this.$items.push(link);

				this._display.listbox.adopt(link);
				addCLink(list[i], link);
			}
		} catch(e) { gx.util.Console('gx.zeyos.Select->buildList', e.message); }
	},

	/**
	 * @method show
	 * @description Shows the select box
	 */
	show: function () {
		//this._display.listbox.setStyle('display', 'block');
		this._display.fieldset.addClass('act');
		this._display.textbox.set('value', this._search);
		this._display.textbox.focus();
		this._closed = false;
		this.search();
	},

	/**
	 * @method hide
	 * @description Hides the select box
	 */
	hide: function () {
		if (!this._closed) {
			this._closed = true;
			//this._display.listbox.setStyle('display', 'none');
			this._display.fieldset.removeClass('act');
			this._search = this._display.textbox.get('value');
			this.update();
		}
	},

	/**
	 * @method update
	 * @description Updates the select box according to its state of selection
	 */
	update: function () {
		if (this._selected == null) {
			this.fireEvent('noselect');
			this._display.textbox.set('value', '');
		} else {
			this.fireEvent('select', this._selected);
			this._display.textbox.set('value', this.options.listFormat(this._selected));
		}
	},

	/**
	 * @method setRequestData
	 * @param {object} The default request data
	 */
	setRequestData: function (data) {
		this.options.requestData = data;
	},

	/**
	 * @method set
	 * @description Sets the selected element
	 * @param {object} selection The element to select
	 */
	set: function (selection, link) {
		if ( this._selectedItem )
			this._selectedItem.removeClass('act');

		if ( link )
			link.addClass('act');

		this._selected = selection;
		this._selectedItem = link;
		if (!this._closed)
			this.hide();
		else
			this.update();
	},

	select: function (id) {
		for (var i = 0; i < this.options.localOptions.length; i++) {
			if ( this.options.formatID(this.options.localOptions[i]) === id ) {
				this.set(this.options.localOptions[i], this.$items[i]);
				return;
			}
		}
	},

	/**
	 * @method getID
	 * @description Returns the ID of the selected element
	 */
	getID: function () {
		return this.options.formatID(this._selected);
	},

	/**
	 * @method getSelected
	 * @description Returns the selected element
	 */
	getSelected: function () {
		return this._selected;
	},

	/**
	 * @method reset
	 * @description Resets the selection
	 */
	reset: function () {
		this._display.listbox.empty();
		this._selected = null;
		this._lastSearch = false;
		this.update();
	},

	/**
	 * @method enable
	 * @description Enables the text box
	 */
	enable: function () {
		this._display.textbox.erase('disabled');
	},

	/**
	 * @method disable
	 * @description Disables the text box
	 */
	disable: function () {
		this._display.textbox.set('disabled', true);
	}
});
