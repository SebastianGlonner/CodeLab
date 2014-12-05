/**
 * @class gx.bootstrap.StateIcon
 * @description Animated icon set to show a specific state.
 * @extends gx.ui.Container
 * @implements gx.ui.OC_Container
 */
gx.bootstrap.StateIcon = new Class({
	Extends: gx.ui.Container,

	options: {
		/**
		 * This will be merged (Object.merge()) with the internal states,
		 * so you can change the icons, texts etc.
		 */
		'states': {},
		/**
		 * Use non 3d animation.
		 * @type {Boolean}
		 */
		fallback: true,
		/**
		 * Should we automatically detect ie and use fallback?
		 * @type {Boolean}
		 */
		determineFallback: true
	},

	_theme: {
		root: 'gxBootstrapStateIcon',
		root3d: 'effect3d',
		rootFallback: 'gxUiOCContainer fallback'
	},

	_states: {
		'truthy': {
			'icon' : 'glyphicon glyphicon-ok-sign',
			'text' : 'Ok',
			'class': 'truthy',
		},
		'faulty': {
			'icon' : 'glyphicon glyphicon-remove-sign',
			'text' : 'False',
			'class': 'faulty',
		},
		'default': {
			'icon' : 'glyphicon glyphicon-question-sign',
			'text' : '&nbsp;',
			'class': 'default',
		}
	},

	_arrStates: ['truthy', 'faulty', 'default'],

	initialize: function(display, options) {
		this.parent(display, options);

		Object.merge(this._states, this.options.states);

		if ( this.options.determineFallback )
			this.options.fallback = Browser.name == 'ie';

		if ( this.options.fallback ) {
			this.buildFallback();
		} else {
			this.build3D();
		}

		this._ui.root.addClass(this._theme.root);

		this.setDefault();
	},

	buildFallback: function() {
		this._theme.root += ' ' + this._theme.rootFallback;

		this._ui.icon = new Element('span');
		this._ui.text = new Element('span.stateText');

		this.curtain = new gx.ui.OC_Container(this._ui.root);

		this._ui.root.adopt(
			this._ui.icon,
			this._ui.text
		);
	},

	build3D: function() {
		this._theme.root += ' ' + this._theme.root3d;

		var states = this._states;
		this._ui.root.adopt(
			new Element('div.cube').adopt(
				new Element('div.front').adopt(
					new Element('span', {
						'class': states['default'].icon,
					}),
					new Element('span.stateText', {
						'html': states['default'].text,
					})
				),
				new Element('div.bottom').adopt(
					new Element('span', {
						'class': states.truthy.icon,
					}),
					new Element('span.stateText', {
						'html': states.truthy.text,
					})
				),
				new Element('div.back').adopt(
					new Element('span', {
						'class': states.faulty.icon,
					}),
					new Element('span.stateText', {
						'html': states.faulty.text,
					})
				)
			)
		);
	},

	set: function(bool) {
		this.setBoolean(bool);
	},
	setBoolean: function(bool) {
		if ( bool === true )
			this.setTruthy();
		else if ( bool === false )
			this.setFaulty();
		else
			this.setDefault();
	},

	setTrue: function() {
		this.setTruthy();
	},
	setTruthy: function() {
		this._state = true;
		this._set('truthy');
	},

	setFalse: function() {
		this.setFalse();
	},
	setFaulty: function() {
		this._state = false;
		this._set('faulty');

	},

	setDefault: function() {
		this._state = null;
		this._set('default');
	},

	_set: function(n) {
		if ( !this.options.fallback ) {
			this._ui.root.set('class',
				this._theme.root +' '+ this._states[n]['class']);
			return;
		}

		var state = this._states[n];
		this.curtain.close(function() {
			var _this = this, root = this._ui.root;
			for ( var i = 0; i < _this._arrStates.length; i++)
				root.removeClass(_this._states[_this._arrStates[i]]['class']);

			root.addClass(state['class']);

			this._ui.icon.set('class', state.icon);
			this._ui.text.set('html', state.text);

			this.curtain.show();
		}.bind(this));
	},

	getState: function() {
		return this._state;
	}
});