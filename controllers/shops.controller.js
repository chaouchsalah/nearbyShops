const mongoose = require('mongoose');

// Import the shop model
const Shop = mongoose.model('Shop');

exports.getShops = (req, res) => {
    Shop.find().exec((err, shops) => {
        if (err) return res.json({ 'success': false, 'message': err });
        return res.json({ 'success': true, 'message': 'Shops fetched successfully', shops });
    });
};