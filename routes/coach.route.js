const router = require('express').Router();
const { registerCoach, logInCoach, deleteCoach, getTeamInfo } = require('../controllers/coach.controller');

router.post('/register', registerCoach);
router.post('/login', logInCoach);
router.delete('/:id', deleteCoach);
router.get('/team/:id', getTeamInfo);

module.exports = router;
