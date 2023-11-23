const router = require('express').Router();
const CoachController = require('../controllers/coach.controller');

router.post('/register', CoachController.registerCoach);
router.post('/login', CoachController.logInCoach);

module.exports = router;
