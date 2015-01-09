// jshint expr:true
describe("AuthController", function(){
  beforeEach(module('auth'));

  var ctrlMaker, scope, root, q, loc,
  auth={};
  beforeEach(inject(function($location, $controller, $rootScope, $q, _auth_){
    q = $q;
    loc = $location;
    root = $rootScope;
    scope = $rootScope.$new();
    auth.$unauth = sinon.stub(_auth_, '$unauth');
    auth.$authWithPassword = sinon.stub(_auth_, '$authWithPassword', function() {
      return $q(function(res, rej) {
       res();
       rej('ERROR');
      });
    });
    ctrlMaker =  function() {
      return $controller('AuthController', {$scope: scope, auth: _auth_});
    };
  }));

  it("Should exist", function(){
    expect(ctrlMaker()).to.not.equal(undefined);
  });
  it('Should be able to log a user out', function() {
    loc.path('logout');
    ctrlMaker();
    auth.$unauth.should.have.been.called;
  });
  it("should log in", function(){
    loc.path('login');
    ctrlMaker();
    scope.user = 'Colby';
    scope.submit();
    auth.$authWithPassword.should.have.been.calledWith('Colby');
  });
});
