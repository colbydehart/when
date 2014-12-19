describe("ProfileController", function(){
  beforeEach(module('profile'));

  var ctrl, scope, getEventsSpy;
  beforeEach(inject(function($controller, $rootScope, data){
    scope = $rootScope.$new();
    getEventsSpy = sinon.stub(data, 'getEventsForUser', function(cb){
      cb({
        'abcd' : 'Go Camping',
        'efgh' : 'Fancy Dinner'
      });
    });

    ctrl = $controller('ProfileController', {$scope: scope});
  }));

  it("Should exist", function(){
    expect(ctrl).to.not.equal(undefined);
  });

  it("Should get the events correctly", function(){
    scope.events.abcd.should.equal('Go Camping');
  });

});
