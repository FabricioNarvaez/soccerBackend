const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const coachSchema = new Schema({
	name: String,
	password: String,
	userName: String,
});

module.exports = mongoose.model('coaches', coachSchema);
