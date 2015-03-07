// jshint expr:true
describe("Factory", function(){
  describe("Authentication", function(){
    beforeEach(module('authFactory'));
    var $auth;
    beforeEach(inject(function(auth) {
      $auth = auth;
    }));
    it("should exist", function(){
      $auth.should.exist;
    });
  });

  describe("Data", function(){
    beforeEach(module('dataFactory'));
    var $data;
    beforeEach(inject(function(data) {
      $data = data;
    }));
    it("should exist", function(){
      $data.should.exist;
    });
  });

  describe("Cal", function(){
    beforeEach(module('calFactory'));
    var $cal;
    beforeEach(inject(function(cal) {
      $cal = cal;
    }));
    it("should exist", function(){
      $cal.should.exist;
    });

    var calendar;
    beforeEach(function() {
      calendar = createCal();
    });

    it("should create calendars", function(){
      calendar.length.should.equal(7);
      calendar[0].should.have.keys('noon', 'morning', 'night', 'date');
    });
    it("should be able to make date objects", function(){
      var dates = $cal.convertDates(calendar);
      dates[0].should.be.an.instanceOf(Date);
    });

    describe("Merging", function(){
      var event;
      beforeEach(function() {
        event = {
          calendar : createCal(),
          participants : createParticipants()
        };
      });
      it("Should merge regularly", function(){
        var colby = event.participants.colby.cal[0];
        var haley = event.participants.haley.cal[1];
        colby.morning = colby.noon = colby.night = false;
        haley.morning = haley.noon = haley.night = false;
        var merged= $cal.merge(event);

        merged.should.contain.keys('names', 'unavailable', 'emails', 'calendar');
        merged.calendar[0].morning.should.equal(false);
        merged.calendar[1].morning.should.equal(false);
        merged.calendar[2].morning.should.equal(true);
        merged.unavailable.should.contain({name: 'unavailable'});
        merged.names.should.contain({name: 'colby'},{name: 'haley'});
      });
      it("Should handle impossible events", function(){
        var colby = event.participants.colby.cal,
            haley = event.participants.haley.cal,
            i;
        for (i = 0; i < 4; i++) {
          colby[i].morning = colby[i].noon = colby[i].night = false;
        }
        for (i = 3; i < 7; i++) {
          haley[i].morning = haley[i].noon = haley[i].night = false;
        }
        var merged= $cal.merge(event);
        merged.impossible.should.equal(true);
        merged.unavailable.should.have.length(3);
      });
      it("should optimize merging", function(){
        var colby = event.participants.colby.cal,
            haley = event.participants.haley.cal,
            i;
        for (i = 0; i < 4; i++) {
          colby[i].morning = colby[i].noon = colby[i].night = false;
        }
        for (i = 4; i < 7; i++) {
          haley[i].morning = haley[i].noon = haley[i].night = false;
        }
        var dan = event.participants.dan = createParticipant('dan', 'd.an', false);
        for (i = 3; i < 5; i++) {
          dan.cal[i].morning = dan.cal[i].night = dan.cal[i].noon = false;
        }
        var merged;
        for (i = 0; i < 5; i++) {
          merged = $cal.merge(_.cloneDeep(event));
          merged.unavailable.should.contain({name:'colby'});
        }
        merged.unavailable.should.have.length(2);
        merged.names.should.have.length(2);
      });
    });

    function createCal() {
      var firstDay = new Date(),
          firstDayHolder = _.cloneDeep(firstDay),
          nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate()+7);
      return $cal.newCal(firstDay, nextWeek);
    }

    function createParticipants() {
      var unavailable, colby, haley;
      unavailable = createParticipant('unavailable', 'unavailab.le', true);
      colby = createParticipant('colby', 'col.by', false);
      haley = createParticipant('haley', 'hal.ey', false);
      return {
        unavailable : unavailable,
        colby : colby,
        haley : haley
      };
    }
    function createParticipant(name, email, unavailable) {
      return {
        name : name,
        email : email,
        cal : createCal(),
        unavailable : unavailable
      };
    }
  });
});
