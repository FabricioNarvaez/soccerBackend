const router = require('express').Router();
const { registerAdmin, logInAdmin, deleteAdmin } = require('../controllers/admin.controller');

router.post('/register', registerAdmin);
router.post('/login', logInAdmin);
router.delete('/:adminId', deleteAdmin);

module.exports = router;
