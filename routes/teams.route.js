const router = require('express').Router();
const { getTeams, createTeam, updateTeam, deleteTeam } = require('../controllers/team.controller');

router.get('/', getTeams);
router.post('/', createTeam);
router.put('/:teamId', updateTeam);
router.delete('/:teamId', deleteTeam);

module.exports = router;
