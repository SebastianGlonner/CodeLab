/**
 * @class gx.bootstrap.MonthPicker
 * @description Creates a control to select a single month
 * @extends gx.ui.Container
 *
 * @param {element|string} display The display element
 *
 * @option {date} date The start date
 *
 * @event select When the month is changed
 */
gx.bootstrap.MonthPicker = new Class({
	gx: 'gx.bootstrap.MonthPicker',
	Extends: gx.ui.Container,
	options: {
		'date': false,
		'width': '100px',
		'positionOffset': {x: -32, y: 0}
	},
	_date: false,
	initialize: function(display, options) {
		var root = this;
		try {
			this.parent(display, options);

			this._display.btnPrev = new Element('a', {'class': 'btn', 'html': '«'});
			this._display.btnSelect = new Element('a', {'class': 'btn a_c', 'styles': {'width': this.options.width}});
			this._display.btnNext = new Element('a', {'class': 'btn', 'html': '»'});
			this._display.frame = __({
				'classes': 'btn-group',
				'children': [
					this._display.btnPrev,
					this._display.btnSelect,
					this._display.btnNext
				]
			});
			this._display.root.adopt(this._display.frame);

			this._picker = new Picker.Date(null, {
				pickOnly: 'months',
				positionOffset: this.options.positionOffset,
				pickerClass: 'datepicker_jqui',
				format: '%B %Y',
				canAlwaysGoUp: false,
				toggle: this._display.btnSelect,
				draggable: false
			});

			this._picker.addEvent('select', function(date) {
				root._display.btnSelect.set('html', date.format('%B %Y'))
				root._date = date;
				root.fireEvent('select', date);
			})

			if (typeOf(this.options.date) != 'date')
				this.options.date = new Date();

			this.set(this.options.date);

			this._display.btnNext.addEvent('click', function() {
				var m = root.getMonth();
				var y = root.getYear();
				if (m == 12) {
					m = 1;
					y++;
				} else
					m++;

				root.setMonth(m, y);
			});
			this._display.btnPrev.addEvent('click', function() {
				var m = root.getMonth();
				var y = root.getYear();
				if (m == 1) {
					m = 12;
					y--;
				} else
					m--;

				root.setMonth(m, y);
			});

		} catch(e) {
			gx.util.Console('gx.bootstrap.MonthPicker->initialize', gx.util.parseError(e) );
		}
	},

	/**
	 * @method set
	 * @description Sets the date
	 * @param {date} date
	 */
	set: function(date) {
		try {
			this._picker.select(date);
		} catch(e) { gx.util.Console('gx.bootstrap.MonthPicker->set', gx.util.parseError(e)); }
	},

	/**
	 * @method setMonth
	 * @description Sets the date by month and year
	 * @param {int} month Note that month start with 1 (not like the usual javascript date object)
	 * @param {int} year
	 */
	setMonth: function(month, year) {
		try {
			this._picker.select(new Date(year, month-1, 1));
		} catch(e) { gx.util.Console('gx.bootstrap.MonthPicker->set', gx.util.parseError(e)); }
	},

	/**
	 * @method get
	 * @description Gets the current date object
	 * @return {date}
	 */
	get: function() {
		return this._date;
	},

	/**
	 * @method getStart
	 * @description Returns the timestamp of the start date
	 * @param {string} unit Timestamp unit (seconds*, milliseconds)
	 * @return {int}
	 */
	getStart: function(unit) {
		var start = new Date(this._date.getFullYear(), this._date.getMonth(), 1).getTime();

		if (unit == null || unit != 'milliseconds')
			start = start / 1000;

		return start;
	},

	/**
	 * @method getEnd
	 * @description Returns the timestamp of the end date
	 * @param {string} unit Timestamp unit (seconds*, milliseconds)
	 * @return {int}
	 */
	getEnd: function(unit) {
		var end = new Date(this._date.getFullYear(), this._date.getMonth(), 1).increment('month', 1).getTime();

		if (unit == null || unit != 'milliseconds')
			end = end / 1000;

		end--;

		return end;
	},

	/**
	 * @method getMonth
	 * @description Gets the current month; Note that month start with 1 (not like the usual javascript date object)
	 * @return {int}
	 */
	getMonth: function() {
		return (this._date.getMonth() + 1);
	},

	/**
	 * @method getYear
	 * @description Gets the current year
	 * @return {int}
	 */
	getYear: function() {
		return this._date.getFullYear();
	}
});
