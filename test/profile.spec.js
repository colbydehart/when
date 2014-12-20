describe("ProfileController", function(){
  beforeEach(module('profile'));

  var ctrl, scope, user;
  beforeEach(inject(function($controller, $rootScope){
    scope = $rootScope.$new();
    ctrl = $controller('ProfileController', {$scope: scope, currentUser : {uid:'simplelogin:2'} });
  }));

  it("Should exist", function(){
    expect(ctrl).to.not.equal(undefined);
  });

  it("Should get the events correctly", function(){
    // scope.events.abcd.should.equal('Go Camping');
  });

});
