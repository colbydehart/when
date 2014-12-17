describe("HomeController", function(){
  beforeEach(module('home'));

  var ctrl, scope;
  beforeEach(inject(function($controller, $rootScope){
    scope = $rootScope.$new();
    ctrl = $controller('HomeController', {$scope: scope});
  }));

  it("Should have panelText", function(){
    scope.panelText.should.have.length(2);
  });
});
