const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController');

router.get('/', (req, res) => {
    res.send('Server is runing')
    console.log('Server ok')
});

router.route('/signup').post(UserController.create);
// router.route('/login').post(UserController.login);

module.exports = router;