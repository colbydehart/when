var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EventSchema = new Schema({
    name: {type: String, required: true},
    user: {type: String, required: true},
    template: [],
    participants: [{name: String, email: String, cal: []}]
});

module.exports = mongoose.model('Event', EventSchema);
