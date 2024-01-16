'use strict';

const MatchweekModel = require('../models/matchweek.model');
const { updateController, deleteController } = require('./common.controllers');

const createMatchweek = async (req, res) => {
    try {
        const { matchweek, date } = req.body;
        const newMatchWeekToInsert = {
            matchweek,
            date,
            matches: []
        }
        const insertedMatchWeek = await MatchweekModel.create(newMatchWeekToInsert);
		res.json(insertedMatchWeek);
    } catch (error) {
		res.status(500).json({ error: error });
	}
};

// const updateMatchweek = async (req, res) => {
// 	updateController(req, res, MatchweekModel);
// };

// const deleteMatchweek = async (req, res) => {
// 	deleteController(req, res, MatchweekModel);
// };

module.exports = { createMatchweek };