const router = require('express').Router();
const { getMatch, getMatches, deleteMatch, saveMatch, updateMatch } = require('../controllers/match.controller');

router.post('/', saveMatch);
router.get('/all', getMatches);
router.get('/:id', getMatch);
router.delete('/:id', deleteMatch);
router.put('/:id', updateMatch);

module.exports = router;
