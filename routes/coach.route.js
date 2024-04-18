const router = require('express').Router();
const { registerCoach, loginCoach, deleteCoach, getTeamInfo } = require('../controllers/coach.controller');

router.post('/register', registerCoach);
router.post('/login', loginCoach);
router.delete('/:id', deleteCoach);
router.get('/team/:id', getTeamInfo);

module.exports = router;
