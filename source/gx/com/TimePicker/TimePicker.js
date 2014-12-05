/**
 * @class gx.com.TimePicker
 * @description Pick time with select boxes.
 * @extends gx.ui.Container
 *
 * @param {string|node} display The input element.
 * @param {json object} options
 *
 * @option {integer} minutesIncrement Set increment of minutes.
 * @option {boolean} hide Hide select boxes or not.
 * @option {string} cssClassPrefix Prefix for all used css class names.
 * @option {string} place Wher you want to place the select boxes (bottom, right, left, top, replace). Replace just might be usefull while you set "hide = false".
 * @option {integer} hideDelay Miliseconds to wait until hide select boxes after mouse leave.
 * @option {integer} hoursType Show 12 hours or 24 hours type.
 * @option {string} format Mootools Date.parse() parser format. This should fit with hoursType! Examples: 12 -> '%I:%M:%p' | 24 -> '%H:%M'
 *
 * @sample TimePicker Simple TimePicker example.
 */
gx.com.TimePicker = new Class({

	Extends: gx.ui.Container,

	options: {
		minutesIncrement: 5,
		hide: true,
		cssClassPrefix: 'gxComTimePicker',
		place: 'bottom',
		hideDelay: 3500,
		hoursType: 24,
		format: '%H:%M'
	},

	timer: null,
	hours: false,
	minutes: false,
	ampm: false,

	initialize: function(display, options) {
		this.parent(display, options);
		Date.defineParser(this.options.format);

		var box = new Element('div', {'style': 'position: absolute;', 'class': this.options.cssClassPrefix + 'Box'});
		this._display.box = box;

		var hide = this.options.hide;
		if ( hide )
			this._display.box.setStyle('opacity', 0)

		this.getInputValue();

		var hours = this.createHoursSelect();
		var minutes = this.createMinutesSelect();
		var ampm = this.createAmPmSelect();

		this._display.hours = hours;
		this._display.minutes = minutes;
		this._display.ampm = ampm

		this.setSelectValues();

		this._display.ok = new Element('div', {'class': this.options.cssClassPrefix + 'Ok'});
		this._display.cancel = new Element('div', {'class': this.options.cssClassPrefix + 'Cancel'});

		box.adopt(hours);
		box.adopt(this._display.minutes);
		if ( this.options.hoursType == 12 ) {
			box.adopt(this._display.ampm);
		}
		if ( hide ) {
			box.adopt(this._display.ok);
			box.adopt(this._display.cancel);
		}
		document.body.adopt(box);

		var input = this._ui.root;
		input.addEvent('focus', this.show.bind(this));
		input.addEvent('click', this.show.bind(this));
		input.addEvent('keydown', this.setSelectValues.bind(this));

		this._display.ok.addEvent('click', this.accept.bind(this));
		this._display.cancel.addEvent('click', this.close.bind(this));

		box.addEvent('mouseleave', this.addTimer.bind(this));
		box.addEvent('mouseenter', this.removeTimer.bind(this));

		if ( !hide ) {
			hours.addEvent('change', this.setInputValue.bind(this));
			minutes.addEvent('change', this.setInputValue.bind(this));
			ampm.addEvent('change', this.setInputValue.bind(this));
		}
		this.position();
	},

	/**
	 * @method show
	 * @description Show select boxes.
	 */
	show: function() {
		this.getInputValue();
		this.setSelectValues();
		if ( this.options.hide )
			this._display.box.fade(1);
	},
	/**
	 * @method close
	 * @description Hide select boxes
	 */
	close: function() {
		this.removeTimer();
		if ( this.options.hide )
			this._display.box.fade(0);
	},

	accept: function () {
		this.setInputValue();
		this.close();
	},

	getInputValue: function () {
		if ( this._ui.root.value != '' )
			var date = new Date.parse(this._ui.root.value);
		else
			var date = new Date();

		this.hours = parseInt(date.getHours());
		this.minutes = parseInt(date.getMinutes());
		if ( this.options.hoursType == 12 )
			this.ampm = date.get('AMPM');
	},

	setInputValue: function () {
		var date = new Date();
		if ( this._display.ampm.value == 'PM' )
			date.setHours(parseInt(this._display.hours.value) + 12);
		else
			date.setHours(this._display.hours.value);
		date.setMinutes(this._display.minutes.value);
		this._ui.root.value = date.format(this.options.format);
	},

	setSelectValues: function () {
		var adjust = 1;
		if ( this.options.hoursType == 12 && this.hours > 12)
			adjust += 12;

		this._display.hours.options[this.hours - adjust].selected = true;

		var inc = this.options.minutesIncrement;
		var rest = this.minutes % inc;
		var index = parseInt(this.minutes / inc);
		if ( rest >= (inc/2) )
			index++;

		this._display.minutes.options[index].selected = true;

		if ( this.options.hoursType == 12 ) {
			if ( this.ampm == 'PM' )
				this._display.ampm.options[1].selected = true;
			else
				this._display.ampm.options[0].selected = true;
		}
	},

	createHoursSelect: function () {
		var select = new Element('select', {'class': this.options.cssClassPrefix + 'Hours'});
		for( var i = 1; i <= this.options.hoursType; i++ ) {
			var option = new Element('option', {value: i, html: (i < 10 ? '0'+i : i)});
			select.adopt(option);
		}
		return (select);
	},

	createMinutesSelect: function () {
		var inc = this.options.minutesIncrement;
		var select = new Element('select', {'class': this.options.cssClassPrefix + 'Minutes'});
		for( var i = 0; i <= 59; i += inc ) {
			var option = new Element('option', {value: i, html: i});
			select.adopt(option);
		}
		return (select);
	},

	createAmPmSelect: function () {
		var select = new Element('select', {'class': this.options.cssClassPrefix + 'Ampm'});
		select.adopt(new Element('option', {value: 'AM', html: 'AM'}));
		select.adopt(new Element('option', {value: 'PM', html: 'PM'}));
		return (select);
	},

	position: function () {
		var coord = this._ui.root.getCoordinates(); // Mootools getCoordinates();
		switch ( this.options.place ) {
			case 'bottom':
				coord.top = coord.height + coord.top;
				break;
			case 'top':
				coord.top = coord.top - this._display.hours.getStyle('height').toInt();
				break;
			case 'left':
				coord.left = coord.left - this._display.box.getStyle('width').toInt();
				break;
			case 'right':
				coord.left = coord.left + coord.width;
				break;
			case 'replace':
				this._ui.root.visiblity();
				break;
		}

		delete coord.width;
		this._display.box.setStyles(coord);
	},

	addTimer: function() {
		this.timer = this.close.bind(this).delay(this.options.hideDelay);
	},

	removeTimer: function() {
		clearTimeout(this.timer);
	}

});
