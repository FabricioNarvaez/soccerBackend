const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const matchWeekSchema = new Schema({
	matchweek: Number,
	date: Date,
	matches: [{ type: mongoose.Schema.Types.ObjectId }],
});

module.exports = mongoose.model('matchweeks', matchWeekSchema);
