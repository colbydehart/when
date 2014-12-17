describe("EditController", function(){
  beforeEach(module('edit'));

  var ctrl, scope;
  beforeEach(inject(function($controller, $rootScope){
    scope = $rootScope.$new();
    ctrl = $controller('EditController', {$scope: scope});
  }));

  it("Should exist", function(){
    expect(ctrl).to.not.equal(undefined);
  });
});
