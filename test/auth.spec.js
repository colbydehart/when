describe("AuthController", function(){
  beforeEach(module('auth'));

  var ctrl, scope;
  beforeEach(inject(function($controller, $rootScope){
    scope = $rootScope.$new();
    ctrl = $controller('AuthController', {$scope: scope});
  }));

  it("Should exist", function(){
    expect(ctrl).to.not.equal(undefined);
  });
});
