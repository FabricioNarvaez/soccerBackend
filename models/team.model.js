const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = new Schema({
	name: String,
	acronym: String,
	PG: Number,
	PP: Number,
	PE: Number,
	GF: Number,
	GC: Number,
	shield: String,
	group: String,
	players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Jugador' }],
	coach: { type: mongoose.Types.ObjectId },
});

module.exports = mongoose.model('teams', teamSchema);
