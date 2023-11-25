const router = require('express').Router();

router.use('/teams', require('./teams.route'));
router.use('/coaches', require('./coach.route'));
router.use('/admins', require('./admin.route'));
router.use('/players', require('./player.route'));

module.exports = router;
