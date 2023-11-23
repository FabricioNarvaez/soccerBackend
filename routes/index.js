const router = require('express').Router();

router.use('/teams', require('./teams.route'));
router.use('/coaches', require('./coach.route'));

module.exports = router;
