const PlayerModel = require('../models/player.model');
const { updateController, deleteController } = require('./common.controllers');

const createPlayer = async (req, res) => {
	try {
		const { name, playerNumber, alias } = req.body;
		const newPlayerObject = {
			name,
			playerNumber,
			alias,
			goals: 0,
			yellowCards: 0,
			doubleYellowCard: 0,
			redCards: 0,
			expelledDoubleYellow: 0,
			expelledRed: 0,
			expelledTournament: false,
			cardsPaid: true,
		};

		const playerCreated = await PlayerModel.create(newPlayerObject);
		res.json(playerCreated);
	} catch (error) {
		res.status(500).json({ error: error });
	}
};

const getPlayer = async (req, res) => {
	try {
		const playerId = req.params.playerId;
		const playerFounded = await PlayerModel.findById(playerId).lean();
		res.status(200).send({
			status: 'success',
			player: playerFounded,
		});
	} catch (error) {
		res.status(500).json({ error: error });
	}
};

const getPlayers = async (req, res) => {
	try {
		const playersFounded = await PlayerModel.find().lean();
		if (playersFounded.length > 1) playersFounded.sort((a, b) => b.goals - a.goals);

		res.status(200).send({
			status: 'success',
			players: playersFounded,
		});
	} catch (error) {
		res.status(500).json({ error: error });
	}
};

const updatePlayer = async (req, res) => {
	updateController(req, res, PlayerModel);
};

const deleteTeam = async (req, res) => {
	deleteController(req, res, PlayerModel);
};

module.exports = { createPlayer, getPlayer, getPlayers, updatePlayer, deleteTeam };
