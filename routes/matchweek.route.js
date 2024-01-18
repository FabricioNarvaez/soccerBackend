const router = require('express').Router();
const { createMatchweek, deleteMatchweek, updateMatchweek, getMatchweek} = require('../controllers/matchweek.controller');

router.post('/create', createMatchweek);
router.delete('/:id', deleteMatchweek);
router.put('/:id', updateMatchweek);
router.get('/:id', getMatchweek);
// router.put('/:id', updateTeam);

module.exports = router;
