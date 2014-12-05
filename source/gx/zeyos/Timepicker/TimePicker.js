/**
 * @class gx.zeyos.TimePicker
 * @description Creates a datepicker to select time
 * @extends gx.zeyos.DatePicker
 * @implements DatePicker
 *
 * @param {element|string} display The display element
 *
 * @option {date} date The start date
 *
 * @event select When the month is changed
 */
gx.zeyos.TimePicker = new Class({

	gx: 'gx.zeyos.TimePicker',

	Extends: gx.zeyos.DatePicker,

	options: {
		format: '%H:%M'
	},
	
	initialize: function (display, options) {
		try {
			if ( options == null )
				options = {};
				
			if ( options.picker == null )
				options.picker = {};
				
			options.picker.pickOnly = 'time';
			this.parent(display, options);

		} catch(e) {
			gx.util.Console('gx.zeyos.TimePicker->initialize', gx.util.parseError(e) );
		}
	}

});
