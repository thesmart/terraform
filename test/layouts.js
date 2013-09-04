var should    = require('should')
var polymer   = require('../')

describe("layout", function(){

  describe("none", function(){
    var root = __dirname + "/fixtures/layouts/none"
    var poly = polymer.root(root)

    it("should render with no layout", function(done){
      poly.render("index.jade", function(errors, body){
        should.not.exist(errors)
        should.exist(body)
        body.should.eql("<h2>Home Page</h2>")
        done()
      })
    })
  })

  describe("base", function(){
    var root = __dirname + "/fixtures/layouts/base"
    var poly = polymer.root(root)

    it("should render with layout in base", function(done){
      poly.render("index.jade", function(errors, body){
        should.not.exist(errors)
        should.exist(body)
        body.should.include("<h1>Layout in Base</h1>")
        body.should.include("<h2>Home Page</h2>")
        done()
      })
    })
  })

  describe("deep", function(){
    var root = __dirname + "/fixtures/layouts/deep"
    var poly = polymer.root(root)

    it("should render with layout in deep", function(done){
      poly.render("nested/something.jade", function(errors, body){
        should.not.exist(errors)
        should.exist(body)
        body.should.include("<h1>Nested Layout</h1>")
        body.should.include("<h2>Something</h2>")
        done()
      })
    })
  })

})