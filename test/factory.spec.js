// jshint expr:true
describe("Factories", function(){
  beforeEach(module('authFactory'));
  beforeEach(module('dataFactory'));
  beforeEach(module('profile'));
  var $data, $auth;
  beforeEach(inject(function(auth, data) {
    $data = data;
    $auth = auth;
  }));

  it("should be imported", function(){
    $data.add.should.not.be.undefined;
    $auth.should.not.be.undefined;
  });

});
