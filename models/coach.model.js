const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const coachSchema = new Schema({
	name: String,
	dni: String,
    email: String,
    phoneNumber: Number,
	password: String,
    validated: Boolean
});

module.exports = mongoose.model('coaches', coachSchema);
