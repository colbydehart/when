;(function () {
'use strict';

angular.module('dataFactory', ['authFactory', 'firebase'])

.factory('data', ['$rootScope', '$firebase', '$q', function ($rootScope, $firebase, $q){

  var url = 'https://when1021.firebaseio.com/';
  var query = function(){
    return '?auth=' + $rootScope.user.token;
  };

  return {
    getEventsForUser : function(scope, varName){
      var sync = $firebase(new Firebase(url + 'users/' + $rootScope.user.uid ));
      return sync.$asObject().$bindTo(scope, varName);
    },


    addParticipant : function(cal, id) {
      return $q(function(res, rej) {
        $firebase(new Firebase(url+'events/'+id +'/participants')).$push(cal)
        .then(function(ref) {
          res(ref.key());
        })
        .catch(function(err) {
          rej(err);
        });
      });
    },


    getParticipant : function(id, user, scope, varName) {
      return $firebase(new Firebase(url+'events/'+id+'/participants/'+user))
        .$asObject()
        .$bindTo(scope, varName);
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
      return $q(function(res, rej) {
        var event = $firebase(new Firebase(url+'events/'+id)).$asObject();
        event.$loaded().then(function() {
          if (!event.calendar)
            rej('Event does not exist');
          else
            res(event);
        }).catch(function(err) {
          rej(err);
        });
      });
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
    },

    updateName : function  (id, name) {
      var userSync = $firebase(new Firebase(url+'users/'+$rootScope.user.uid)),
          obj = {};
      obj[id] = name;

      return userSync.$update(obj);
    }
  };
}]);
}());
