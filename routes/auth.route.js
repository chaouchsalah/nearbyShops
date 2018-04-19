const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const auth = jwt({
    secret: 'SECRET',
    userProperty: 'payload'
});

// Controllers
const ctrlAuth = require('../controllers/authentification.controller');


// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;