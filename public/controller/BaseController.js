define(function() {
  var Controller = function() {
    this.actions = {};
  };

  var _pt = Controller.prototype;

  _pt.render = function() {

  };

  _pt.defineActions = function(actions) {
    this.actions = actions;
  };

  _pt.invokeAction = function(actionName, args) {
    if (!this.actions[actionName])
      throw new Error('Action does not exist: ' + actionName);

    this.actions[actionName].apply(
        this,
        Array.isArray(args) ? args : [args]
    );
  };

  return Controller;
});


