const PlayerModel = require('../models/players.model');

const createPlayer = async (req, res) => {
    try{
        const {name, playerNumber, alias} = req.body;
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
            cardsPaid: true
        }

        const playerCreated = await PlayerModel.create(newPlayerObject);
        res.json(playerCreated);
    } catch (error) {
		res.status(500).json({ error: error });
	}
};

module.exports = { createPlayer };