const router = require('express').Router();
const { registerAdmin, logInAdmin } = require('../controllers/admin.controller');

router.post('/register', registerAdmin);
router.post('/login', logInAdmin);

module.exports = router;
