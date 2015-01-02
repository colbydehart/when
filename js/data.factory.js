;(function () {
'use strict';

angular.module('dataFactory', ['authFactory', 'firebase'])

.factory('data', ['$rootScope', '$firebase', '$q', function ($rootScope, $firebase, $q){

  var url = 'https://when1021.firebaseio.com/';
  var query = function(){
    return '?auth=' + $rootScope.user.token;
  };

  return {
    getEventsForUser : function(cb){
      var sync = $firebase(new Firebase(url + 'users/' + $rootScope.user.uid ));
      return sync.$asObject();
    },
    addParticipant : function(cal, id) {
      return $firebase(new Firebase(url+'events/'+id +'/participants')).$push(cal);
    },
    getParticipant : function(id, user) {
      return $firebase(new Firebase(url+'events/'+id+'/participants/'+user)).$asObject();
    },
    addEvent : function(event, cb){
      var id, name = event.name;
      $firebase(new Firebase(url+'events')).$push(event)
      .then(function(ref) {
        id = ref.key();
        var event = {};
        event[id] = name;
        return $firebase(new Firebase(url+'users/'+$rootScope.user.uid)).$update(event);
      })
      .then(function(ref) {
        cb(id);
      },function(err) {
        console.log('Could not add event', err);
      });
    },
    getEvent : function(id){
      return $firebase(new Firebase(url+'events/'+id)).$asObject();
    },
    removeEvent : function(id) {
      var eventsSync = $firebase(new Firebase(url+'events')),
          userSync = $firebase(new Firebase(url+'users/' + $rootScope.user.uid));

      userSync.$remove(id).then(function(ref) {
        eventsSync.$remove(id);
      }, function(err) {
        console.log("Could not remove event: ", err);
      });
    },
    update : function(id, event) {
      return $firebase(new Firebase(url+'events')).$update(id, event);
    }
  };
}]);
}());
