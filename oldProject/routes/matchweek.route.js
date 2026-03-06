const router = require('express').Router();
const {
	createMatchweek,
	deleteMatchweek,
	updateMatchweek,
	getMatchweek,
	getAllMatchweeks,
	// getLastMatchWeekResults,
} = require('../controllers/matchweek.controller');

router.post('/create', createMatchweek);
router.delete('/:id', deleteMatchweek);
router.put('/:id', updateMatchweek);
router.get('/all', getAllMatchweeks);
// router.get('last-results', getLastMatchWeekResults);
router.get('/last-results', getAllMatchweeks);
router.get('/:id', getMatchweek);

module.exports = router;
