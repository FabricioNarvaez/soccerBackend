const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const coachSchema = new Schema({
	name: String,
	password: String,
});

module.exports = mongoose.model('coaches', coachSchema);
