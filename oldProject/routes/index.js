const router = require('express').Router();

router.use('/teams', require('./team.route'));
router.use('/coaches', require('./coach.route'));
router.use('/admins', require('./admin.route'));
router.use('/players', require('./player.route'));
router.use('/matches', require('./match.route'));
router.use('/matchweek', require('./matchweek.route'));

module.exports = router;
