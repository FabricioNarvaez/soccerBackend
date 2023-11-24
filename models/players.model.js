const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema({
	name: String,
	alias: String,
	playerNumber: Number,
	goals: Number,
	yellowCards: Number,
	doubleYellowCard: Number,
	redCards: Number,
	expelledDoubleYellow: Number,
	expelledRed: Number,
	expelledTournament: Boolean,
    cardsPaid: Boolean
});

module.exports = mongoose.model('players', playerSchema);
