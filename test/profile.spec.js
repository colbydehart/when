describe("ProfileController", function(){
  beforeEach(module('profile'));

  var ctrl, scope;
  beforeEach(inject(function($controller, $rootScope){
    scope = $rootScope.$new();
    ctrl = $controller('ProfileController', {$scope: scope});
  }));

  it("Should exist", function(){
    expect(ctrl).to.not.equal(undefined);
  });
});
