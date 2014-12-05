/**
 *
 * @class gx.form.Form
 * @description Represents the complete form, including handlers.
 * @extends gx.core.Settings
 * @implements gx.form.Field
 * @implements gx.form.Builder
 * @implements gx.form.FieldFactory
 * @implements gx.form.Button
 *
 * @param {string} name Form name.
 * @param {json object} options
 *
 * @option {string} separator How to separate multible error messages.
 * @option {object} lang Language labels.
 * @option {boolean} submit Add submit button while building.
 * @option {boolean} reset Add reset button while building.
 * @option {object} request Mootools ajax request object.
 * @option {object} param Params for ajax request object.
 * @option {object} request Mootools ajax request object.
 *
 * @author Peter-Christoph Haider <peter.haider@zeyon.net>, Sebastian Glonner <sglonner@zeyon.net>
 * @version 1.00
 * @package form
 * @copyright Copyright (c) 2011-2013, Zeyon (www.zeyon.net)
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 *
 * @sample Form A small formular example.
 */
gx.form.Form = new Class({
	Extends: gx.core.Settings,
	options: {
		separator: '\n',
		lang: {
			btn_submit: 'Submit',
			btn_save: 'Save',
			btn_reset: 'Reset'
		},
		submit: true,
		reset: true,
		request: null,
		param: new Object()
	},
	_name: null,
	_count: 0,
	_fields: new Object(),

	_builder: null,
	_fieldFactory: null,

	_build: null,
	_form: null,

	initialize: function(name, options) {
		if ( options != undefined && options.lang != undefined ) {
			options.lang = Object.merge({}, this.options.lang, options.lang);
		}
		this._builder = new gx.form.Builder();
		this._fieldFactory = new gx.form.FieldFactory();
		this._name = name;
		this.parent(options);
	},

	/**
	 * @method submit
	 * @description Validate form, collect values and send request if set. Otherwise it will submit the form.
	 */
	submit: function(){
		try {
			if ( this.validate() !== true )
				return;

			var data = this.options.params;
			var i,field;
			for ( i in this._fields) {
				if ( !this._fields.hasOwnProperty(i) )
					continue;

				field = this._fields[i];
				data[field.getName()] = field.getValue();
				i++;
			}

			if ( this.options.request !== null ) {
				if ( this.options.method == 'post' ) {
					this.options.request.post(data);
				} else {
					this.options.request.get(data);
				}
			} else {
				this._form.submit();
			}

		} catch(e) { gx.util.Console('gx.form.Form->submit', e.message); }
	},

	/**
	 * @method valuesAsNames
	 * @description return object with field values with field names as index
	 */
	valuesAsNames: function(){
		var root = this;
		try {
			var values = new Object();
			var i;
			for ( i in this._fields ) {
				if ( !this._fields.hasOwnProperty(i) )
					continue;

				values[this._fields[i].get('name')] = this._fields[i].getValue();
			}
			return values;
		} catch(e) { gx.util.Console('gx.form.Form->valuesAsNames', e.message); }
	},

	/**
	 * @method valuesAsIds
	 * @description return object with field values with field ids as index
	 */
	valuesAsIds: function(){
		var root = this;
		try {
			var values = new Object();
			var i;
			for ( i in this._fields ) {
				if ( !this._fields.hasOwnProperty(i) )
					continue;
				values[this._fields[i].get('id')] = this._fields[i].getValue();
			}
			return values;
		} catch(e) { gx.util.Console('gx.form.Form->valuesAsIds', e.message); }
	},

	/**
	 * @method validate
	 * @description validate form and return string with all occured erros. Separated with options.separator.
	 */
	validate: function(){
		var root = this;
		try {
			this.errors = new Array();
			var i,field;
			for ( i in this._fields ) {
				if ( !this._fields.hasOwnProperty(i) )
					continue;

				field = this._fields[i];
				if ( !field.options.visible || !field.options.editable )
					continue;

				result = field.validate();
				if ( result !== true )
					this.errors.push(result);
			}
			if (this.errors.length > 0)
				return this.errors.join(this.options.separator);
			else
				return true;

		} catch(e) { gx.util.Console('gx.form.Form->validate', e.message); }
	},

	/**
	 * @method reset
	 * @description Call each fields reset function.
	 * @param {object} content The content to set
	 */
	reset: function(){
		var root = this;
		try {
			var i;
			for ( i in this._fields ) {
				if ( !this._fields.hasOwnProperty(i) )
					continue;

				this._fields[i].reset();
			}
		} catch(e) { gx.util.Console('gx.form.Form->reset', e.message); }
	},

	/**
	 * @method build
	 * @description Builds the form with "this._builder".
	 */
	build: function () {
		this._build = this._builder.build(this);
		if ( this.options.submit ) {
			var btn = new gx.form.Button({
				type: 'submit',
				value: this.options.lang.btn_submit
			});
			btn.addEvent('click', this.submit.bind(this));
			this.injectButton(btn);
		}
		if ( this.options.reset ) {
			var btn = new gx.form.Button({
				type: 'button',
				value: this.options.lang.btn_reset
			});
			btn.addEvent('click', this.reset.bind(this));
			this.injectButton(btn);
		}
		var form = new Element('form', {
			'action': this.options.action,
			'method': this.options.method,
		});
		form.adopt(this._build);
		this._form = form;
		return this._form;
	},

	/**
	 * @method getBuild
	 * @description returns the html form object;
	 */
	getBuild: function () {
		return this._form;
	},

	/**
	 * @method createField
	 * @description Create field with fieldfactory. Injects into form if form is already created.
	 * @param {string} type Field type.
	 * @param {object} att field input element attributes.
	 * @param {string} label Fields label.
	 * @param {object} options.
	 * @param {string} name A name for the field. You can identify the field with this name. This name have to be unique!
	 */
	createField: function (type, att, label, options, name) {
		var field = this._fieldFactory.build(type, att, label, options);
		this.addField(name, field);
		if ( this._build !== null ) {
			this.injectField(field);
		}
		return field;
	},

	/**
	 * @method createFields
	 * @description Create fields out of array. Calls this.createField();
	 * @param {object} fields Fields as array.
	 */
	createFields: function (fields) {
		for ( i = 0; i < fields.length; i++ ) {
			var field = fields[i];

			if ( !field.type ) field.type = '';
			if ( !field.name ) field.name = '';
			if ( !field.att ) field.att = {};
			if ( !field.label ) field.label = '';
			if ( !field.options ) field.options = {};

			this.createField(field.type, field.att, field.label, field.options, field.name);
		}
	},

	addField: function(name, field){
		if ( name == undefined ) {
			var n = field.getInput().get('name');
			if ( n != undefined )
				name = n;
			else
				name = this._count;
		}
		field.setName(name);
		field.getValidator().setLang(this.options.lang);
		field.setForm(this);
		this._fields[name] = field;
		this._count++;
	},

	/**
	 * @method injectButton
	 * @description Inject button with this._builder.injectButton().
	 * @param {object} btnElement Button element.
	 */
	injectButton: function(btnElement){
		this._builder.injectButton(btnElement);
	},

	injectField: function(field) {
		this._builder.injectField(field);
	},

	/* depreciated ?!
	initButtons: function(){
		var frame = this;
		var btnSend = new Element('div', {
			'class': 'mooFormBtn',
			'text': 'Send',
				'events': {
					'click': function(){
						frame.submit();
					}
				}
		});
		this.addButton(btnSend);
	},
	*/

	/**
	 * @method getFields
	 * @description return form fields.
	 */
	getFields: function () {
		return this._fields;
	},

	/**
	 * @method getField
	 * @description return a field by name.
	 * @param {string} name The field name
	 */
	getField: function (name) {
		return this._fields[name];
	},

	/**
	 * @method setBuilder
	 * @description set custom form builder. Refer to gx.form.Builder().
	 * @param {object} builder The builder instance of class.
	 */
	setBuilder: function (builder) {
		this._builder = builder;
	},

	/**
	 * @method getBuilder
	 * @description get the form builder instance.
	 */
	getBuilder: function () {
		return this._builder;
	},

	/**
	 * @method setFieldFactory
	 * @description set custom field factory. Refer to gx.form.FieldFactory().
	 * @param {object} builder The builder instance of class.
	 */
	setFieldFactory: function (bactory) {
		this._fieldFactory = bactory;
	},

	/**
	 * @method getFieldFactory
	 * @description get the field factory instance.
	 */
	getFieldFactory: function () {
		return this._fieldFactory;
	},

	/**
	 * @method getName
	 * @description return form name.
	 */
	getName: function () {
		return this._name;
	},

	/**
	 * @method setFieldValues
	 * @description Set form field values.
	 * @param {object} items Object {fieldName1: fieldValue1, fieldName2: fieldValue2 }
	 */
	setFieldValues: function (items) {
		var i, field;
		var fields = this.getFields();
		for ( i in fields ) {
			if ( !fields.hasOwnProperty(i) )
				continue;

			field = fields[i];
			field.setValue(items[i]);
		}
	}

});
