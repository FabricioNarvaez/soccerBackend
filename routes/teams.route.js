const router = require('express').Router();
const TeamModel = require('../models/team.model');

router.get('/', async (req, res)=>{
    try {
        const teams = await TeamModel.find();
        res.json(teams);
    } catch (error) {
        res.status(500).json({error: error});
    }
});

router.post('/', async (req, res) => {
    try {
        const newTeam = await TeamModel.create(req.body);
        res.json(newTeam);
    } catch (error) {
        res.status(500).json({error: error});
    }
});

router.put('/:teamId', async(req, res)=>{
    try {
        const teamId = req.params.teamId;
        const updateObject = req.body;
        const teamEdit = await TeamModel.findByIdAndUpdate(teamId, updateObject, {new: true});
        res.json(teamEdit);
    } catch (error) {
        res.status(500).json({error: error});
    }
});

module.exports = router;