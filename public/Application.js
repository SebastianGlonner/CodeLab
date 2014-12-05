define(function() {
  /**
   * Singleton class.
   */
  var Application = function(cfgFile) {
    this.cfgFile = cfgFile;
  };
  var _pt = Application.prototype;

  _pt.config = function(cfg) {
    if (!cfg)
      return this.cfgFile;
  };

  return Application;
});
