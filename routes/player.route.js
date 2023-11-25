const router = require('express').Router();
const { createPlayer, getPlayer } = require('../controllers/player.controller');

router.post('/', createPlayer);
router.get('/:playerId', getPlayer);

module.exports = router;
