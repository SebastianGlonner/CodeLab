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
 */
gx.bootstrap.Field = new Class({

	gx: 'gx.bootstrap.Field',

	Extends: gx.ui.Container,

	options: {
		'label'      : '',
		'type'       : 'text',
		'description': '',
		'highlight'  : false,
		'default'    : false
	},

	_display: {},

	initialize: function(options) {
		var root = this;
		try {
			this.parent(new Element('div', {'class': 'control-group'}), options);
			this._display.controls = new Element('div', {'class': 'controls'});
			this._display.label = new Element('label', {'class': 'control-label', 'for': '', 'html': this.options.label});
			this._display.description = new Element('span', {'class': 'help-inline', 'html': this.options.description});
			this._display.root.adopt([this._display.label, this._display.controls.adopt(this._display.description)]);
			this.setField(options.type, options);
		} catch(e) { gx.util.Console('gx.bootstrap.Field->initialize', e.message); }
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
				this._display.controls.adopt(field);
				this._type = 'element';
				elem = field;
				break;
			case 'string':
				this._type = field;
				switch (field) {
					case 'text':
					case 'password':
					case 'file':
					case 'checkbox':
					case 'string':
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
								for (key in options.options) {
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
						this._display.field = new gx.bootstrap.Select(null, options.options == null ? options : options.options);
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
			case 'object':
				if (instanceOf(field, gx.ui.Container) && typeOf(field.display) == 'function') {
					this._display.field = field;
					this._type = 'gx';
					elem = $(field);
					break;
				}
			default:
				return;
		}

		if ( options ) {
			if ( options.properties )
				elem.set(options.properties);

			if ( options.disabled != undefined )
				this.setDisabled(options.disabled);
		}

		elem.inject(this._display.controls, 'top');
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
	/**
	 * @method setHighlight
	 * @description Get the current field value
	 * @param {stirng|bool} label The highlight description. If none set, the highlight will be removed
	 * @param {string} type The highlight class: error, success, warning*
	 * @return {string|bool}
	 */
	setHighlight: function(label, type) {
		this._display.root.removeClass('error');
		this._display.root.removeClass('success');
		this._display.root.removeClass('warning');

		if (label == null || label === false) {
			this._display.description.erase('html');

			if (this.options.description != null && this.options.description)
				label = this.options.description;

			if (this.options.highlight != null && this.options.highlight)
				type = this.options.highlight;
		}

		if (label === true || label === false)
			label = null;

		if (type != null) {
			switch (type) {
				case 'error':
				case 'success':
				case 'warning':
					this._display.root.addClass(type);
					if (label != null)
						label = '<span class="label label-'+(type == 'error' ? 'important' : type)+'">'+label+'</span>';
					break;
			}
		}

		if (label != null)
			this._display.description.set('html', label);
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
			case 'select':
			case 'textarea':
				this._display.field.set('value', value);
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
	},
	/**
	 * @method reset
	 * @description Resets the form value
	 */
	reset: function() {
		if (this.options['default'] != null && this.options['default'])
			this.setValue(this.options['default']);
		else if (typeOf(this._display.field.reset) == 'function')
			this._display.field.reset();
		else
			this.setValue();
	},

	getInput: function () {
		return this._display.field;
	}

});
