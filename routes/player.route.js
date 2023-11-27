const router = require('express').Router();
const { createPlayer, getPlayers,  getPlayer } = require('../controllers/player.controller');

router.post('/', createPlayer);
router.get('/all', getPlayers);
router.get('/:playerId', getPlayer);

module.exports = router;
