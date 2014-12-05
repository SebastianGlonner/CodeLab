/**
 * @class gx.zeyos.MonthPicker
 * @description Creates a datepicker to select a single month
 * @extends gx.zeyos.DatePicker
 * @implements DatePicker
 *
 * @param {element|string} display The display element
 *
 * @option {date} date The start date
 *
 * @event select When the month is changed
 */
gx.zeyos.MonthPicker = new Class({

	gx: 'gx.zeyos.MonthPicker',

	Extends: gx.zeyos.DatePicker,

	options: {
		format: '%B'
	},
	
	initialize: function (display, options) {
		try {
			if ( options == null )
				options = {};
				
			if ( options.picker == null )
				options.picker = {};
				
			options.picker.pickOnly = 'months';
			this.parent(display, options);

		} catch(e) {
			gx.util.Console('gx.zeyos.MonthPicker->initialize', gx.util.parseError(e) );
		}
	}

});
