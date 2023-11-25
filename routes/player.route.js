const router = require('express').Router();
const { createPlayer } = require('../controllers/player.controller');

router.post('/', createPlayer);

module.exports = router;
