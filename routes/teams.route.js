const router = require('express').Router();
const TeamModel = require('../models/team.model');

router.get('/', async (req, res)=>{
    try {
        const teams = await TeamModel.find();
        res.json(teams);
    } catch (error) {
        res.status(500).json({error: "No ha sido posible obtener los equipos."});
    }
})

module.exports = router;