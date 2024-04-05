const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const coachSchema = new Schema({
	name: String,
	userName: String,
    email: String,
    phoneNumber: Number,
	password: String,
    validated: Boolean
});

module.exports = mongoose.model('coaches', coachSchema);
