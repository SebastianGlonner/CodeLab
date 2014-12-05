describe('ServerSideApi has methods like', function() {

  var config = require(process.cwd() + '/../bootstrap.js');
  var api = new (require(config.DIR.BIN + 'api.js'));

  beforeEach(function() {

  });

  describe('listPatterns', function() {
    it('which list patterns', function() {
      expect(false).toBe(false);
    });
  });

});
