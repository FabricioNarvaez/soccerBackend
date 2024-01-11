const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const matchSchema = new Schema({
	hour: Date,
	localId: { type: mongoose.Types.ObjectId },
	visitorId: { type: mongoose.Types.ObjectId },
	localGoals: Number,
	visitorGoals: Number,
	finished: Boolean,
});

module.exports = mongoose.model('matches', matchSchema);
