const router = require('express').Router();
const { getTeams, getTeamById, createTeam, updateTeam, deleteTeam } = require('../controllers/team.controller');

router.get('/all', getTeams);
router.get('/team/:id', getTeamById);
router.post('/create', createTeam);
router.put('/:id', updateTeam);
router.delete('/:id', deleteTeam);

module.exports = router;
