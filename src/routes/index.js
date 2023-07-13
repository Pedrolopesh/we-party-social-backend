const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController');

const authMiddleware = require('../middlewares/auth');

router.get('/', (req, res) => {
    res.send('Server is runing')
    console.log('Server ok')
});

router.route('/signup').post(UserController.create);
router.route('/login').post(UserController.login);

router.use(authMiddleware).route('/update/user/:id').put(UserController.update);

module.exports = router;