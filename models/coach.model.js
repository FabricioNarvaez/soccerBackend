const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const coachSchema = new Schema({
	name: String,
	username: String,
    email: String,
    phoneNumber: Number,
	password: String,
    validated: Boolean
});

module.exports = mongoose.model('coaches', coachSchema);
