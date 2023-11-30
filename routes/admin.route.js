const router = require('express').Router();
const { registerAdmin, logInAdmin, deleteAdmin } = require('../controllers/admin.controller');

router.post('/register', registerAdmin);
router.post('/login', logInAdmin);
router.delete('/:id', deleteAdmin);

module.exports = router;
