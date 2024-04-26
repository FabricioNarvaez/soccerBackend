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
	teamPhoto: String,
	group: String,
	color: String,
	players: [{ type: mongoose.Schema.Types.ObjectId }],
	coach: { type: mongoose.Types.ObjectId },
	TAM: Number,
	TAZ: Number,
	DAM: Number,
	TRO: Number
});

module.exports = mongoose.model('teams', teamSchema);
