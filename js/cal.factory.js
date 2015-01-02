;(function () {
'use strict';

angular.module('calFactory', [])
.factory('cal', ['$rootScope', function($rootScope){
  return {
    newCal : newCal,
    convertDates : convertDates,
    merge : merge
  };

  function merge(event) {
    var result = {
      names : [],
      calendar : _.clone(event.calendar)
    }, 
        len = result.calendar.length;

    angular.forEach(event.participants, function(val, key) {
      result.names.push({name: val.name});
      for (var i = 0; i < len; i++) {
        var curDay = val.cal[i],
            resDay = result.calendar[i];
        _.merge(resDay, curDay, function(a, b) {
          if (_.isString(a)) return a;
          return a && b;
        });
      }

    });

    return result;
    
  }
  function convertDates(cal) {
    return _.values(cal).map(function(item) {
      return new Date(item);
    });
  }
  function newCal(start, end) {
    var cal = [];
    var today = start;
    var i = 0;
    while (+today < +end){
      cal[i] = {
        date : today.toDateString(),
        morning : true,
        noon : true,
        night : true
      };
      today.setDate(today.getDate()+1);
      i++;
    }
    return cal;
  }

}]);
}());
