const router = require('express').Router();
const { getTeams, createTeam, updateTeam, deleteTeam } = require('../controllers/team.controller');

router.get('/', getTeams);
router.post('/', createTeam);
router.put('/:id', updateTeam);
router.delete('/:id', deleteTeam);

module.exports = router;
