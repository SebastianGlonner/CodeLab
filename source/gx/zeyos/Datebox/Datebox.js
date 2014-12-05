/**
 * @class gx.zeyos.Datebox
 * @description Creates a box for times, separating hours and minutes
 * @extends gx.ui.Container
 * @implements gx.util.Console
 *
 * @param {element|string} display The display element
 *
 * @option {float} timestamp The initial time of the element
 * @option {string} unit The default input unit (milliseconds, seconds)
 * @option {array} format The format of the date box (d: day, m: month, y: year)
 * @option {array} month The month ("Jan.", ...)
 *
 * @event update
 *
 * @sample Datebox Simple datebox example.
 */
gx.zeyos.Datebox = new Class({
	gx: 'gx.zeyos.Datebox',
	Extends: gx.ui.Container,
	options: {
		'timestamp': 0,
		'unit': 'milliseconds',
		'format': ['d', '.', 'M', '.', 'y', '&nbsp;', 'h', ':', 'i'],
		'month': ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Jun.', 'Jul.', 'Aug.', 'Sept.', 'Okt.', 'Nov.', 'Dez.']
	},
	_fields: {},
	initialize: function(display, options) {
		var root = this;
		try {
			this.parent(display, options);
			this.build();
		} catch(e) { gx.util.Console('gx.zeyos.Datebox->initialize', e.message); }
	},

	/**
	 * @method buildField
	 * @description Creates a field according to the date format
	 * @param {string} field The part of the date format string (e.g. 'd' for 'day')
	 */
	buildField: function(field) {
		var root = this;
		try {
			var elem, width, name = false;
			switch (field) {
				case 'd':
					name = name || 'day';
					width = width || 25;
				case 'm':
					name = name || 'month';
					width = width || 25;
				case 'y':
					name = name || 'year';
					width = width || 45;
				case 'h':
					name = name || 'hour';
					width = width || 25;
				case 'i':
					name = name || 'minute';
					width = width || 25;
				case 's':
					name = name || 'second';
					width = width || 25;
					elem = new Element('input', {'type': 'text', 'styles': {'width': width + 'px', 'text-align': 'center'}});
					break;
				case 'M':
					name = 'month';
					elem = new Element('select');
					this.options.month.each(function(month, index) {
						elem.adopt(new Element('option', {'value': root.addZero(index+1), 'html': month}));
					});
					break;
				default:
					return field;
			}

			this._fields[name] = elem;
			return elem;
		} catch(e) {
			gx.util.Console('gx.zeyos.Datebox->buildField', e.message);
			throw e;
		}
	},

	/**
	 * @method build
	 * @description Adds the built fields
	 */
	build: function() {
		var root = this;
		try {
			var format = this.options.format;
			var first = true;
			format.each(function(field) {
				var elem = this.buildField(field)
				if (typeOf(elem) == 'element') {
					this._display.root.adopt(elem);
					
					elem.addEvent(elem.get('tag') == 'select' ? 'change' : 'blur', function() {
						root.update();
					});
				} else {
					this._display.root.adopt(new Element('span', {'html': elem, 'styles': {'padding': '0 2px'}}));
				}
			}, this);
		} catch(e) { gx.util.Console('gx.zeyos.Datebox->build', e.message); }
	},

	/**
	 * @method update
	 * @description Updates the time and fires event 'update'
	 */
	update: function() {
		var t = this.get();
		this.set(t);
		this.fireEvent('update', t);
	},

	/**
	 * @method addZero
	 * @description Adds a zero in front of the number if it is smaller than 10
	 * @param {int} num The number in question
	 */
	addZero: function(num) {
		return (num < 10) ? '0' + num : num;
	},

	/**
	 * @method parseField
	 * @description Parses the given value by preventing NaN (returns 0 if NaN, value otherwise)
	 * @param {int} value The value to parse
	 */
	parseField: function(value) {
		value = parseInt(value, 10);
		return isNaN(value) ? 0 : value;
	},

	/**
	 * @method set
	 * @description Sets the timestamp according to the given unit
	 * @param {int} timestamp The timestamp
	 * @param {string} unit The unit
	 */
	set: function(timestamp, unit) {
		try {
			timestamp = parseInt(timestamp, 10);
			if (unit == null)
				unit = this.options.unit;
			if (unit == 'seconds')
				timestamp = timestamp * 1000;

			var d = new Date(timestamp);

			if (this._fields.day)
				this._fields.day.set('value', this.addZero(d.getDate()));
			if (this._fields.month)
				this._fields.month.set('value', this.addZero(d.getMonth()+1));
			if (this._fields.year)
				this._fields.year.set('value', this.addZero(d.getFullYear()));
			if (this._fields.hour)
				this._fields.hour.set('value', this.addZero(d.getHours()));
			if (this._fields.minute)
				this._fields.minute.set('value', this.addZero(d.getMinutes()));
			if (this._fields.second)
				this._fields.second.set('value', this.addZero(d.getSeconds()));
		} catch(e) { gx.util.Console('gx.zeyos.Datebox->set', e.message); }
	},

	/**
	 * @method get
	 * @description Gets the time according to the given unit
	 * @param {string} unit The unit
	 */
	get: function(unit) {
		try {
			if (unit == null)
				unit = this.options.unit;

			var d = new Date(
				this._fields.year ? this.parseField(this._fields.year.get('value')) : 1970,
				this._fields.month ? this.parseField(this._fields.month.get('value'))-1 : 0,
				this._fields.day ? this.parseField(this._fields.day.get('value')) : 1,
				this._fields.hour ? this.parseField(this._fields.hour.get('value')) : 0,
				this._fields.minute ? this.parseField(this._fields.minute.get('value')) : 0,
				this._fields.second ? this.parseField(this._fields.second.get('value')) : 0
			);

			if (unit == 'seconds')
				return d.getTime() / 1000;

			return d.getTime();
		} catch(e) {
			gx.util.Console('gx.zeyos.Datebox->get', e.message);
			throw e;
		}
	},

	/**
	 * @method enable
	 * @description Enables the date field
	 */
	enable: function() {
		if (this._fields.day)
			this._fields.day.erase('disabled');
		if (this._fields.month)
			this._fields.month.erase('disabled');
		if (this._fields.year)
			this._fields.year.erase('disabled');
	},

	/**
	 * @method disable
	 * @description Disables the date field
	 */
	disable: function() {
		if (this._fields.day)
			this._fields.day.set('disabled', true);
		if (this._fields.month)
			this._fields.month.set('disabled', true);
		if (this._fields.year)
			this._fields.year.set('disabled', true);
	}
});
