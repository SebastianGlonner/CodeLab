/**
 * @class gx.zeyos.Table
 * @description Creates a dynamic select box, which dynamically loads the contents from a remote URL.
 * @extends gx.ui.Container
 * @implements gx.util.Console
 * @sample Table
 *
 * @event click
 * @event dblclick
 * @event filter
 * @event rowAdd
 * @event addData
 * @event setData
 * @event complete
 * @event beforeRowAdd
 * @event afterRowAdd
 *
 * @option {array} cols The table column structure
 * @option {function} structure Formatting row data into columns (returns an array)
 * @option {array} data The list data
 * @option {bool} onClick when a row is clicked
 * @option {bool} onFilter when a filter is set
 * @option {bool} onRowAdd when a row is added
 * @option {bool} onStart when the table is being rendered
 * @option {bool} onComplete when the table is rendered completely
 */
gx.zeyos.Table = new Class({
	gx: 'gx.zeyos.Table',
	Extends: gx.ui.Container,
	options: {
		'cols': [
			{'label': 'Column 1', 'id': 'col1', 'width': '20px', 'filter': 'asc'},
			{'label': 'Column 2', 'id': 'col2'}
		],
		'structure': function(row, index) {
			return [
				row.col1,
				{'label': row.col2, 'className': row.col2class}
			]
		},
		'data': []
	},
	_cols: [],
	_filter: false,
	_colspan: 0,
	_scrollBarCol: false,

	initialize: function(display, options) {
		var root = this;
		try {
			this.parent(display, options);
			//this.addEvent('complete', this.adoptSizeToHead.bind(this));

			this._display.table = new Element('table', {'class': 'tbl'});
			this._display.thead = new Element('thead');
			this._display.theadRow = new Element('tr', {'class': 'tbl_head'});

			//this._display.tableDiv = new Element('div', {'class': 'bg-W b_l-25 b_r-25 of-h', 'style': 'overflow-y:scroll;'});
			//this._display.table = new Element('table', {'class': 'tbl'});
			this._display.tbody = new Element('tbody');

			this._display.thead.adopt(this._display.theadRow);
			this._display.table.adopt(this._display.thead);
			this._display.root.adopt(this._display.table);

			this._display.table.adopt(this._display.tbody);
			//this._display.tableDiv.adopt(this._display.table);
			//this._display.root.adopt(this._display.table);

			this.buildCols(this.options.cols);
			this.setData(this.options.data);

			//window.addEvent('resize', this.adoptSizeToHead.bind(this));
		} catch(e) { gx.util.Console('gx.zeyos.Table->initialize', e.message); }
	},

	/**
	 * @method buildCols
	 * @description Builds the columns
	 * @param {array} cols An array of columns
	 */
	buildCols: function(cols) {
		var root = this;
		try {
			cols.each(function(col) {
				col.th = new Element('th');
				switch (typeOf(col.label)) {
					case 'object' :
						col.th.adopt(__(col.label));
						break;
					case 'element':
						col.th.adopt(col.label);
						break;
					default:
						col.th.set('html', col.label);
						break;
				}

				if (col.filter != null || col.filterable != false) {
					col.th.set('data-sort', '-' + col.id );
					col.indicator = col.th;
					col.th.addEvent('click', function() {
						root.setSort(col);
					});
				}

				if ( col['text-align'] != null )
					col.th.setStyle('text-align', col['text-align']);

				if (col.width != null)
					col.th.setStyle('width', col.width);
				if (col.filter != null)
					root.setSort(col, col.filter, 1);

				root._display.theadRow.adopt(col.th);
				root._cols.push(col);
			});
			this._colspan = cols.length;
			// Add one more col to header which automatically scale with of scroll bar width
			// Set default width 16px in case no data will be add at first
			// Erase when data will be add to get automatically scaled.
			//this._scrollBarCol = new Element('th', {'class': ''});
			root._display.theadRow.adopt(this._scrollBarCol);
		} catch(e) { gx.util.Console('gx.zeyos.Table->buildCols', e.message); }

		return this;
	},

	/**
	 * @method setSort
	 * @description Sorts the table according to the specified column and mode
	 * @param {object} col The column that is decisive for the sorting
	 * @param {string} mode The sorting order: 'asc' or 'desc'
	 * @param noEvent
	 */
	setSort: function(col, mode, noEvent) {
		if ( !this._filter )
			this._filter = {};

		if ( mode == null ) {
			if ( col.th.get('data-sort').indexOf('-') > -1 ) {
				mode = 'asc';
				var prefix = '';
			} else {
				mode = 'desc';
				var prefix = '-';
			}
		}

		if ( mode == 'asc' ) {
			this._filter.mode = 'desc';
			var opPrefix = '-';
		} else {
			this._filter.mode = 'asc';
			var opPrefix = '';
		}

		for ( var i = 0; i < this._cols.length; i++ ) {
			var currentCol = this._cols[i];
			currentCol.th.removeClass('act');
			currentCol.th.set('data-sort', opPrefix + currentCol.id);
		}

		col.th.set('data-sort', prefix + col.id);
		col.th.addClass('act');

		this._filter.indicator = col.th;
		this._filter.id        = col.id;

		if (noEvent == null)
			this.fireEvent('filter', col);

		return this;
	},

	/**
	 * @method getFilter
	 * @description Returns the filter object {mode: 'asc'|'desc', id: COLID}
	 */
	getFilter: function() {
		return this._filter;
	},

	/**
	 * @method setData
	 * @description Sets the list data. Calls empty() and then addData(data)
	 * @param {array} data The list data to set
	 */
	setData: function(data) {
		this.empty();
		this.fireEvent('setData', data)
		return this.addData(data);
	},

	/**
	 * @method addData
	 * @description Adds the specified data to the table
	 * @param {array} data The data to add
	 */
	addData: function(data) {
		var root = this;
		var odd = false;
		try {
			if ( !isArray(data) )
				return this;

			this.fireEvent('addData', data)
			data.each(function(row, index) {
				if ( !isObject(row) )
					return;

				var cols = root.options.structure(row, index);
				var rowProperties = {};

				if ( (typeof(cols) === 'object') && cols.row ) {
					if ( cols.properties )
						Object.merge(rowProperties, cols.properties);
					cols = cols.row;
				}

				if ( !isArray(cols) )
					return;

				root.fireEvent('beforeRowAdd', [row, index] );

				row.tr = new Element('tr', rowProperties)
					.addClass('tbl_row');

				var clickable = (row.clickable == null || row.clickable != false || (root.options.cols[index] != null && root.options.cols[index].clickable != false));

				if (odd)
					row.tr.addClass('bg');
				odd = !odd;

				cols.each(function(col, index) {
					clickable = clickable ? !(root.options.cols[index] != null && root.options.cols[index].clickable == false) : true;
					var td = new Element('td');
					var width = width = root.options.cols[index].width;
					if ( width )
						td.setStyle('width', width);

					switch ( typeOf(col) ) {
						case 'object' :
							col = Object.clone(col);

							var labelType = typeOf(col.label);
							if ( (labelType === 'element') || (labelType === 'textnode') )
								td.adopt(col.label);
							else
								td.set('html', col.label);

							clickable = ( (col.clickable == null) || (col.clickable != false) );
							if ( col.className != null )
								td.addClass(col.className);

							delete col.label;
							delete col.clickable;
							delete col.className;

							td.set(col);

							break;

						case 'element':
						case 'textnode':
							td.adopt(col);
							break;
						default:
							td.set('html', col);
							break;
					}

					if ( root._cols[index]['text-align'] != null )
						td.setStyle('text-align', root._cols[index]['text-align']);

					if (clickable) {
						td.addEvent('click', function(event) {
							root.fireEvent('click', [ row, event, index ] );
						});
						td.addEvent('dblclick', function(event) {
							root.fireEvent('dblclick', [ row, event, index ] );
						});
					}
					row.tr.adopt(td);
				});
				root._display.tbody.adopt(row.tr);
				root.fireEvent('rowAdd', [row, index] );
				root.fireEvent('afterRowAdd', [row, index] );
			});
			//if( data.length > 0 ) this._scrollBarCol.erase('style');
			this.fireEvent('complete', data);
		} catch(e) { gx.util.Console('gx.zeyos.Table->addData', e.message); }

		return this;
	},

	/**
	 * @method empty
	 * @description Clears the table body
	 */
	empty: function() {
		this._display.tbody.empty();
		return this;
	},

	/**
	 * @method adoptSizeToHead
	 * @description Sets the cell widths of the header with the width of the cell in the first row
	 */
	adoptSizeToHead: function () {
		var row = this._display.tbody.getElement('tr');
		if ( row == null )
			return this;

		var once = false;
		row.getElements('td').each( function (ele) {
			var size = ele.getSize();
			this._cols[ele.cellIndex].th.setStyle('width', size.x + 'px');
		}.bind(this));

		return this;
	}
});
