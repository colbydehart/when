;(function () {
'use strict';

angular.module('calFactory', [])
.factory('cal', ['$rootScope', function($rootScope){
  return {
    newCal : newCal,
    convertDates : convertDates,
    merge : merge
  };

  
  function merge(event, skip) {
    if (!event.participants[0]){
      event.participants = _.values(event.participants);
    }
    var parts = event.participants,
        len = parts.length,
        skipTemp = skip,
        maxSkip = (len*(len+1))/2 - 4,
        result = {
          names : [],
          unavailable : [],
          emails : [],
          calendar : _.cloneDeep(event.calendar)
        };

    for (var i = parts.length-1; i >= 0; i--) {
      var curPart = parts[i];
      if(skipTemp >= len){
        result.unavailable.push({name: curPart.name});
        skipTemp -= len;
      }
      else if(skipTemp === i){
        result.unavailable.push({name: curPart.name});
      }
      else if(curPart.unavailable){
        result.unavailable.push({name: curPart.name});
      }
      else{
        result.names.push({name: curPart.name});
        result.emails.push(curPart.email);
        for (var j = 0; j < curPart.cal.length ; j++) {
          _.merge(result.calendar[j], curPart.cal[j], mergeDays);
        }
      }
    }
    result.emails = result.emails.join(',');

    if(availableDates(result.calendar)){
      return result;
    }
    else if (skip === maxSkip){
      result.impossible = true;
      return result;
    }
    else{
      return merge(event, skip>-1?skip+1:0);
    }
  }

  function availableDates(cal) {
    var res = false;
    for (var i = 0; i < cal.length; i++) {
      if(cal[i].morning || cal[i].noon || cal[i].night){
        res = true;
      }
    }
    return res;
  }

  function mergeDays(a, b) {
    if (_.isString(a)) return a;
    return a && b;
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
