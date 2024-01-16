const router = require('express').Router();
const { createMatchweek  } = require('../controllers/matchweek.controller');

router.post('/create', createMatchweek);
// router.get('/', getMatchweek);
// router.put('/:id', updateTeam);
// router.delete('/:id', deleteTeam);

module.exports = router;