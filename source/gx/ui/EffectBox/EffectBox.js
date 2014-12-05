/**
 * @class gx.ui.EffectBox
 * @description Container with hidden overflow. Showing various contents through different effects.
 * @extends gx.ui.Container
 *
 * @author Sebastian Glonner <sebastian.glonner@zeyon.net>
 * @version 1.00
 * @package ui
 * @copyright Copyright (c) 2011-2013, Zeyon (www.zeyon.net)
 *
 * @param {string|node} display
 */
gx.ui.EffectBox = new Class({
	Extends: gx.ui.Container,

	options: {
        storekey: '_ebeffect'
	},

	_theme: {
		root: 'gxUiEffectBox',
        maincontent: 'main',
        content: 'content'
	},

    maincontent: null,

    initialize: function(display, options) {
		this.parent(display, options);

		this._ui.root.addClass(this._theme.root);
    },

    /**
     * @method setContent
     * @description Set main content. Will be displayed by default
     * @param {element} content
     */
    setContent: function(content) {
		content.addClass(this._theme.content);
        content.addClass(this._theme.maincontent);

        this._ui.root.adopt(content);
        this.maincontent = content;

        return this;
    },

    /**
     * @method addEffect
     * @description Add various content. Showed due to specified actions.
     * @param {element} content
     * @param {string} effect Which effect to use.
     * @param {object} effectoptions Options for the effect.
     */
    addEffect: function(content, effect, effectoptions) {
		content.addClass(this._theme.content);

        this._ui.root.adopt(content);

        if ( effect != null ) {
            effect = this.ucfirst(effect);

            if ( gx.ui.EffectBox.Effects[effect] == null )
                alert('EffectBox: Unsupported effect');

            if ( effectoptions == null )
                effectoptions = {};

            effectoptions.parent = this._ui.root;
            effectoptions.from = this.maincontent;
            effectoptions.to = content;

            var e = new gx.ui.EffectBox.Effects[effect](effectoptions);
            content.store(this.options.storekey, e);
        }

        return this;
    },
    ucfirst: function(str) {
        str += '';
        var f = str.charAt(0).toUpperCase();
        return f + str.substr(1);
    }

});

gx.ui.EffectBox.Effects = {
    Hover: null,
    Push: null,
    Fade: null,
};

(function() {
    var ns = this;

    ns.Base = new Class({
        Extends: gx.core.Settings,

        _develop: true,

        _effects: {

        },

        _theme: {
            root       : 'gxUiEffectBoxEffect',
            eonhover   : 'eonhover',
            name       : '',
            efrom      : 'efrom',
            eto        : 'eto',
        },

        _parent: null,
        _from: null,
        _to: null,

        initialize: function(options) {
            this.parent(options);

            if ( this._develop ) this.checkOptions();

            this._parent = options.parent;
            this._from = options.from;
            this._to = options.to;

            if ( this._parent != null ) {
                this._parent.addClass(this._theme.root);
                this._parent.addClass(this._theme.name);
            }

            if ( this._to != null ) {
                this._to.addClass(this._theme.eto + ' ' + this._theme.name);
            }

            if ( this._from != null ) {
                this._from.addClass(this._theme.efrom);
            }

            this.init();
        },

        checkOptions: function() {
            var e = this._effect;
            // check if affected elements are given
            for ( var i = 0; i < e.affected.length; i++ )
                if ( this.options[e.affected[i]] == null )
                    throw new Error('Missing necessary affected element: ' + e.affected[i]);

            for ( var option in e ) {
                if ( !e.hasOwnProperty(option) || option == 'affected' )
                    continue;

                if ( e[option].indexOf(this.options[option]) == -1 )
                    throw new Error('Unsupported event option: ' +option+ ' = ' +this.options[option]+ '!');

            }
        },
    });

    ns.Hover = new Class({
        Extends: ns.Base,

        options: {
            direction: 'bottom-top',
            event: 'hover'
        },

        _effect: {
            direction: ['bottom-top'],
            event: ['hover'],
            affected: ['parent', 'to']
        },

        _theme: {
            name: 'hover'
        },

        init: function() {
            this._to.addClass('to');

            if ( this.options.event == 'hover' ) {
                this._parent.addClass(this._theme.eonhover);
                this._parent.addClass(this.options.direction);
            }
        }
    });

    ns.Push = new Class({
        Extends: ns.Base,

        options: {
            direction: 'bottom-top',
            event: 'hover'
        },

        _effect: {
            direction: ['bottom-top'],
            event: ['hover'],
            affected: ['parent', 'from', 'to']
        },

        _theme: {
            name: 'push'
        },

        init: function() {
            if ( this.options.event == 'hover' ) {
                this._parent.addClass(this._theme.eonhover + ' ' + this.options.direction);
            }
        }
    });

    ns.Fade = new Class({
        Extends: ns.Base,

        options: {
            event: 'hover'
        },

        _effect: {
            event: ['hover'],
            affected: ['parent', 'from', 'to']
        },

        _theme: {
            name: 'fade'
        },

        init: function() {
            if ( this.options.event == 'hover' ) {
                this._parent.addClass(this._theme.eonhover);
            }
        }
    });
}.bind(gx.ui.EffectBox.Effects))();

