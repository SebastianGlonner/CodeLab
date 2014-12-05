/**
 * @class gx.zeyos.Checklist
 * @description Creates a checklist control and loads the contents from a remote URL.
 * @extends gx.ui.Container
 * @implements gx.util.Console, gx.zeyos.Factory
 *
 * @option {int} height Component height
 * @option {bool} search Add a search field to the box
 * @option {string} method Request method
 * @option {string} url Request URL
 * @option {object} requestData Additional request data
 * @option {string} listValue The key name for element values
 * @option {function} listFormat Formatting function for the list output
 *
 * @event request
 * @event complete
 * @event failure
 *
 * @sample Checklist Simple checkboxes list example
 */
gx.zeyos.Checklist = new Class({
	gx: 'gx.zeyos.Checklist',
	Extends: gx.ui.Container,
	options: {
		'height': '110px',
		'search': true,
		'method': 'GET',
		'data': false,
		'url': false,
		'requestData': {},
		'listValue': 'ID',
		'listFormat': function(elem) {
			return elem.label;
		}
	},
	_elems: [],
	_bg: '',
	initialize: function(display, options) {
		var root = this;
		try {
			this.parent(display, options);
			this._display.frame = new Element('div', {'styles': {
				'height': root.options.height,
				'overflow': 'auto'
			}});
			this._display.root.adopt(this._display.frame);
			if (this.options.search) {
				this._display.search = {
					'box': new Element('div', {'class': 'bg p2'}),
					'txt': new Element('input', {'type': 'text', 'class': 'dyn fullw'})
				};
				this._display.search.box.inject(this._display.root, 'top');
				this._display.search.box.adopt(this._display.search.txt);
				this._display.search.txt.addEvent('keyup', function() {
					root.search(root._display.search.txt.value);
				});
			}
			this._display.table = new Element('table', {'style': 'width: 100%'});
			this._display.frame.adopt(this._display.table);

			if (this.options.url)
				this.load(this.options.url, this.options.requestData);
			if (isArray(this.options.data))
				this.buildList(this.options.data);
		} catch(e) { gx.util.Console('gx.zeyos.Checklist->initialize', e.message); }
	},

	/**
	 * @method buildList
	 * @description Creates the item table
	 *
	 * @param {array} list: List of objects {ID, label}
	 */
	buildList: function(list) {
		try {
			this._display.table.empty();
			list.each(function(item) {
				this.addItem(item);
			}, this);
		} catch(e) { gx.util.Console('gx.zeyos.Checklist->buildList', e.message); }
	},

	/**
	 * @method addItem
	 * @description Adds a new item row to the list
	 *
	 * @param {array} item Item row to add. Array that will be parsed through options.listFormat()
	 */
	addItem: function(item) {
		try {
			var elem = {
				'value': this.options.listFormat(item),
				'input': new gx.zeyos.Toggle(null, item[this.options.listValue])
			}

			elem.row = new Element('tr', {'class': 'em'+this._bg});
			var td1 = new Element('td', {'class': 'b_b-1', 'style': 'padding: 3px 13px 3px 3px; width: 50px;'});
			td1.adopt(elem.input.toElement());
			elem.row.adopt(td1);
			var td2 = new Element('td', {'class': 'b_b-1', 'html': elem.value});
			td2.addEvent('click', function() {
				elem.input.toggle();
			});
			elem.row.adopt(td2);
			this._display.table.adopt(elem.row);
			this._elems.push(elem);
			this._bg = this._bg == '' ? ' bg-FA' : '';
		} catch(e) { gx.util.Console('gx.zeyos.Checklist->addItem', e.message); }
	},

	/**
	 * @method search
	 * @description Evaluates a regular expression search query and displays the appropriate row
	 *
	 * @param {string} query The search query (regular expression)
	 */
	search: function(query) {
		try {
			var reg = new RegExp(query);
			this._elems.each(function(elem) {
				if (elem.value.search(reg) != -1)
					elem.row.setStyle('display', 'table-row');
				else
					elem.row.setStyle('display', 'none');
			}, this);
		} catch(e) { gx.util.Console('gx.zeyos.Checklist->search', e.message); }
	},

	/**
	 * @method reset
	 * @description Unchecks all checkboxes
	 */
	reset: function() {
		try {
			this._elems.each(function(elem) {
				elem.input.setUnchecked();
			});
		} catch(e) { gx.util.Console('gx.zeyos.Checklist->reset', e.message); }
	},

	/**
	 * @method getValues
	 * @description Returns an array of all the checked boxes' values
	 */
	getValues: function() {
		try {
			var values = [];
			this._elems.each(function(elem) {
				if (elem.input.getState())
					values.push(elem.input.getValue());
			});
			return values;
		} catch(e) {
			gx.util.Console('gx.zeyos.Checklist->getValues', e.message);
			throw e;
		}
	},

	/**
	 * @method load
	 * @description Sends a request to the specified URL
	 *
	 * @param {string} url The URL to send the request to
	 * @param {object} data The request data
	 */
	load: function(url, data) {
		var root = this;
		try {
			this._elems = [];
			this._bg = '';
			this._display.table.empty();

			if (url == null) url = root.options.url;
			if (data == null) data = root.options.requestData;

			var req = new Request({
				'method': root.options.method,
				'url': url,
				'data': data,
				'onComplete': function() {
					root._display.frame.removeClass('loader');
				},
				'onSuccess': function(res) {
					try {
						var obj = JSON.decode(res);
						if (isArray(obj)) {
							root.buildList(obj);
						} else {
							gx.util.Console('gx.zeyos.Checklist->search', 'Invalid server answer: ' + res);
						}
					} catch(e) {
						gx.util.Console('gx.zeyos.Checklist->search', e.message);
					}
				},
				'onRequest': function() {
					root._display.frame.addClass('loader');
				}
			});
			req.send();
		} catch(e) { gx.util.Console('gx.zeyos.Checklist->search', e.message); }
	}
});
