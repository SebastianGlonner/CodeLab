/**
 * @class gx.zfx.Slider
 * @description Creates a slider
 * @extends gx.zfx.DefaultField
 * @implements gx.ui.HGroup
 *
 * @author Peter-Christoph Haider <peter.haider@zeyon.net>
 * @version 1.00
 * @package com
 * @copyright Copyright (c) 2011-2013, Zeyon (www.zeyon.net)
 *
 * @option {string} unit
 * @option {object} content
 * @option {int} min The minimum value
 * @option {int} max The maximum value
 * @option {int} stepsize The size of a single step
 * @option {int} factor
 * @option {int} precision The precision of measurement
 * @option {int} value
 * @option {mixed} input true: create text input, false: no input, function: create your own input (function(self) { return new Element(input) });
 * @option {boolean} wheel User can change slider value with mouse wheel;
 * @option {boolean|integer} overflowMax User can enter bigger values than max in the input field, Integer: max input value, true: Any value;
 * @option {string} dangerColor Color for highlighting wrong input.
 *
 * @event resize
 * @event blur
 * @event keypress
 *
 * @sample Slider
 */
gx.com.Slider = new Class({
	Extends: gx.ui.Container,

	options: {
		'input'         : true, // function(self) { return new Element(input) };
		'inputWidth'    : 50,
		'width'         : 300,
		'unit'          : '',
		'content'       : false,
		'min'           : 0,
		'max'           : 200,
		'stepsize'      : 1,
		'factor'        : 1,
		'precision'     : 2,
		'value'         : false,

		'compare'       : null,

		'onChange'      : null,

		'wheel'         : true,
		'overflowMax'   : false,
		'dangerColor'   : 'a83122'
	},

	minPin: null,
	pins: {},
	inputColor: null,
	initialize: function(display, options) {
		var root = this;

		this.parent(display, options);

		if ( options.value == null )
			this.options.value = this.options.min;

		this._ui.text = new Element('input', {
			'type'      : 'text',
			'value'     : this.options.value,
			'tween'     : {
				'duration': 'long',
				'link'    : 'cancel'
			},
		});

		this._ui.text._jsSliderImplementation = this;

		if ( !this.options.compare )
			this.options.compare = this.compare.bind(this);

		this._ui.frame = new Element('div', { 'class': 'slider' });
		this._ui.bar   = new Element('div', { 'class': 'bar' });
		this._ui.knob  = new Element('div', { 'class': 'knob' });
		this._ui.frame.adopt(this._ui.bar, this._ui.knob);

		this._ui.frame.setStyle('width', this.options.width);

		this._ui.root.adopt(
			this._ui.frame
		);

		if ( this.options.input === true ) {
			this._ui.root.adopt(
				this._ui.text
			);
		} else if ( typeOf(this.options.input) == 'function' ) {
			this.options.input(this, this._ui.text);
		}

		this._ui.text.addEvent('keyup', function(event) {
			if (event.key == 'enter')
				event.target.blur();

			if (event.key == ',')
				return '.';
			if (event.key.match(/[0-9\.]/))
				return event.key;

			return undefined;
		});
		this._ui.text.addEvent('blur', function() {
			var value = parseFloat(root._ui.text.get('value'), root.options.precision);
			value = value / root.options.stepsize;
			value = value.round();
			root.setValue(value * root.options.stepsize);
		});

	},

	/**
	 * Compares two values and checks if they can be considered equivalent.
	 *
	 * Values are assumed to be equal to the default setting if it differs by
	 * less than a quarter of the step size to account for rounding errors.
	 *
	 * @param {Number} a
	 * @param {Number} b
	 * @returns Returns true if the two values are similar enough to be
	 *     considered equivalent, otherwise false.
	 * @type Boolean
	 */
	compare: function (a, b) {
		return ( Math.abs(a - b) < 0.25 * this.options.stepsize );
	},

	/**
	 * @method initSlider
	 * @description Initializes the slider. You want to recall this after displaying slider inside popup (if slider was invisible on instanciation).
	 */
	initSlider: function() {
		if ( this._slider != null ) {
			this._slider.setSliderDimensions();
			return this;
		}

		var root = this;

		this._slider = new Slider(this._ui.frame, this._ui.knob, {
			'range'      : [ this.options.min * this.options.factor, this.options.max * this.options.factor ],
			'steps'      : (this.options.max - this.options.min) / this.options.stepsize,
			'initialStep': this.options.value * this.options.factor,
			'wheel'      : this.options.wheel,
			'snap'       : true,
			'mode'       : 'horizontal'
		});

		this._slider.addEvent('change', function(step) {
			var value = (step / root.options.factor);
			value = root.evaluateValue(value)[0];

			root._ui.text.set('value', value);
			root._slider.set(value, true);
			root.fireEvent('change', [ root ]);
			root._ui.bar.setStyle('width', root._ui.knob.getStyle('left').toInt() + 6);
		});

		this._slider.addEvent('tick', function(step) {
			root._ui.bar.setStyle('width', root._ui.knob.getStyle('left').toInt() + 6);
		});

		window.addEvent('resize', function() {
			root._slider.autosize();
		});

		if ( this.options.value )
			this.setValue(this.options.value);

		return this;
	},

	setPin: function(identifier, value, options) {
		var pin = null, options = options || {};
		if ( this.pins[identifier] == null ) {
			pin = new Element('div', {
				'class': 'pin'
			});

			pin.inject(this._ui.frame, 'top');
			this.pins[identifier] = pin;
		} else
			pin = this.pins[identifier];

		var content = options.content;
		if (!content)
			content = new Element('span', {'html' : value});

		pin.empty().adopt(content);

		var pos = this._slider.toPosition(value);
		pin.setStyle('left', pos + 6);

		if (options.isMinRestriction)
			this.minPin = value;

		return pin;
	},

	removePin: function(identifier) {
		if ( this.pins[identifier] ) {
			this.pins[identifier].destroy();
			delete this.pins[identifier];
		}
	},

	getPin: function(identifier) {
		if ( this.pins[identifier] )
			return this.pins[identifier];
	},

	setRange: function(min, max) {
		if ( min == null )
			min = this.options.min;

		if ( max == null )
			max = this.options.max;

		this.setOptions({
			min: min,
			max: max
		});

		this._slider.setOptions({'steps': (max - min) / this.options.stepsize});
		this._slider.setRange([ min * this.options.factor, max * this.options.factor ]);
	},

	evaluateValue: function(value) {
		value = parseFloat(value, this.options.precision);

		var highlight = false;
		var min = Math.max(this.options.min, this.minPin);

		if ( isNaN(value) ) {
			value = this.options.value || this.options.min;
			highlight = true;

		} else if (value < min) {
			value = min;
			highlight = true;

		} else if ( value > this.options.max) {
			if ( this.options.overflowMax == false ) {
				value = this.options.max;
				highlight = true;
			}

			else if ( typeOf(this.options.overflowMax) == 'number' && value > this.options.overflowMax ) {
				value = this.options.overflowMax;
				highlight = true;
			}
		}

		return [value, highlight];
	},

	/**
	 * @method setValue
	 * @description Sets the value of the slider
	 * @param {int} value The value to set
	 */
	setValue: function(value) {
		var res = this.evaluateValue(value);
		value = res[0];
		var highlight = res[1];

		this._slider.set(value * this.options.factor);
		this._ui.text.set('value', value);

		if ( highlight ) {
			if ( this.inputColor == null )
				this.inputColor = this._ui.text.getStyle('color');

			this._ui.text.tween('color', ['#'+this.options.dangerColor, this.inputColor]);
		}

		return value;
	},

	/**
	 * @method getValue
	 * @description Returns the value
	 */
	getValue: function() {
		return this._ui.text.get('value');
	}

});
