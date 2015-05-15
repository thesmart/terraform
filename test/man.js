var should    = require('should')
var polymer   = require('../')

describe("javascripts", function(){

  describe(".man", function(){
    var root = __dirname + "/fixtures/javascripts";
    var poly = polymer.root(root);

    it("should translate coffeescript to javascript", function(done){
      poly.render("man/all.man", function(errors, body){
        should.not.exist(errors);
        should.exist(body);
        done();
      })
    })

  })

});
