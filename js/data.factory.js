;(function () {
'use strict';

angular.module('dataFactory', ['authFactory', 'firebase'])

.factory('data', ['$rootScope', '$firebase', function ($rootScope, $firebase){

  var url = 'https://when1021.firebaseio.com/';
  var query = function(){
    return '?auth=' + $rootScope.user.token;
  };

  return {
    //GET_EVENTS_FOR_USER: gets all events for
    //   currently logged in user.
    getEventsForUser : function(cb){
      var sync = $firebase(new Firebase(url + 'users/' + $rootScope.user.uid ));
      return sync.$asObject();
    },
    //ADD: adds a new event to the 
    //     logged in user's events
    add : function(name,cb){
      var eventsSync = $firebase(new Firebase(url+'events')),
          userSync = $firebase(new Firebase(url+'users/'+$rootScope.user.uid)),
          id;
      //Push in the new event into the 
      //     'events' key on fb
      eventsSync.$push({name: name, owner : $rootScope.user.uid})
      .then(function(ref) {
        id = ref.key();
        var event = {};
        event[id] = name;
        //Then add that event's id to the 
        //     current users events on fb
        return userSync.$update(event);
      })
      .then(function(ref) {
        cb(id);
      });
    },
    //GET: gets a single event from a provided id
    get : function(id, cb){
      var sync = $firebase(new Firebase(url+'events/'+id));
      return sync.$asObject();
    },
    remove : '',
    update : ''
  };
}]);
}());
