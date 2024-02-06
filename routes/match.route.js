const router = require('express').Router();
const { getMatch, getMatches, deleteMatch, createMatch, updateMatch } = require('../controllers/match.controller');

router.post('/create', createMatch);
router.get('/all', getMatches);
router.get('/:id', getMatch);
router.delete('/:id', deleteMatch);
router.put('/:id', updateMatch);

module.exports = router;
