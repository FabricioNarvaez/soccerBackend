const router = require('express').Router();
const { createMatchweek, deleteMatchweek } = require('../controllers/matchweek.controller');

router.post('/create', createMatchweek);
router.delete('/:id', deleteMatchweek);
// router.get('/', getMatchweek);
// router.put('/:id', updateTeam);

module.exports = router;