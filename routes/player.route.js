const router = require('express').Router();
const { createPlayer, getPlayers, getPlayer, updatePlayer } = require('../controllers/player.controller');

router.post('/', createPlayer);
router.get('/all', getPlayers);
router.get('/:playerId', getPlayer);
router.put('/:id', updatePlayer);

module.exports = router;
