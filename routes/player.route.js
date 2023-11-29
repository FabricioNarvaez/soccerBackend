const router = require('express').Router();
const { createPlayer, getPlayers, getPlayer, updatePlayer, deleteTeam} = require('../controllers/player.controller');

router.post('/', createPlayer);
router.get('/all', getPlayers);
router.get('/:playerId', getPlayer);
router.put('/:id', updatePlayer);
router.delete('/:id', deleteTeam);

module.exports = router;
