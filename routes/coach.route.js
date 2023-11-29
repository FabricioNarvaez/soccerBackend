const router = require('express').Router();
const { registerCoach, logInCoach, deleteCoach } = require('../controllers/coach.controller');

router.post('/register', registerCoach);
router.post('/login', logInCoach);
router.delete('/:id', deleteCoach);

module.exports = router;
