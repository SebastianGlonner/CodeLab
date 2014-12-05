/**
 * @class gx.com.DatePicker
 * @description Date picker that works in an iframe and allows for keyboard navigation.
 * @extends gx.ui.Container
 *
 * !!! Important Notice:
 * You have to include 'slimpicker.js' in your system.
 *
 * @param {string|node} display The input element.
 * @param {json object} options
 *
 * @option {string} inputEleClass The class of the input element.
 * @option {string} Prefix for all css class names in use.
 * @option {string} containerClass This will always start at the top left of the input's location.
 * @option {string} calendarClass Use this to alter the placement of the calendar in the CSS.
 * @option {string} hoverClass If using the keyboard, this gets moved around the calendar by arrow keys.
 * @option {string} selectedClass The date picked up from what was in the input field.
 * @option {string} todayClass Always just on today. The sp_selected usually overrides this.
 * @option {string} emptyClass Placed on the &lsaquo;td&rsaquo; of a date with no day in it.
 * @option {string} dayClass Placed on the &lsaquo;td&rsaquo; with a day in it.
 * @option {string} monthClass On the dropdown for month.
 * @option {string} yearClass On the dropdown for year.
 * @option {string} backArrowClass Placed on the &lsaquo;a&rsaquo; with the back arrow
 * @option {string} nextArrowClass Placed on the &lsaquo;a&rsaquo; with the next arrow
 *
 * @option {integer} fadeDuration How fast the calendar fades in and out.
 * @option {integer} hideDelay How long to wait to close the calendar after the mouse leaves.
 * @option {integer} extendedDelay After a dropdown is open, how long to wait before we give up and hide the calendar.
 * @option {boolean} showMonth Add the dropdown select for month.
 * @option {boolean} showYear Add the dropdown select for year.
 * @option {boolean} autoHide Without this, it won't set a timer to hide the calendar whenever you move away.
 * @option {boolean} forceDocBoundary If the calendar would be shown outside the document, then flip the direction it shows up.
 * @option {boolean} destroyWhenDone After selecting a date, true will remove the calendar completely, and false just hides it.
 *
 * @option {integer} dayChars How many chars you want to se from the day string.
 * @option {json array} monthNames Month names.
 * @option {json array} dayNames Day names.
 * @option {string} format Date input and output format (see Mootools Date.format(), Date.parse()), example('%d.%m.%Y %H:%M:%S').
 * @option {integer} yearStart How many years before todays year will be listed.
 * @option {integer} yearRange Show a 10 year span.
 * @option {string} yearOrder Counting up in years (possible values: 'desc').
 * @option {integer} startDay 1 = week starts on Monday, 7 = week starts on Sunday.
 *
 * @sample DatePicker Simple DatePicker example.
 */
gx.com.DatePicker = new Class({
	initialize: function(display, options) {
		new SlimPicker(display, options);
	}
});
