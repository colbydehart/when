describe("ShowController", function(){
  beforeEach(module('show'));

  var ctrl, scope;
  beforeEach(inject(function($controller, $rootScope){
    scope = $rootScope.$new();
    ctrl = $controller('ShowController', {$scope: scope});
  }));

  it("Should exist", function(){
    expect(ctrl).to.not.equal(undefined);
  });
});
