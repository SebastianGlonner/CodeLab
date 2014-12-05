
/**
 * @class gx.bootstrap.Grid
 * @description Helper class to create easy bootstrap grids (container-fluid).
 * @extends gx.core.Settings
 *
 */
gx.bootstrap.Grid = new Class({
	Extends: gx.core.Settings,

	AT_ROOT: 1,
	AT_ROW: 2,
	AT_CELL: 3,

	options: {
		classes: ['col-md-'],
		rowLength: 12,
		automatedRows: true,
	},

	/*
	isAt: null,
	rowLength: null,
	current: null,
	*/

	initialize: function(display, options) {
		this.parent(options);

		if ( !display )
			display = new Element('div');

		display.addClass('container-fluid');
		this.root = display;

		this.isAt = this.AT_ROOT;
		this.current = this.root;
		this.rowLength = this.options.rowLength;
	},

	row: function() {
		var parent = this.current;

		if ( this.isAt === this.AT_CELL )
			parent = this.root;
		else if ( this.isAt === this.AT_ROW )
			parent = parent.getParent();

		this.current = new Element('div.row');
		this.isAt = this.AT_ROW;
		this.rowLength = 0;

		parent.adopt(this.current);
		return this.current;
	},

	cell: function(size) {
		size = size || this.options.rowLength;

		if ( this.options.automatedRows && this.rowLength >= this.options.rowLength ) {
			this.row();
		}

		var parent = this.current;
		if ( this.isAt === this.AT_CELL )
			parent = parent.getParent();
		else if ( this.isAt === this.AT_ROOT )
			parent = this.row();

		var cell = new Element('div');
		this.applyClasses(size, cell);

		this.isAt = this.AT_CELL;
		this.rowLength += size;
		this.current = cell;

		parent.adopt(this.current);
		return this.current;
	},

	toElement: function() {
		return this.root;
	},

	applyClasses: function(size, element) {
		var i = 0; classes = this.options.classes, l = classes.length;
		for ( ; i < l; i++ ) {
			element.addClass(classes[i] + size);
		}
	}
});
