'use strict';


/**
 * Abstraction layer to the browser history object and events.
 */
define(function() {
  var Event = function() {
    this.id = 0;
    this.listener = {};
  };
  var pt__ = Event.prototype;

  /**
   * Attach events.
   * @param {function} callback The event callback function
   *
   * @return {integer} Unique id to detach the listener.
   */
  pt__.attach = function(callback) {
    var id = this.id++;
    this.listener[id] = callback;

    // Expecting attach and detach to be called far less than emit update
    // keys and length during attach- and detaching.
    this.keys = Object.keys(this.listener);

    return id;
  };

  /**
   * Detach events.
   */
  pt__.dettach = function(id) {
    delete this.listener[id];

    // Expecting attach and detach to be called far less than emit update
    // keys and length during attach- and detaching.
    this.keys = Object.keys(this.listener);
  };

  /**
   * Emit the very event for every listener.
   */
  pt__.emit = function(args) {
    var keys = this.keys, listener = this.listener;
    var l = this.keys.length, i = 0;
    for (; i < l; i++) {
      listener[keys[i]].apply(
          this,
          Array.isArray(args) ? args : [args]
      );
    }
  };

  return Event;
});
