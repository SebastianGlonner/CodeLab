/**
 * @class gx.bootstrap.DataViewer
 * @description Helper class for viewing form data.
 * @extends gx.ui.Container
 *
 * @param {element|string} display The display element
 *
 * @option {array} columns Bootstrap column css classes to set columned viewing
 * @option {boolean} horizontal Show label and value horizontal on same base line
 *
 */
gx.bootstrap.DataViewer = new Class({
	Extends: gx.ui.Container,

	options: {
		columns: ['col-sm-12'],
		horizontal: false,
		floatingCells: false
	},

	data: {},
	origin: {},
	spanValues: null,

	_theme: {
		base: 'gxBootstrapDataViewer',
	},

	_converters: {},
	_hiding: [],

	initialize: function(display, options) {
		this.parent(display, options);
		this._ui.root.addClass('container-fluid');

		if ( this.options.horizontal ) {
			this._ui.root.addClass('horizontal');
		}

		$(this).addClass(this._theme.base);
	},

	build: function(parent) {
		if ( parent === undefined ) {
			parent = this._ui.root;
		}

		var key, d, i, div, row, column;
		var columnsPerRow = this.options.columns.length;
		var columnCounter = columnsPerRow;
		for ( key in this.data ) {
			if ( !this.data.hasOwnProperty(key) ) {
				continue;
			}

			if ( this._hiding.contains(key) )
				continue;

			d = this.data[key];

			if (this._converters[key] !== undefined) {
				if ( this._converters[key].type === 'multiple' )
					d.label = this._converters[key].label;

				d.value = this._converters[key].func(d.value, this.origin);
			}

			if ( instanceOf(d.value, gx.bootstrap.DataViewer.HideField) )
				continue;

			if ( columnCounter == columnsPerRow ) {
				if ( !this.options.floatingCells || !row )
					row = new Element('div.row');

				parent.adopt(row);
				columnCounter = 0;
			}

			column = new Element('div.' + this.options.columns[columnCounter]);
			row.adopt(column);

			column.adopt(new Element('label', {
				'html': d.label
			}));

			if ( !Array.isArray(d.value) )
				d.value = [d.value];

			div = new Element('div');
			for ( i = 0; i < d.value.length; i++ ) {
				if ( typeOf(d.value[i]) === 'element' ) {
					div.adopt(d.value[i]);
				} else {
					div.adopt(new Element('span', {
						'class': 'out',
						'html': !d.value[i] ? '&nbsp;' : d.value[i]
					}));
				}
			}

			column.adopt(div);

			columnCounter++;
		}

		this.spanValues = $(this).getElements('span.out');
	},

	show: function(data) {
		this.build(data);
		this.toggle.delay(400, this);
	},

	addSingleValue: function(ident, label, value) {
		if ( !label || label === '' )
			return;

		this.origin[ident] = value;
		this.data[ident] = {
			label: label,
			value: value,
		};
	},

	addDataByExternalLabels: function(data, labels) {
		var d, label;
		for ( d in data ) {
			if ( !data.hasOwnProperty(d) ) {
				continue;
			}
			label = labels[d];
			if ( typeof label === 'object' )
				label = label.label;

			this.addSingleValue(d, label, data[d]);
		}

	},

	addDataOfForm: function(form) {
		var data = form.getValues(),
			labels = form.getLabels();

		this.addDataByExternalLabels(data, labels);

	},

	addDataObject: function(data) {
		for ( var d in data ) {
			if ( !data.hasOwnProperty(d) ) {
				continue;
			}
			this.addSingleValue(d, d, data[d]);
		}
	},

	/**
	 * Add function converting several fields to a combined value by the given
	 * function. Hiding all given fields. The value will be replaced at position
	 * of the first field in the fields array.
	 * @param {string} label Optional alternative label.
	 * @param {array} fields Field identifiers.
	 * @param {function} func Converter function (value, data) {}
	 */
	addCombiningConverter: function(label, fields, func) {
		var field = fields.shift();
		this._converters[field] = {
			'label': label,
			'type': 'multiple',
			'func': func
		};

		this._hiding.append(fields);
	},

	/**
	 * Add function which converts the value of the given field by the given
	 * function.
	 * @param {string} field Field identifier
	 * @param {function} func  Converter function (value, data) {}
	 */
	addConverter: function(field, func) {
		this._converters[field] = {
			'type': 'single',
			'func': func
		};
	},

	refresh: function() {
		this.data = {};
		this.origin = {};
		$(this).empty();
	},

	toggle: function() {
		this.spanValues.toggleClass('out');
	}

});

gx.bootstrap.DataViewer.HideField = new Class();