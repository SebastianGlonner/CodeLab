/**
 * @class gx.bootstrap.DatePicker
 * @description Creates a datepicker to select a single month
 * @extends gx.ui.Container
 * @implements DatePicker
 *
 * @param {element|string} display The display element
 *
 * @option {date} date The start date
 *
 * @event select When the month is changed
 */
gx.bootstrap.DatePicker = new Class({

	gx: 'gx.bootstrap.DatePicker',

	Extends: gx.ui.Container,

	options: {
		'date'          : false,
		'format'        : '%a %d.%m.%Y %H:%M',
		'return_format' : '%s',
		'width'         : '130px',
		'positionOffset': {x: 0, y: 0},
		'icon'          : 'calendar',

		/**
		 * A string to use as the component's label or an object to pass to "Element.set()".
		 */
		'label'          : '',

		'orientation'   : 'left',
		'timePicker'    : true,
		'picker'        : {},
		'readOnly'      : false
	},

	_date: false,

	_picker: undefined,

	/**
	 * Holds functions bound to this instance's scope.
	 */
	bound: {},

	initialize: function (display, options) {
		try {
			this.parent(display, options);

			this._display.root.addClass(this.options.orientation == 'left' ? 'input-prepend' : 'input-append');
			this._display.input = new Element('input', {
				'type'  : 'text',
				'class' : 'span2',
				'styles': {'width': this.options.width}
			});

			var iconMarkup = ( this.options.icon ? '<i class="icon-'+this.options.icon+'"></i>' : '' );

			this._display.symbol = new Element('span');

			if ( this.options.label && (typeof(this.options.label) === 'object') ) {
				var labelOptions = Object.clone(this.options.label);
				var labelText    = ( labelOptions.html == null ? String(labelOptions.text).htmlSpecialChars() : labelOptions.html );
				labelOptions.html = iconMarkup+( labelOptions.text ? ' '+labelOptions.text : '' );
				delete labelOptions.text;
				this._display.symbol.set(labelOptions);
			} else {
				this._display.symbol.set('html', iconMarkup+( this.options.label ? ' '+this.options.label : '' ))
			}

			this._display.symbol.addClass('add-on');

			if ( this.options.orientation == 'left' )
				this._display.root.adopt([this._display.symbol, this._display.input]);
			else
				this._display.root.adopt([this._display.input, this._display.symbol]);

			this.bound.dateSelect = this.dateSelectHandler.bind(this);

			if ( typeOf(this.options.date) != 'date' )
				this.options.date = new Date();

			this.createPicker();
			this.set(this.options.date);

		} catch(e) {
			gx.util.Console('gx.bootstrap.DatePicker->initialize', gx.util.parseError(e) );
		}
	},

	createPicker: function () {
		var oldPicker = this._picker;

		this._picker = new Picker.Date(this._display.input, Object.merge({
			'positionOffset': this.options.positionOffset,
			'pickerClass'   : 'datepicker_jqui',
			'format'        : this.options.format,
			'scanAlwaysGoUp': false,
			'draggable'     : false,
			'timePicker'    : this.options.timePicker,
			'toggle'        : this._display.btnSelect
		}, this.options.picker))
			.addEvent('select', this.bound.dateSelect);

		if ( this.options.readOnly ) {
			this._display.input.setProperty('readonly', 'readonly');
			this._picker.detach();
		} else {
			this._display.input.erase('readonly');
		}

		if ( oldPicker )
			oldPicker.destroy();

		return this;
	},

	dateSelectHandler: function (date) {
		this._date = date;
		this.fireEvent('select', date);
	},

	/**
	 * @returns Returns this instance (for method chaining).
	 * @type gx.bootstrap.DatePicker
	 */
	setReadOnly: function (readOnly) {
		this.options.readOnly = !!readOnly;
		this.createPicker();
		return this;
	},

	/**
	 * @returns Returns this instance (for method chaining).
	 * @type gx.bootstrap.DatePicker
	 */
	setFormat: function (format, enableTimePicker) {
		this.options.format     = format;
		this.options.timePicker = enableTimePicker;

		this.createPicker();

		if ( typeOf(this._date) === 'date' )
			this.set(this._date);

		return this;
	},

	/**
	 * @method set
	 * @description Sets the date
	 * @param {date} date
	 * @returns Returns this instance (for method chaining).
	 * @type gx.bootstrap.DatePicker
	 */
	set: function (date) {
		if ( date != null )
			this._picker.select(typeOf(date) == 'date' ? date : Date.parse(date));
		return this;
	},

	/**
	 * @method get
	 * @description Gets the current date object
	 * @return {date}
	 */
	get: function (format) {
		if ( format != null )
			return this._date.format(format);
		else if ( this.options.return_format != null )
			return this._date.format(this.options.return_format);
		else
			return this._date;
	},

	/**
	 * @method getSeconds
	 * @description Gets the current UNIX timestamp
	 * @return {int}
	 */
	getSeconds: function () {
		return this._date.getTime() / 1000;
	}

});
