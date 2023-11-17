const router = require('express').Router();

router.use('/teams', require('./teams.route'));

module.exports = router;
