const router = require('express').Router();
const { getTeams, createTeam, updateTeam, deleteTeam } = require('../controllers/team.controller');

router.get('/all', getTeams);
router.post('/create', createTeam);
router.put('/:id', updateTeam);
router.delete('/:id', deleteTeam);

module.exports = router;
