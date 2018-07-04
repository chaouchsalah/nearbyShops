const express = require('express');
const router = express.Router();

// Controllers
const ctrlShops = require('../controllers/preferedShops.controller');

router.get('/preferedShops', ctrlShops.getPreferedShops);
router.post('/preferedShops/:shop', ctrlShops.addPreferedShop);
router.delete('/preferedShops/:shop', ctrlShops.removePreferedShop);

module.exports = router;