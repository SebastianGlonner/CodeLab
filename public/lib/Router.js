/**
 * Abstraction layer to the browser history object and events.
 *
 * @compatibility window.onpopstate
 * @compatibility window.history.pushState
 *
 * @event routed
 *
 */
define(['jsx', 'Event'], function(nx_, Event) {
  var Router = function(root, history, global) {
    root = '' + root;
    if (root.charAt(root.length - 1) !== '/')
      root += '/';

    this.root = root;

    /**
     * @type {Eventor}
     */
    this.routed = new Event();

    this.window = global || window;
    this.location = window.location;
    this.history = history || this.window.history;
  };

  var _pt = Router.prototype;

  /**
   * Attach events to history.
   */
  _pt.start = function(routeCurrent) {
    this.started = true;
    this.window.onpopstate = this.dispatch.bind(this);

    if (routeCurrent)
      this.dispatch();
  };

  /**
   * Detach events from history
   */
  _pt.stop = function() {
    this.started = false;
    this.window.onpopstate = null;
  };

  /**
   * Navigate to the given url.
   * @param {string} url Url.
   */
  _pt.navigate = function(url) {
    if (!url.startsWith(this.root))
      url = url.substring(this.root.length);

    this.history.pushState({}, '', url);
  };

  _pt.dispatch = function() {
    var url = this.location.href;
    if (url.startsWith(this.root))
      url = url.substring(this.root.length);

    this.routed.emit(url);
    return false;
  };

  return Router;
});
