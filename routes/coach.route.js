const router = require('express').Router();
const { registerCoach, logInCoach, deleteCoach } = require('../controllers/coach.controller');

router.post('/register', registerCoach);
router.post('/login', logInCoach);
router.delete('/:coachId', deleteCoach);

module.exports = router;
