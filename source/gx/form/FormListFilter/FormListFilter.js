/**
 *
 * @class gx.form.FormListFilter
 * @description This class is a gx.form.Form wrapper which automatically create filter form with gx.ui.List
 * @extends gx.form.Form
 * @implements gx.ui.List
 * @implements gx.form.FGxListFilter
 *
 * @param {gx.ui.List} list The gx.ui.List which you want to filter.
 * @param {string} name Form name.
 * @param {json object} options All options of gx.form.Form.
 *
 * @author Sebastian Glonner <sglonner@zeyon.net>
 * @version 1.00
 * @package form
 * @copyright Copyright (c) 2011-2013, Zeyon (www.zeyon.net)
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 *
 * @sample FormListFilter A small filter gx.ui.List example.
 */
gx.form.FormListFilter = new Class({
	Extends: gx.form.Form,
	options: {
		lang: {
			btn_remove_filter: 'Remove Filter',
			btn_apply: 'Apply Filter',
			btn_add: '+',
			btn_remove: '-',
		},
		MSG_INVALID: 'You must choose field, condition, and compare value!',
		btnApply: true,
		btnAdd: true,
		btnRemove: true,
		btnRemoveFilter: true,
	},

	_list: null,
	_lang: null,

	initialize: function(list, name, options) {
		this.parent(name, options);
		this.getBuilder().options.fieldNames = {
			'id': null,
			'title': null,
			'lastmodified': null,
			'info': null,
			'description': null,
		}
		this.options.lang.btn_submit = this.options.lang.btn_apply;
		this._list = list;
	},

	build: function () {
		var values = this._list.createValues();
		var options, field, filter, value;

		this.createField();

		var form = this.parent();
		var btn;
		if ( this.options.btnRemoveFilter ) {
			btn = new gx.form.Button({
				value: this.options.lang.btn_remove_filter
			});
			btn.addEvent('click', this.removeFilter.bind(this));
			this.injectButton(btn);
		}
		if ( this.options.btnAdd ) {
			btn = new gx.form.Button({
				value: this.options.lang.btn_add
			});
			btn.addEvent('click', this.addFilter.bind(this));
			this.injectButton(btn);
		}
		if ( this.options.btnRemove ) {
			btn = new gx.form.Button({
				value: this.options.lang.btn_remove
			});
			btn.addEvent('click', this.removeFilterField.bind(this));
			this.injectButton(btn);
		}

		return form;
	},

	submit: function () {
		this.fireEvent('beforeSubmit');
		var valid = this.validate();
		if ( valid !== true )
			return false;
		var values = this.valuesAsNames();
		var list = this.getList();
		var listValues = list.getValues();

		var filters = new Array();
		var value,cond,field,i;
		for ( i in this._fields ) {
			if ( !this._fields.hasOwnProperty(i) )
				continue;

			field = this._fields[i];
			value = field.getValue();
			cond = field.getCondField().getValue();
			name = field.getNameField().getValue();

			filters.push({
				'name': name,
				'condition': cond,
				'expression': value,
				'flags': 'i'
			});
		}
		list.applyFilter(filters);
		this.fireEvent('afterSubmit');
	},

	createField: function () {
		this.parent(
			'GxListFilter', {
				'name': this._count + 'Value'
			},
			this.options.lang[i], {
				mandatory: true,
				MSG_INVALID: this.options.MSG_INVALID,
			}
		);
	},

	addFilter: function () {
		this.createField();
	},

	removeFilterField: function () {
		if ( this._count > 1 ) {
			this.getBuilder().removeLastField();
			var fields = this.getFields();
			delete fields[this._count];
			this._count--;
		}
	},

	removeFilter: function () {
		if ( !this.filterActive() )
			return;
		this.getList().removeFilter(true);
		this.fireEvent('removeFilter');
	},

	getList: function () {
		return this._list;
	},

	filterActive: function () {
		return this.getList().filterActive();
	}
});
