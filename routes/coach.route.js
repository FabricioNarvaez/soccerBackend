const router = require('express').Router();
const { registerCoach, logInCoach } = require('../controllers/coach.controller');

router.post('/register', registerCoach);
router.post('/login', logInCoach);

module.exports = router;
