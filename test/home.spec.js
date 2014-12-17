describe("HomeController", function(){
  beforeEach(module('home'));

  var ctrl, scope;
  beforeEach(inject(function($controller, $rootScope){
    scope = $rootScope.$new();
    ctrl = $controller('HomeController', {$scope: scope});
  }));

  it("Should be instantiated", function(){
    scope.name.should.equal('Colby');
  });
});
