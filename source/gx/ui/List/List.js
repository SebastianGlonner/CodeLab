/**
 * @class gx.ui.List
 * @description Creates a menu lines.
 * @extends gx.ui.Container
 * @implements gx.core.Parse
 *
 * TODO: Custom html elements
 *
 * @option {function} createItem Function which create one list item
 * @option {function} createHead Function which create header
 * @option {string} cssPrefix
 * @option {string} noFilterExpression String if no filter is choosed
 * @option {string} noFilterString
 * @option {string} emptyFilterValue
 * @option {function} getFilterFields Function which return array with the item names
 * @option {object} fCondition All filter conditions
 *
 * @author Sebastian Glonner <sglonner@zeyon.net>
 * @version 1.00
 * @package ria
 * @copyright Copyright (c) 2011-2013, Zeyon (www.zeyon.net)
 *
 * @sample List A small list example.
 */
gx.ui.List = new Class({
	Extends: gx.ui.Container,

	options: {
		cssPrefix: 'gxUiList',
		noFilterExpression: '--no filter--',
		noFilterString: '###',
		emptyFilterValue: '--empty--',
		createItem: function (values) {
			var item = values.item;
			var li = values.li;
		},
		createHead: null,
		getFilterFields: function (item) {
			var names = new Array();
			for ( var i in item ) {
				if ( !item.hasOwnProperty(i) || i == 'page' )
					continue;

				names.push(i);
			}
			return names;
		},
		compLike: function (value, filter) {
			if ( !isNaN(value) )
				value = value.toString();
			if ( !value.test( new RegExp(filter.expression, filter.flags) ) )
				return false;

			return true;
		},

		compEqual: function (value, filter) {
			if ( value != filter.expression )
				return false;

			return true;
		},
		compBigger: function (value, filter) {
			if ( value > filter.expression )
				return true;

			return false;
		},
		compSmaller: function (value, filter) {
			if ( value < filter.expression )
				return true;

			return false;
		},
		compBiggerEqual: function (value, filter) {
			if ( value >= filter.expression )
				return true;

			return false;
		},
		compSmallerEqual: function (value, filter) {
			if ( value <= filter.expression )
				return true;

			return false;
		},
		fConditions: null
	},

	_filterActive: false,

	_items: [],

	_values: {},

	initialize: function(display, options) {
		this.options.fConditions = {
			'like': {'func': this.options.compLike, 'name': 'LIKE'},
			'equal': {'func': this.options.compEqual, 'name': '=='},
			'bigger': {'func': this.options.compBigger, 'name': '>'},
			'smaller': {'func': this.options.compSmaller, 'name': '<'},
			'biggerEqual': {'func': this.options.compBiggerEqual, 'name': '>='},
			'smallerEqual': {'func': this.options.compSmallerEqual, 'name': '<='}
		};

		this.parent(display, options);
		this._ui.list = new Element('ul', {'class': this.options.cssPrefix + 'Ul'});

		if ( this.options.createHead != null ) {
			this._ui.head = new Element('div', {'class': this.options.cssPrefix + 'Head'});
			gx.util.setElementContentByType(this._ui.head, this.options.createHead(options));
			this._ui.root.adopt(this._ui.head);
		}
		this._ui.root.adopt(this._ui.list);


	},


	/**
	 * @method add
	 * @description Add list item
	 * @param {json object} option The option to set
	 * @param {object} item The list element values
	 * @param {object} options
	 */
	add: function (item, options) {
		var li = new Element('li', {'class': this.options.cssPrefix + 'Li'});
		li.store('item', item);
		var item = {
			item: item,
			li: li
		};
		gx.util.setElementContentByType(li, this.options.createItem(item));
		this._ui.list.adopt(li);
		this._items.push(item);
	},

	/**
	 * @method addAll
	 * @description Adds array of list items
	 * @param {array} items Array of items
	 */
	addAll: function (items) {
		for( i in items) {
			if ( !items.hasOwnProperty(i) )
				continue;

			this.add(items[i].item, items[i].options);
		}
	},

	/*
	[{
		'name': name,
		'condition': 'like',
		'expression': 'compare',
		'flags': regex
	}]
	*/
	/**
	 * @method applyFilter
	 * @description Apply filter to the list
	 * @param {object} filters 	[{'name': name,'condition': 'like','expression': 'compare','flags': regex}]
	 */
	applyFilter: function (filters) {
		this._ui.list
			.set('tween', {
				duration: 'short',
				onComplete: function () {
					this._ui.list.empty();
					var valid, item, filter, value, expression;
					for( var j in this._items ) {
						if ( !this._items.hasOwnProperty(j) )
							continue;

						valid = true;
						item = this._items[j];
						for( var i in filters ) {
							if ( !filters.hasOwnProperty(i) )
								continue;

							filter = filters[i];
							value = item.item[filter.name];
							if ( !isNaN(parseFloat(value)) )
								value = parseFloat(value);
							expression = filter.expression;
							if ( !isNaN(parseFloat(expression)) )
								filter.expression = parseFloat(expression);

							if ( !this.options.fConditions[filter.condition].func(value, filter) ) {
								valid = false;
								break;
							}
						}
						if ( valid )
							this._ui.list.adopt(item.li);
					}
					// Because we fade in inside onComplete event we have to remove
					// the event or we get endless loop
					this._ui.list.get('tween').removeEvents('complete');
					this._ui.list.fade(1);

				}.bind(this)
			})
			.fade(0);
		this._filterActive = true;
	},

	/**
	 * @method removeFilter
	 * @description Remove all filters
	 * @param {boolean} fade Remove with fade effect
	 */
	removeFilter: function (fade) {
		if ( fade === false ) {
			this.remove()
		} else {
			this._ui.list
				.set('tween', {
					duration: 'short',
					onComplete: this.remove.bind(this)
				})
				.fade(0);
		}
		this._filterActive = false;
	},


	remove: function () {
		this._ui.list.empty();
		for( var j in this._items ) {
			if ( !this._items.hasOwnProperty(j) )
				continue;

			this._ui.list.adopt(this._items[j].li);
		}
		// Because we fade in inside onComplete event we have to remove
		// the event or we get endless loop
		this._ui.list.get('tween').removeEvents('complete');
		this._ui.list.fade(1);

	},

	createValues: function () {
		var fields = this.options.getFilterFields(this._items[0].item);
		var filters = new Object();
		var name, values, item;
		for ( var j in fields ) {
			if ( !fields.hasOwnProperty(j) )
				continue;

			name = fields[j];
			values = new Array();
			for ( var i in this._items ) {
				if ( !this._items.hasOwnProperty(i) )
					continue;

				item = this._items[i].item;
				if ( values.contains(item[name]))
					continue;

				values.push( item[name] );
			}
			filters[name] = values;
		}
		this._values = filters;
		return filters;
	},

	/**
	 * @method createSelects
	 * @description Create selects with all posible list values.
	 */
	createSelects: function () {
		var select, filter, option, value, name;
		var selects = new Object();
		for ( var field in this._values ) {
			if ( !this._values.hasOwnProperty(field) )
				continue;

			select = new Element('select', {
				'name': field,
				'id': field,
				//'multiple': 'multiple'
			});
			filter = this._values[field];

			select.adopt(new Element('option', {
				'value': this.options.noFilterString,
				'html': this.options.noFilterExpression
			}));
			for ( var i in filter ) {
				if ( !filter.hasOwnProperty(i) )
					continue;

				name = filter[i];
				value = filter[i];
				if ( value == '' )
					name = this.options.emptyFilterValue;

				option = new Element('option', {
					'value': value,
					'html': name
				});
				select.adopt(option);
			}
			selects[field] = select;
		}
		return selects;
	},

	/**
	 * @method createConditionSelect
	 * @description Create select with the filter conditions.
	 */
	createConditionSelect: function () {
		var select = new Element('select')
		var fcond, option;
		for ( var i in this.options.fConditions ) {
			if ( !this.options.fConditions.hasOwnProperty(i) )
				continue;

			fcond = this.options.fConditions[i];
			option = new Element('option', {
				'value': i,
				'html': fcond.name
			});
			select.adopt(option);
		}
		return select;
	},

	getDisplay: function () {
		return this._ui.root;
	},

	getValues: function () {
		return this._values;
	},

	/**
	 * @method clearItems
	 * @description Remove all items
	 */
	clearItems: function () {
		this._items = new Array();
		this._ui.list.empty();
	},

	getItems: function () {
		return this._items;
	},

	/**
	 * @method filterActive
	 * @description Is filter active?
	 */
	filterActive: function () {
		return this._filterActive;
	}
});
