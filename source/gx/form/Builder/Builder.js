/**
 *
 * @class gx.form.Builder
 * @description Build form with from gx.form.Form.
 * @extends gx.ui.Container
 * @implements gx.form.Form
 * @implements gx.form.Field
 * @implements gx.form.FieldBuilder
 *
 * @param {string|node} display The html element which will contain form.
 * @param {json object} options
 *
 * @option {object} fieldNames Names of fields which get displayed at special places.
 *
 * @author Sebastian Glonner <sglonner@zeyon.net>
 * @version 1.00
 * @package form
 * @copyright Copyright (c) 2011-2013, Zeyon (www.zeyon.net)
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 *
 * @sample Form A small formular example.
 */
gx.form.Builder = new Class({
	Extends: gx.ui.Container,
	options: {
		cssPrefix: 'gxForm',
		rootTag: 'table',
		lineTag: 'tr',
		fieldNames: {
			'id': null, // showed in the title
			'title': null, // showed in the title
			'lastmodified': null, // showed in the title
			'description': null // field can be shown and hide
		}
	},

	_buttonsCon: null,

	_fieldBuilder: new gx.form.FieldBuilder,

	initialize: function(display, options) {
		this.parent(display, options);
		this._ui.root.addClass(this.options.cssPrefix + 'Container');
	},

	/**
	 * @method injectField
	 * @description Inject field. Should be called with gx.form.Form!
	 */
	injectField: function (field) {
		var line = this.getLine();
		this.buildField(line, field);
		line.inject(this._buttonsCon.getParent(), 'before');
		field.setLine(line);
	},

	/**
	 * @method injectButton
	 * @description Inject Button. Should be called with gx.form.Form!
	 */
	injectButton: function (btn) {
		this._buttonsCon.adopt(btn);
	},

	removeLastField: function () {
		this._buttonsCon.getParent().getPrevious().dispose();
	},

	/**
	 * @method build
	 * @description Build the form.
	 */
	build: function (form) {
		this._ui.root.empty();
		var orgFields = form.getFields();
		var i, fields = new Object();

		// Low copy, Object.clone() would result in endless loop
		// because fields contain reference to there form with contain reference to all fields
		for ( i in orgFields ) {
			if ( !orgFields.hasOwnProperty(i) )
				continue;

			fields[i] = orgFields[i];
		}
		var root = this.getRoot();

		fields = this.removeSpecialFields(fields);

		var fldCount = fields.length;
		var root = this.getRoot();
		var line,field;

		if ( this.options.fieldNames.id != null )
			this._ui.root.adopt(this.buildHead(orgFields));
		if ( this.options.fieldNames.description != null )
			this._ui.root.adopt(this.buildDesc(orgFields));

		// It is important to compare with a fix value (fldCount).
		// Because it may be that buildField() would add further fields
		// and increment fields.length of the form
		// and if your condition would look like fields.length you might
		// run into a endless loop.
		for ( i in fields ) {
			if ( !fields.hasOwnProperty(i) )
				continue;

			field = fields[i];
			if ( !field.options.visible || !field.options.editable )
				continue;

			line = this.getLine();
			field.setLine(line);

			this.buildField(line, field);

			root.adopt(line);
		}
		var line = this.getLine();
		var con = this._fieldBuilder.buttonContainer();
		line.adopt(con);
		this._buttonsCon = con;
		root.adopt(line);
		this._ui.root.adopt(root);
		return this._ui.root;
	},

	buildField: function (line, field) {
		this._fieldBuilder.buildLabel(field, line);
		this._fieldBuilder.buildEdit(field, line);
	},

	buildHead: function (fields) {
		try {
			var fieldID = fields[this.options.fieldNames.id];
			var id = fieldID.getValue();
			var head = new Element('div', {
				'class': this.options.cssPrefix + 'Head'
			});
			var table = new Element('table');
			table.set({
				'cellpadding': 0,
				'cellspacing': 0,
				'style': 'width:100%'
			});
			var tr = new Element('tr');
			var td1 = new Element('td');
			table.adopt(tr);
			tr.adopt(td1);

			if ( id == '' )
				td1.set('html', fieldID.getForm().options.title);
			else {
				td1.set('html', '#' + id + ' ' + fieldID.getForm().options.title);

				var span = new Element('span', {
					html: fields[this.options.fieldNames.lastmodified].getDisplayValue(),
					style: 'vertical-align:middle;'
				});
				var td2 = new Element('td', {
					'style': 'text-align:right;'
				});
				td2.adopt(span);
				tr.adopt(td2);
			}

			head.adopt(table);
			return head;
		} catch (e) { gx.util.Console('gx.form.Builder->buildHead', e.message); }
	},

	buildDesc: function (fields) {
		try {
			var field = fields[this.options.fieldNames.description];
			var desc = new Element('div', {
				'class': this.options.cssPrefix + 'Description'
			});
			var arrow = new Element('div.labelArrow', {
				'html': field.getLabel()
			});
			var body = new Element('div');
			var input = field.getInput();
			input.setStyle('width', '100%');
			body.adopt(input);
			desc.adopt(arrow, body);
			arrow.set('slide');
			desc.addEvent('click', function () {
				body.slide();
			});
			// Do not close description body if we click inside textarea
			field.getInput().addEvent('click', function (event) {
				event.stop();
			});
			return desc;
		} catch (e) { gx.util.Console('gx.form.Builder->buildDesc', e.message); }
	},

	getRoot: function () {
		return new Element(this.options.rootTag, {
			'class': this.options.cssPrefix + 'Container',
			'cellpadding': 0,
			'cellspacing': 0
		});
	},

	getLine: function () {
		return new Element(this.options.lineTag, {
			'class': this.options.cssPrefix + 'Line'
		});
	},

	/**
	 * @method setFieldBuilder
	 * @description Set custom field build class. Refer to gx.form.FieldBuilder
	 */
	setFieldBuilder: function (builder) {
		this._fieldBuilder = builder;
	},

	getFieldBuilder: function () {
		return this._fieldBuilder;
	},

	removeSpecialFields: function (fields) {
		var toRemove = this.options.fieldNames;
		var i;
		for ( i in toRemove ) {
			if ( toRemove[i] == null )
				continue;

			delete fields[toRemove[i]];
		}
		return fields;
	},

});
