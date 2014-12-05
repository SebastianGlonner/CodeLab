/**
 * @class gx.ui.Paginator
 * @description Provide client or server side pagination.
 * @extends gx.ui.Container
 * @implements gx.util.Console
 *
 * @param {string|node} display
 * @param {object} options
 *
 * @event startLoading
 * @event finishLoading
 */
gx.ui.Paginator = new Class({
	gx: 'gx.ui.ClientPaginator',
	Extends: gx.ui.Container,
	options: {
		'clientOnly'      : false,
		'perPage'         : 50,
        'optionsBarElem'  : null,
        'autoLoadOnBottom': true,
        'createItem'      : function(pos, item, container) {

        },
		'loadItems'       : null /*function(start, end, count, function(items){}) {
			// return [{},{}]
		}*/
	},
	_items: [],
    _current: 0,

    _scrollsize: null,
    _isloading: false,

	initialize: function(display, options) {
		var root = this;

        this.parent(display, options);

        this._ui.pagination = null;

        if ( this.options.optionsBarElem )
            this.createOptionsbar(this.options.optionsBarElem);

        if ( this.options.items ) {
            if ( typeOf(this.options.items) != 'array' ) {
                alert('Items must be an array!');
                return;
            }

            this._items = this.options.items;
        }

        if ( this.options.autoLoadOnBottom ) {
            this.initAutoLoadOnBottom();
        }

        this.list();
	},

    initAutoLoadOnBottom: function() {
        this._ui.root.addEvent('scroll', function(event) {
            if ( this._isloading )
                return;

            var scroll = this._ui.root.getScroll();
            if ( scroll.y > this._scrollsize - 10 ) {
				this.next();
            }
        }.bind(this));
    },

    createOptionsbar: function(elem) {

    },

    createPaginationItems: function(current) {
        this._ui.pagination = new Element('div');

        var pagination = new Element('div', {
            'class': 'alert alert-info',
            'styles': {
                'text-align': 'center',
                'margin': 'auto',
                'width': '300px',
                'cursor': 'pointer'
            },
            'html': 'Show More (' + current + '/' + this._items.length + ')'
        });

        pagination.addEvent('click', function() {
            this.next();
        }.bind(this));

        this._ui.root.adopt(this._ui.pagination.adopt([
            new Element('div.clear'),
            pagination
        ]));
    },

    setItems: function(items) {
        this.reset();
        this._items = items;
        this.list();
    },

    list: function() {
		this._isloading = true;
		this.fireEvent('startLoading');

        if ( this._ui.pagination != null ) {
            this._ui.pagination.destroy();
        }

        var start = parseInt(this._current) * parseInt(this.options.perPage);
		var end;
		if ( this.options.clientOnly )
			end = Math.min(start + this.options.perPage, this._items.length);
		else {
			end = start + this.options.perPage;
		}

		if ( !this.options.clientOnly && this._items[start] == undefined ) {
			if ( this.options.loadItems ) {
				this.options.loadItems(start, end, this.options.perPage, function(items) {
					this.fireEvent('finishLoading');
					this._isloading = false;

					if ( typeOf(items) != 'array' || items.length == 0 )
						return;

					this._items.append(items);
					this.expandList(start, Math.min(start + this.options.perPage, this._items.length));
				}.bind(this));
			}
		} else {
			this.expandList(start, end);
		}
    },

	expandList: function(start, end, finished) {
        for ( var i = start; i < end; i++ ) {
            this.options.createItem(i, this._items[i], this._ui.root);
        }

        if ( end < this._items.length )
            this.createPaginationItems(i);

        this.updateScrollSize();
	},

    updateScrollSize: function() {
        this._scrollsize = this._ui.root.getScrollSize().y - this._ui.root.getCoordinates().height;
    },

    next: function() {
        this._current++;
        this.list();
    },

    reset: function() {
        this._current = 0;
        this._ui.root.empty();
    }

});
