/**
 * @class gx.bootstrap.Select
 * @description Creates a dynamic select box, which dynamically loads the contents from a remote URL
 * @extends gx.ui.Container
 * @implements gx.util.Console, gx.ui.OC_Container
 *
 * @param {element|string} display The display element
 *
 * @option {bool} customvalue True: Allow any string. If user does no selection the search string will be used as value.
 * @option {function} enableLoader Activate custom loading.
 * @option {function} disableLoader Deactivate custom loading.
 * @option {string} method Request type.
 * @option {string} url Request URL.
 * @option {string} height The height of the select box. Set if not false.
 * @option {string} min_height The max-height of the select box. Set if not false.
 * @option {string} max_height The max-height of the select box. Set if not false.
 * @option {string} width The width of the select box + 'px', default is '150px'
 * @option {object} requestData Additional request data
 * @option {string} requestParam Parameter for the request, default is 'search'
 * @option {function} searchFilter Custom filter on client side.
 * @option {object} localOptions Use these local options instead of requesting.
 * @option {bool} localFilter If true we request data only once and use searchFilter option to filter.
 * @option {bool} allowEmpty Allow setting empty value.
 * @option {string} icon The bootstrap glyphicon icon.
 * @option {string} label String used as label instead of the icon.
 * @option {string} orientation Icon | Label on left or right side.
 * @option {string} default Default value for searching when requesting data.
 * @option {function} listFormat Formatting function for the list output
 * @option {function} textFormat Formatting function for the input field text. This text will be used for filtering by the default filter.
 * @option {function} formatID Formatting function for the list output
 * @option {function} decodeResponse Calls JSON.decode
 *
 * @event request When the list is requested
 * @event select When an element is selected
 * @event noselect When no element is selected
 *
 * @sample Select Simple search in select box example.
 */
gx.bootstrap.Select = new Class({

	gx: 'gx.bootstrap.Select',

	Extends: gx.ui.Container,

	options: {
		'customvalue'    : false,
		'enableLoader'   : undefined,
		'disableLoader'  : undefined,
		'method'         : 'GET',
		'url'            : 'index.php',
		'height'         : 180,
		'min_height'     : false,
		'max_height'     : false,
		'width'          : '100%',
		'requestData'    : {},
		'requestParam'   : 'search',
		'searchFilter'   : undefined,
		'useDefaultSearchFilter' : false,
		'localOptions'   : null,
		'localFilter'    : false,
		'allowEmpty'     : false,

		/**
		 * A string to use as the component's label or an object to pass to "Element.set()".
		 * if label === false && icon === false do not show icon.
		 */
		'icon'           : 'list-alt',
		'label'          : '',

		'orientation'    : 'left',
		'default'        : '*',
		'textFormat'     : function (elem) {
			return elem.name;
		},
		'listFormat'     : function (elem) {
			return elem.name;
		},
		'formatID'       : function (elem) {
			return elem.Id;
		},
		'decodeResponse' : function (json) {
			return JSON.decode(json);
		},
		'reset'          : false,
		/* Messages */
		'msg'            : {
			'de'         : {
				'noSelection': 'Keine Auswahl'
			},
			'noSelection': 'No Selection'
		}
	},

	_running       : false,
	_closed        : true,
	_lastSearch    : false,
	_selected      : null,
	_value         : null,
	_search        : '',
	_list          : [],

	_customvalue   : '',

	initialize: function (display, options) {
		var root = this;
		try {
			this.parent(display, options);

			if (this.options.textFormat == null)
				this.options.textFormat = this.options.listFormat;

			var noIconGroup = false;
			if ( this.options.label === false && this.options.icon === false )
				noIconGroup = true;

			this._display.root.addClass('bs-select' + ( noIconGroup ? '' : ' input-group' ) );

			// setting height to 35px (bootstrap std: 34px ) fixing some strange issue which
			// breaking the floating left and right while creating form with columns
			this._display.textbox = new Element('input', {
				'type'  : 'text',
				'class' : 'form-control',
				'styles': {'height': '35px'},
				'placeholder': this.getMessage('noSelection')
			});

			this._display.textbox._jsSelectImplementation = this;

			var iconMarkup = ( this.options.icon ? '<span class="glyphicon glyphicon-'+this.options.icon+'"></span>' : '' );

			this._display.symbol = new Element('span')
				.addEvent('click', function (event) {
					event.stopPropagation();
					root.show();
				});

			if ( this.options.label && (typeof(this.options.label) === 'object') ) {
				var labelOptions = Object.clone(this.options.label);
				var labelText    = ( labelOptions.html == null ? String(labelOptions.text).htmlSpecialChars() : labelOptions.html );
				labelOptions.html = iconMarkup+( labelOptions.text ? ' '+labelOptions.text : '' );
				delete labelOptions.text;
				this._display.symbol.set(labelOptions);
			} else if (iconMarkup != '' || (this.options.label && this.options.label != '')) {
				this._display.symbol.set('html', iconMarkup+( this.options.label ? ' '+this.options.label : '' ));
			}

			this._display.symbol.addClass('input-group-addon');

			this.listbox = new gx.ui.OC_Container(new Element('ul', {
				'class': 'dropdown-menu bs-select-menu',
				'styles': {
					'overflow'   : 'auto'
				}
			}), {
				'initclosed' : true,
				'effect'     : 'Sliding',
				'height'     : this.options.height,
				'min_height' : this.options.min_height,
				'max_height' : this.options.max_height,
				'overflow'   : 'auto'
			});

			this._display.listbox = $(this.listbox);

			if ( this.options.width )
				this._display.listbox.setStyle('width', this.options.width);

			if ( this.options.height )
				this._display.listbox.setStyle('height', this.options.height);

			if ( noIconGroup )
				this._display.root.adopt(this._display.textbox);

			else if ( this.options.orientation == 'left' )
				this._display.root.adopt([this._display.symbol, this._display.textbox]);

			else {
				this._display.root.adopt([this._display.textbox, this._display.symbol]);

			}

			this._display.root.adopt([
				this._display.listbox
			]);

			this._display.textbox.addEvents({
				'focus': function () {
					root.show();
				},
				'keydown' : function(event) {
					if ( event.key == 'enter' ) {
						event.stopPropagation();
						event.preventDefault();
						root.hide();
						this.blur();
						return false;
					}
				},
				'keyup': function (event) {
					if ( root.options.customvalue )
						root.customValueReset();

					root._customvalue = root._display.textbox.get('value').trim();
					root.search();
				},
				'blur': function () {
					root.hide.delay(500, root);
				}
			});

			if ( this.options.useDefaultSearchFilter ) {
				this.options.searchFilter = this.fullTextSearchFilter;
				this.options.localFilter = true;
			}

			if ( this.options.localOptions )
				this.search();

			this.update();
		} catch(e) {
			gx.util.Console('gx.bootstrap.Select->initialize', e.stack );
		}
	},

	fullTextSearchFilter: function (elements, search) {
		if ( search == '' || search == null || search == this['default'] )
			return elements;

		search = search.toLowerCase();
		var res = [];
		for ( var i = 0; i < elements.length; i++ ) {
			if ( this.textFormat(elements[i]).toLowerCase().indexOf(search) != -1 )
				res.push(elements[i]);
		}
		return res;
	},

	/**
	 * @method search
	 * @description Initiates a search request.
	 * @param {string} search The search string
	 * @returns Returns this instance (for method chaining).
	 * @type gx.bootstrap.Select
	 */
	search: function (search) {
		var root = this;
		try {
			if ( search == null )
				search = this._display.textbox.value.trim();
			if ( search == '' || search == null )
				search = this.options['default'];
			// search === this._lastSearch strict comparison is necessary.
			// Because on focus select: '' != false => results in false -> no search will be executed
			// only '' !== false => results in true
			if ( search === this._lastSearch ) {

			} else if ( this.options.localOptions ) {
				this._lastSearch = search;
				this.buildList(
					this.options.searchFilter
					? this.options.searchFilter(this.options.localOptions, this._lastSearch)
					: this.options.localOptions
				);

			} else if ( this._running !== true ) {
				this.fireEvent('request');
				this._running = true;
				this._lastSearch = search;

				this.doRequest(search);
			}
		} catch(e) {
			gx.util.Console('gx.bootstrap.Select->initialize', e.stack );
		}

		return this;
	},

	doRequest: function(search) {
		var root = this;
		var data = this.options.requestData;

		if ( !this.options.searchFilter ) {
			if (typeOf(this.options.requestParam) == 'function')
				data = this.options.requestParam(data, search);
			else
				data[this.options.requestParam] = search;
		}

		var reqOptions = {
			'method'   : root.options.method,
			'url'      : root.options.url,
			'data'     : data,
			'onSuccess': function (json) {
				root.evalResponse(json);
			},
			'onFailure': function () {
				alert('Request failed');
			}
		};
		if ( typeOf(root.options.enableLoader) == 'function' ) {
			reqOptions.onRequest = root.options.enableLoader;

		}
		if ( typeOf(root.options.disableLoader) == 'function' ) {
			reqOptions.onComplete = root.options.disableLoader;

		}
		req = new Request(reqOptions);

		req.send();

	},

	/**
	 * @method evalResponse
	 * @description Evaluates the response: Decodes the JSON, calls buildList with the result and then calls search
	 * @param {string} json The JSON response to evaluate
	 * @returns Returns this instance (for method chaining).
	 * @type gx.bootstrap.Select
	 */
	evalResponse: function (json) {
		try {
			var obj = this.options.decodeResponse(json);
			if ( typeOf(obj) == 'array' ) {
				this.buildList(
					this.options.searchFilter
					? this.options.searchFilter(obj, this._lastSearch)
					: obj
				);

				if ( this.options.localFilter )
					this.options.localOptions = Array.clone(obj);

			} else
				gx.util.Console('gx.bootstrap.Select->evalResponse.', 'Invalid object type. Array expected.');
		} catch(e) { gx.util.Console('gx.bootstrap.Select->evalResponse', gx.util.parseError(e)); }

		this._running = false;
		this.search();
	},

	/**
	 * @method buildList
	 * @description Builds a list of links from the provided array.
	 * @param {array} list The provided array
	 * @returns Returns this instance (for method chaining).
	 * @type gx.bootstrap.Select
	 */
	buildList: function (list) {
		var root = this;
		try {
			this._display.listbox.empty();

			if (this.options.reset) {
				this._display.listbox.adopt(new Element('li').adopt(
					new Element('a', {'styles': {'text-align': 'center', 'font-style': 'italic'}, 'html': this.options.reset})
						.addEvent('click', function() {
							root.set();
						})
				));
			}

			var odd = true;
			var addCLink = function (link, item) {
				link.addEvent('click', function () {
					$$('.dropdown-menu .selected').removeClass('selected');
					link.getParent().addClass('selected');
					root.set(item);
				});
			};

			if ( this.options.allowEmpty )
				list = [ null ].append(list);

			this._list = list;

			var len = list.length;

			for (i = 0 ; i < len ; i++) {
				var link = new Element('a');

				var listItem = new Element('li').adopt(link);
				if ( odd )
					listItem.set('class', 'odd');

				if ( this.formatId(list[i]) === this._value ) {
					this._selected = list[i];
				}

				if ( this.formatId(list[i]) === this._value ) {
					listItem.addClass('selected');
				}

				var contents = (
					( (list[i] == null) && (typeof(this.options.allowEmpty) === 'string') )
					? this.options.allowEmpty
					: this.options.listFormat(list[i])
				);
				if ( typeOf(contents).match(/^elements?$/) )
					link.empty().adopt(contents);
				else
					link.set('html', contents);

				this._display.listbox.adopt(listItem);
				odd = !odd;
				addCLink(link, list[i]);
			}
		} catch(e) {
			gx.util.Console('gx.bootstrap.Select->buildList', e.message);
		}

		return this;
	},

	/**
	 * @method show
	 * @description Shows the select box.
	 * @returns Returns this instance (for method chaining).
	 * @type gx.bootstrap.Select
	 */
	show: function () {
		if ( this._display.textbox.disabled )
			return this;

		//this._display.listbox.setStyle('display', 'block');
		this.listbox.show();
		if ( !this.options.customvalue )
			this._display.textbox.set('value', this._search);
		this._display.textbox.focus();
		this._closed = false;

		return this.search();
	},

	/**
	 * @method hide
	 * @description Hides the select box.
	 * @returns Returns this instance (for method chaining).
	 * @type gx.bootstrap.Select
	 */
	hide: function () {
		if ( this._closed )
			return this;

		this._closed = true;
		this.listbox.hide();
		this._search = this._display.textbox.value;

		return this.update();
	},

	/**
	 * @method update
	 * @description Updates the select box according to its state of selection.
	 * @returns Returns this instance (for method chaining).
	 * @type gx.bootstrap.Select
	 */
	update: function () {
		if ( this._value == null ) {
			this.fireEvent('noselect');

			if ( !this.options.customvalue ) {
				this._display.textbox.setStyle('font-style', 'italic');
				this._display.textbox.value = '';
			}
		} else {
			this.fireEvent('select', [ this._selected, this._value ]);
			this._display.textbox.setStyle('font-style', 'normal');
			this._display.textbox.value = this.options.textFormat(this._selected) || this._value;
		}

		return this;
	},

	/**
	 * @method setRequestData
	 * @param {object} The default request data
	 * @returns Returns this instance (for method chaining).
	 * @type gx.bootstrap.Select
	 */
	setRequestData: function (data) {
		this.options.requestData = data;
		return this;
	},

	/**
	 * @method set
	 * @description Sets the selected element.
	 * @param {object} selection The element to select
	 * @returns Returns this instance (for method chaining).
	 * @type gx.bootstrap.Select
	 */
	set: function (selection) {
		this._selected = selection;

		if ( this.options.customvalue )
			this._customvalue = this.options.textFormat(this._selected) || this._value;

		if ( typeof(selection) === 'object' ) {
			this._value = this.formatId(selection);

		} else {
			// Scalar value; determine matching list item

			this._value    = selection;

			var found = false;

			for (var i = 0; i < this._list.length; i++) {
				if ( this.formatId(this._list[i]) == selection ) {
					this._selected = this._list[i];
					found          = true;
					break;
				}
			}

			if ( !found ) {
				this.fireEvent('select', [ null, selection ]);
				this._display.textbox.setStyle('font-style', 'normal');
				this._display.textbox.value = selection;

				this._selected = null;

				return this;
			}

		}

		return ( this._closed ? this.update() : this.hide() );
	},

	/**
	 * @method formatId
	 * @description Returns the ID of the specified element.
	 * @param Object item
	 * @returns The ID.
	 * @type Object
	 */
	formatID: function(itme) {
		return this.formatId(item);
	},
	formatId: function (item) {
		return (
			item == null
			? undefined
			: this.options.formatID(item)
		);
	},

	/**
	 * @method getId
	 * @description Returns the ID of the selected element.
	 * @returns The ID.
	 * @type Object
	 */
	getId: function () {
		return this.formatId(this._selected);
	},

	/**
	 * @method getValue
	 * @description Alias for getID.
	 * @returns The ID.
	 * @type Object
	 */
	getValue: function () {
		var id = this.getId();
		if ( !this.options.customvalue || id != null )
			return id;

		return this._customvalue;
	},

	/**
	 * @method getSelected
	 * @description Returns the selected element.
	 * @returns The selected item.
	 * @type Object
	 */
	getSelected: function () {
		return this._selected;
	},

	/**
	 * @method reset
	 * @description Resets the selection.
	 * @returns Returns this instance (for method chaining).
	 * @type gx.bootstrap.Select
	 */
	reset: function () {
		this._display.listbox.empty();

		this._selected   = null;
		this._value      = null;
		this._lastSearch = false;

		return this.update();
	},

	customValueReset: function() {
		$$('.dropdown-menu .selected').removeClass('selected');
		this._selected   = null;
		this._value      = null;
		this._lastSearch = false;

		return this.update();

	},

	/**
	 * @method enable
	 * @description Enables the text box.
	 * @returns Returns this instance (for method chaining).
	 * @type gx.bootstrap.Select
	 */
	enable: function () {
		this._display.textbox.erase('disabled');
		return this;
	},

	/**
	 * @method disable
	 * @description Disables the text box.
	 * @returns Returns this instance (for method chaining).
	 * @type gx.bootstrap.Select
	 */
	disable: function () {
		this._display.textbox.set('disabled', true);
		return this;
	},

	setDisabled: function(disable) {
		if ( !disable )
			this.enable();
		else
			this.disable();
	},

	/**
	 * Return the input element.
	 * @return {Element}
	 */
	getInput: function() {
		return $(this._display.textbox);
	}

});
