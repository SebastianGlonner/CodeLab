define(['./BaseController'], function(BaseController) {
  var Controller = function() {};

  var _pt = Controller.prototype = new BaseController();

  _pt.index = function() {
    console.log('invoked action index.');
  };

  _pt.defineActions({
    'index': _pt.index
  });

  return Controller;
});
