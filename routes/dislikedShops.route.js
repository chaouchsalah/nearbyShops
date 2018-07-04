const express = require('express');
const router = express.Router();

// Controllers
const ctrlShops = require('../controllers/dislikedShops.controller');

router.post('/dislikedShops/:shop', ctrlShops.addDislikedShop);

module.exports = router;