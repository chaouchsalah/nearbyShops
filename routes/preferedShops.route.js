const express = require('express');
const router = express.Router();

// Controllers
const ctrlShops = require('../controllers/preferedShops.controller');

router.get('/preferedShops', ctrlShops.getPreferedShops);
router.post('/preferedShops/:shop', ctrlShops.addPreferedShop);

module.exports = router;