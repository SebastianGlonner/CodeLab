/**
 *
 * @class gx.form.FieldBuilder
 * @description Build form fields with common or custom functions depending on the field type.
 * @extends gx.core.Settings

 * @param {json object} options
 *
 * @option {string} cssPrefix Prefix for all css classes in use. 'gxForm' by default.
 * @option {string} labelTag The html tag used to build the field label.
 * @option {string} editTag The html tag used to build the field edit panel.
 * @option {string} labelClass Css class name of the field label element.
 * @option {string} editClass Css class name of the field edit panel element.
 * @option {string} mandatory String to mark mandatory fields.
 *
 * @author Sebastian Glonner <sglonner@zeyon.net>
 * @version 1.00
 * @package form
 * @copyright Copyright (c) 2011-2013, Zeyon (www.zeyon.net)
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 *
 * @sample Form A small formular example.
 */
gx.form.FieldBuilder = new Class({
	Extends: gx.core.Settings,
	options: {
		cssPrefix: 'gxForm',
		/* TODO: use of objects here to allow fully custom html elements */
		labelTag: 'td',
		editTag: 'td',
		labelClass: 'Label',
		editClass: 'Edit',
		mandatory: '*',
		submit: true
	},

	initialize: function(options) {
		this.parent(options);
	},

	buttonContainer: function () {
		var con = new Element(this.options.labelTag);
		con.addClass(this.options.cssPrefix + 'Buttons');

		con.set('colspan', 2);
		return con;
	},

	buildEdit: function (field, line) {
		var func = field.options.buildFunction + 'Edit';
		if ( typeof this[func] == 'function' )
			this[func](field, line);
		else
			this.CommonEdit(field, line);
	},

	buildLabel: function (field, line) {
		var func = field.options.buildFunction + 'Label';
		if ( typeof this[func] == 'function' )
			this[func](field, line);
		else
			this.CommonLabel(field, line);
	},

	CommonEdit: function (field, line) {
		var td = new Element(this.options.editTag, {
			'class': this.options.cssPrefix + this.options.editClass
		});
		td.adopt(field.getEdit());
		td.adopt(field.getIndicator());

		var validator = field.getValidator();
		var indicatorH = field.getIndicatorHandler();
		validator.addEvent('invalid', indicatorH.show.bind(indicatorH));
		validator.addEvent('valid', indicatorH.hide.bind(indicatorH));

		field.getIndicator().addClass(this.options.cssPrefix + 'Indicator');

		var input = field.getInput();
		input.addClass(this.options.cssPrefix + 'Input');

		if ( field instanceof gx.form.FSelect )
			input.addEvent('change', field.validate.bind(field));
		else
			input.addEvent('blur', field.validate.bind(field));

		field.setEditCon(td);
		line.adopt(td);
	},

	CommonLabel: function (field, line) {
		var td = new Element(this.options.labelTag, {
			'class': this.options.cssPrefix + this.options.labelClass
		});
		var label = field.getLabel();
		if ( field.options.mandatory )
			label = this.options.mandatory + label;

		td.set('html', label);

		field.setLabelCon(td);
		line.adopt(td);
	},

	GxListFilterLabel: function () {
	},

	GxListFilterEdit: function (field, line) {
		var td = new Element(this.options.editTag, {
			'class': this.options.cssPrefix + this.options.editClass,
			'colspan': 2,
			'style': 'text-align: center;'
		});
		var edit = field.getEdit();
		edit.setStyle('display', 'inline-block');

		var form = field.getForm();
		var input = field.getInput();
		var list = form.getList();

		var condition = form.getFieldFactory().build(
			'AdvSelect', {
				'name': input.get('name') + 'Condition',
				'style': 'width:60px;',
			},
			'', {
				searchMode: false,
				mandatory: true
			}
		);

		var options = new Array();
		for ( var i in list.options.fConditions ) {
			options.push({name: list.options.fConditions[i].name, value: i});
		}
		condition.createOptions(options);
		condition.getInput().addClass(this.options.cssPrefix + 'Select');
		field.setCondField(condition);

		var values = list.getValues();
		var options = new Array();
		var label;
		for ( var name in values ) {
			if ( !values.hasOwnProperty(name) )
				continue;

			label = name;
			if ( form.options.lang[name] != undefined )
				label = form.options.lang[name];
			options.push({name: label, value: name});
		}
		namesSelect = form.getFieldFactory().build(
			'AdvSelect', {
				'name': input.get('name') + 'Field'
			},
			'', {
				searchMode: false,
				mandatory: true
			}
		);

		namesSelect.getInput().addEvent('change', function () {
			var options = new Array();
			var values = list.getValues()
			var name = this.getValue();
			values = values[name];
			for ( var i in values  ) {
				if ( !values.hasOwnProperty(i) )
					continue;

				var value = values[i];
				options.push({name: value, value: value});
			}
			field.createOptions(options);
		}.bind(namesSelect));

		namesSelect.createOptions(options);
		namesSelect.getInput().addClass(this.options.cssPrefix + 'Select');

		field.setNameField(namesSelect);

		td.adopt(namesSelect.getEdit(),condition.getEdit(),edit,field.getIndicator());

		var validator = field.getValidator();
		var indicatorH = field.getIndicatorHandler();
		validator.addEvent('invalid', indicatorH.show.bind(indicatorH));
		validator.addEvent('valid', indicatorH.hide.bind(indicatorH));

		field.getIndicator().addClass(this.options.cssPrefix + 'Indicator');

		input.addClass(this.options.cssPrefix + 'Input');
		input.addEvent('change', field.validate.bind(field));

		field.setEditCon(td);
		line.adopt(td);
	}

});
