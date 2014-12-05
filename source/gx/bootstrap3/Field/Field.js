/**
 * @class gx.bootstrap.Field
 * @description Creates a single field for a gx.bootstrap.Field and gx.bootstrap.Form
 * @extends gx.ui.Container
 *
 * @param {element|string} display The display element
 *
 * @option {string} label The title for the fieldset
 * @option {object} type The field type: text, password, file, checkbox, select
 * @option {object} default The default value
 * @option {string} description The field description
 * @option {string} hightlight The default highlight class (error, warning, success)
 * @option {array} horizontal Define this fields horizontal, false | bootstrap grid classes for label and input: ['col-md-2', 'col-md-6']
 * @option {array} hintpos Define the hint possition when using .setHintHiglights
 * @option {bool} highlighteffect Use effect for highlighting
 * @option {string} highlightlocation Location of the highlight text element: 'control' | 'field' | 'label'(not yet supported)
 * @option {string} moohints Which highlight method do you want to use for mootools validation.
 *
 * @event setValue
 */
gx.bootstrap.Field = new Class({

	gx: 'gx.bootstrap.Field',

	Extends: gx.ui.Container,

	options: {
		'label'           : '',
		'type'            : 'text',
		'description'     : '',
		'highlight'       : false,
		'default'         : null,
		'horizontal'      : ['col-md-3', 'col-md-9'],
		'hintpos'         : 'right',
		'hintobject'      : 'auto', // | 'label' | 'control'
		'highlightlocation': 'control', // | 'field'
		'highlighteffect' : true,
		'moohints': 'setHintHighlights',
	},

	_display: {},
	_types: ['error', 'waring', 'success'],

	initialize: function(options) {
		var root = this;
		try {
			this.parent(new Element('div', {'class': 'form-group'}), options);

			this._display.label = new Element('label', {'class': 'control-label', 'for': '', 'html': this.options.label});
			if ( typeOf(this.options.horizontal) == 'array' && this.options.horizontal.length === 2 ) {
				this._display.label.addClass(this.options.horizontal[0]);

			}

			// if form is not horizontal display hint highlight at label
			this._display.hint = this._display.label;

			this._display.highlight = new Element('span', {'class': 'help-block highlight'});
			this._display.description = new Element('span', {'class': 'help-block', 'html': this.options.description});
			this._display.root.adopt(this._display.label);

			this._display.controlwrapper = new Element('div');

			this.setField(this.options.type, options);
			this._display.hint.addClass('hint--fwidth hint--' + this.options.hintpos);
			this._display.controlwrapper.adopt(this._display.description, this._display.highlight);

			if ( this.options.highlightlocation == 'field' ) {
				this._display.root.adopt(
					new Element('div', {'style':'clear:both;'}),
					this._display.highlight
				);
			}

		} catch(e) {
			gx.util.Console('gx.bootstrap.Field->initialize', e.stack); }
	},
	/**
	 * @method addFields
	 * @param {object} fields
	 */
	setLabel: function(label) {
		this._display.label.set('html', label);
	},

	setHelp: function(help) {
		this._display.description.setProperty('html', help);
	},
	/**
	 * @method addFields
	 * @param {string|element|object} field
	 * @param {object}
	 */
	setField: function(field, options) {
		if (this._display.field != null)
			return;

		var elem;

		var self = this;
		switch (typeOf(field)) {
			case 'element':
				this._display.field = field;
				this._type = 'element';
				elem = field;
				break;
			case 'string':
				this._type = field;
				switch (field) {
					case 'empty':
						elem = new Element('input', {
							'type': 'text',
							'style': 'visibility: hidden;'
						});
						break;
					case 'text':
					case 'password':
					case 'file':
					case 'checkbox':
					case 'string':
					case 'number':
					case 'integer':
					case 'float':
						var inputType = field;
						if ( field == 'float' ||
							field == 'string' ||
							field == 'integer' )
							inputType = 'text';

						this._display.field = new Element('input', {'type': inputType});
						if (options['disabled'] != null)
							this._display.field.set('disabled', true);
						if (options['default'] != null)
							this._display.field.set('value', options['default']);
						if (options['checked'])
							this._display.field.checked = options['checked'];

						elem = this._display.field;

						if ( field == 'integer' )
							elem.addEvent('blur', function() {
								if(!/^\d*$/.test(this.get('value'))) {
									self.setHighlight('This field must be an integer!', 'error');

								} else {
									self.setHighlight();
								}
							});

						else if ( field == 'float' )
							elem.addEvent('blur', function() {
								if(!/^(\d+((\.|\,)\d+)?)*$/.test(this.get('value'))) {
									self.setHighlight('This field must be a floating point!', 'error');

								} else {
									self.setHighlight();
								}
							});

						break;
					case 'textarea':
						this._display.field = new Element('textarea');
						if (options['default'] != null)
							this._display.field.setProperty('html', options['default']);

						elem = this._display.field;
						break;
					case 'select':
						this._display.field = new Element('select');
						switch (typeOf(options.options)) {
							case 'array':
								options.options.each(function(opt) {
									var optElem = new Element('option', {'value': opt, 'text': opt});
									if (options['default'] != null && options['default'] == opt)
										optElem.setProperty('selected', 'selected');
									this._display.field.adopt(optElem);
								}.bind(this));
								break;
							case 'object':
								var option;
								for ( var key in options.options) {
									option = new Element('option', {'html': options.options[key], 'value': key});
									if (options['default'] != null && options['default'] == key)
										option.setProperty('selected', 'selected');

									this._display.field.adopt(option);
								}
								break;
						}
						elem = this._display.field;
						break;
					case 'optionlist':
						this._display.field = new Element('div');
						var def = options['default'] == null ? null : options['default'];
						switch (typeOf(options.options)) {
							case 'array':
								options.options.each(function(opt) {
									this._display.field.adopt(__({'children': [
										{'tag': 'input', 'name': options.id, 'type': 'radio', 'id': 'radiobtn', 'value': opt, 'checked': opt == def},
										' ' + opt
									]}));
								}.bind(this));
								break;
							case 'object':
								for (key in options.options) {
									this._display.field.adopt(__({'children': [
										{'tag': 'input', 'name': options.id, 'type': 'radio', 'id': 'radiobtn', 'value': key, 'checked': key == def},
										' ' + options.options[key]
									]}));
								}
								break;
						}
						elem = this._display.field;
						break;
					case 'checklist':
						this._display.field = new gx.bootstrap.Checklist(null, options.options == null ? options : options.options);
						elem = $(this._display.field);
						this._type = 'gx';
						break;
					case 'date':
						options.orientation = 'right';
						delete options.label;
						this._display.field = new gx.bootstrap.DatePicker(null, options.options == null ? options : options.options);
						elem = $(this._display.field);
						this._type = 'gx';
						break;
					case 'month':
						this._display.field = new gx.bootstrap.MonthPicker(null, options.options == null ? options : options.options);
						elem = $(this._display.field);
						this._type = 'gx';
						break;
					case 'time':
						this._display.field = new gx.bootstrap.Timebox(null, options.options == null ? options : options.options);
						elem = $(this._display.field);
						this._type = 'gx';
						break;
					case 'gxselect':
						delete options.label;
						this._display.field = new gx.bootstrap.Select(null, options);
						elem = $(this._display.field);
						this._type = 'gx';
						break;
					case 'multivalueeditor':
						this._display.field = new gx.bootstrap.MultiValueEditor(null, options.options == null ? options : options.options);
						elem = $(this._display.field);
						this._type = 'gx';
						break;
					case 'editor':
						this._display.field = new gx.bootstrap.Editor(null, options.options == null ? options : options.options);
						elem = $(this._display.field);
						this._type = 'gx';
						break;
					case 'html':
						elem = options.content == null ? new Element('div') : options.content;
						break;
				}
				break;
			case 'class':
				if ( options.options != null ) {
					field = new field(null, options.options);
				} else {
					field = new field(null, options);
				}

			case 'object':
				if (instanceOf(field, gx.ui.Container) && typeOf(field.display) == 'function') {
					this._display.field = field;
					this._type = 'gx';
					elem = $(field);
				}

				if ( this.options['default'] != null )
					this.setValue(this.options['default']);
				break;
			default:
				return;
		}

		/*
		elem.getElements('textarea').addClass('form-control');
		elem.getElements('select').addClass('form-control');
		elem.getElements('input').addClass('form-control');
		*/
		var t = elem.get('tag');
		if ( t == 'textarea' || t == 'select' || t == 'input' ) {
			elem.addClass('form-control');

			if ( this.options.placeholder != null )
				elem.set('placeholder', this.options.placeholder);
		}

		if ( options ) {
			if ( options.properties )
				this._display.root.set(options.properties);

			if ( options.disabled != undefined )
				this.setDisabled(options.disabled);
		}

		elem = this._display.controlwrapper.adopt(elem);


		if ( this.options.horizontal.length === 2 ) {
			this._display.label.addClass(this.options.horizontal[0]);

		}


		if ( typeOf(this.options.horizontal) == 'array' ) {
			if (this.options.hintobject != 'label') {
				// Let the hint position object be label
				this._display.hint = this._display.controlwrapper;
			}

			if ( this.options.horizontal.length === 2 ) {
				this._display.controlwrapper.addClass(this.options.horizontal[1]);
			} else {
				this._display.controlwrapper.addClass(this.options.horizontal[0]);
			}
		}

		if (this.options.hintobject == 'control') {
			// Overwrite the hint position object to control
			this._display.hint = this._display.controlwrapper;
		}

		elem.inject(this._display.root);
	},
	/**
	 * @method getValue
	 * @description Get the current field value
	 * @return {string|bool|null}
	 */
	getValue: function() {
		switch (this._type) {
			case 'element':
			case 'text':
			case 'password':
			case 'file':
			case 'select':
			case 'textarea':
			case 'string':
			case 'integer':
			case 'float':
			case 'number':
				return this._display.field.get('value');
			case 'optionlist':
				var selection;
				this._display.field.getElements('input').each(function(opt) {
					if (opt.checked)
						selection = opt.get('value');
				});
				return selection;
			case 'checkbox':
				return this._display.field.get('checked');
			case 'multivalueeditor':
				return this._display.field.getValue();
			case 'object':
			case 'gx':
			case 'editor':
				if (typeOf(this._display.field.getValue) == 'function')
					return this._display.field.getValue();
				if (typeOf(this._display.field.getValues) == 'function')
					return this._display.field.getValues();
				if (typeOf(this._display.field.get) == 'function')
					return this._display.field.get();
			default:
				return null;
		}
	},
	setDisabled: function(enable) {
		switch (this._type) {
			case 'element':
			case 'text':
			case 'password':
			case 'file':
			case 'select':
			case 'textarea':
			case 'checkbox':
			case 'multivalueeditor':
				this._display.field.disabled = enable;
				break;
			case 'optionlist':
				var selection;
				this._display.field.getElements('input').each(function(opt) {
					opt.disabled = enable;
				});
				break;
			case 'object':
			case 'gx':
				if (typeOf(this._display.field.disabled) == 'boolean')
					this._display.field.disabled = enable;
				if (typeOf(this._display.field.setDisabled) == 'function')
					this._display.field.setDisabled(enable);
				break;
		}
		return this;
	},

	updateTypeClass: function(ele, type) {
		for (var i = 0, l = this._types.length; i < l; i++) {
			if (type != this._types[i])
				ele.removeClass('has-' + this._types[i]);

		}

		if ( type ) {
			// Reading style access to force browser update
			ele.offsetWidth;
			ele.addClass('has-' + type);
		}
	},

	/**
	 * @method setHighlight
	 * @description Get the current field value
	 * @param {stirng|bool} label The highlight description. If none set, the highlight will be removed
	 * @param {string} type The highlight class: error, success, warning*
	 * @return {string|bool}
	 */
	reentrantHightlighting: 0,
	setHighlights: function(label, type) {
		this.reentrantHightlighting++;
		var root = this;
		if (label == null || label === false || label == '') {
			if ( this.options.highlighteffect ) {
				var reentrantState = this.reentrantHightlighting;
				(function() {
					if (reentrantState !== this.reentrantHightlighting)
						return;

					root._display.highlight.removeClass('visible');
				}.bind(this)).delay(200);
			} else
				root._display.highlight.removeClass('visible');

		} else {
			this._display.highlight.set('html', label);
			this._display.highlight.addClass('visible');

		}

		this.updateTypeClass(this._ui.root, type);
		return this;
	},

	/**
	 * Set field attributes for mootools Form.Validator validation.
	 * Message can be:
	 * 	- the very message string: 'This is required'
	 * 	- json_encod array string: ["error.not_a_address", {"anyProp": "any simple prop value", "__prop__value": "will result in field.get('value')"}]
	 * @param {string} condition Mootools validator string: 'required minLength:10'
	 * @param {string} message
	 * @param {string} props Mootools 'data-validator-properties' property value.
	 */
	setMooValidatorAttributes: function(condition, message, props, options) {
		var input = this.getInputElement(),
			tag = input.get('tag');

		if (options && options.markRequired)
			this._ui.root.addClass('inputRequired');

		if ( tag === 'input' || tag === 'select' || tag === 'textarea' ) {
			input.set('data-validators', condition);

			if ( message )
				input.set('data-validators-message', message);

			if ( props )
				input.set('data-validator-properties', props);
		}
	},

	/**
	 * Validate this field with Mootools InputValidators.
	 * Returns bool on success or message string on failure.
	 * @return {mixed}
	 */
	doMooValidation: function(preventHinting) {
		var field = this.getInputElement();
		if (field == null)
			return true;

		var validators = field.get('validators'),
			isValid = !validators.map(function(validatorName) {
				var validator = Form.Validator.getValidator(validatorName);
				return validator ? validator.test(field) : true;
			}).some(function(bool) {
				return !bool;
			}),
			message;

		if ( isValid !== true ) {
			message = field.get('data-validators-message');
			if ( message.substr(0, 1) === '[' ) {
				var args = JSON.decode(message),
					props = args[1],
					i = 0;
				// try to resolve the arguments as field properties
				if ( props ) {
					Object.each(props, function(value, key) {
						if ( typeof value !== 'string' || value.substr(0, 8) !== '__prop__' )
							return;

						props[key] = field.get(value.substr(8));
					});
				}
				message = _.call(null, args[0], props);
			}
		}

		if ( preventHinting === true || !message ) {
			// clear hint
			this[this.options.moohints]();
		} else {
			this[this.options.moohints](message, 'error');
		}

		return message ? message : true;
	},

	/**
	 * @method setHintHighlights
	 * @description Highlight with the hint framework
	 * @param {stirng|bool} label The highlight description. If none set, the highlight will be removed
	 * @param {string} type The highlight class: error, success, warning*
	 * @return {string|bool}
	 */
	isHintActive: null,
	setHintHighlights: function(label, type) {
		this._display.root.removeClass('has-error');
		this._display.root.removeClass('has-success');
		this._display.root.removeClass('has-warning');

		var field = this._display.hint;
		field.removeClass('hint--always');
		field.removeClass('hint--error');
		field.removeClass('hint--success');
		field.removeClass('hint--warning');

		var root = this;

		if (label == null || label == '') {
			if ( this.options.highlighteffect )
				(function() {
					if ( !root.isHintActive )
						field.erase('data-hint');
				}).delay(200);
			else
				field.erase('data-hint');

			this.isHintActive = false;
			return;
		}

		this.isHintActive = true;

		field.addClass('hint--' + type);
		this._display.root.addClass('has-' + type);
		field.set('data-hint', label);

		if ( this.options.highlighteffect )
			(function() {
				field.addClass('hint--always');
			}).delay(1);
		else
			field.addClass('hint--always');

		return this;

	},
	/**
	 * @method setValue
	 * @description Sets a single form value
	 * @param {mixed} value
	 */
	setValue: function(value) {
		switch (this._type) {
			case 'text':
			case 'password':
			case 'textarea':
				this._display.field.set('value', value);
				break;
			case 'select':
				var opt, i, opts = this._display.field.options;
				for ( i = 0; i < opts.length; i++ ) {
					if ( value == opts[i].get('value') ) {
						opts[i].selected = true;
						break;
					}
				}
				break;
			case 'checkbox':
				this._display.field.checked = value ? true : false;
				break;
			case 'optionlist':
				this._display.field.getElements('input').each(function(ipt) {
					if (ipt.get('value') == value)
						ipt.set('checked', true);
					else
						ipt.erase('checked');
				});
				break;
			case 'gx':
			case 'editor':
				if (typeOf(this._display.field.setValue) == 'function')
					this._display.field.setValue(value);
				else if (typeOf(this._display.field.setValues) == 'function')
					this._display.field.setValues(value);
				else if (typeOf(this._display.field.set) == 'function')
					this._display.field.set(value);
				break;
			default:
				if (this._display.field != null && this._display.field.get != null) {
					switch(this._display.field.get('tag')) {
						case 'input':
						case 'select':
							this._display.field.set('value', value);
							break;
					}
				}
				break;
		}

		this.fireEvent('setValue', [value]);

		return this;
	},
	/**
	 * @method reset
	 * @description Resets the form value
	 */
	reset: function() {
		if (typeOf(this._display.field.reset) == 'function')
			this._display.field.reset();
		else if (this.options['default'] != null )
			this.setValue(this.options['default']);
		else
			this.setValue();
	},

	getInput: function () {
		return this._display.field;
	},

	getInputElement: function() {
		if ( typeOf(this._display.field) === 'object' && typeof this._display.field.getInput === 'function' ) {
			return this._display.field.getInput();

		} else
			return $(this.getInput());

	}

});
