const router = require('express').Router();
const TeamController = require('../controllers/team.controller');

router.get('/', TeamController.getTeams);
router.post('/', TeamController.save);
router.put('/:teamId', TeamController.update);
router.delete('/:teamId', TeamController.delete);

module.exports = router;
