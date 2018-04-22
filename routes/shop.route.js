const express = require('express');
const router = express.Router();

// Controllers
const ctrlShops = require('../controllers/shops.controller');

router.get('/shops', ctrlShops.getShops);

module.exports = router;