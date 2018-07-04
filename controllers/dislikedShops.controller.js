const mongoose = require('mongoose');
const atob = require('atob');

// Import the models needed
const Shops = mongoose.model('DislikedShops');
const User = mongoose.model('User');
const Shop = mongoose.model('Shop');

// Fetch the user id from the token
function getUser(req) {
    const authorization = req.headers.authorization;
    const token = authorization.substring(authorization.indexOf(" ") + 1, authorization.length);
    const user = getUserDetails(token);
    return user._id;
}

exports.addDislikedShop = async(req, res) => {
        const user = getUser(req);
        const shop = req.params.shop;
        await User.findById(user).exec().catch((err) => {
            res.json({ 'success': false, 'message': 'User not found' });
        });
        await Shop.findById(shop).exec().catch((err) => {
            res.json({ 'success': false, 'message': 'Shop not found' });
        });
        let dislikedShop = new Shops();
        dislikedShop.user = user;
        dislikedShop.shop = shop;
        dislikedShop.save((err) => {
            if (err) res.json({ 'success': false, 'message': err });
            setTimeout(function() {
                removeDislikedShop(dislikedShop._id, res);
            }, 120 * 3600 /* Time to be disliked for */ );
            res.json({ 'success': true, 'message': 'Disliked Shop added successfully' });
        })
    }
    // After time end remove it from collection
removeDislikedShop = async(id, res) => {
    Shops.findByIdAndRemove(id).exec().catch((err) => {
        res.json({ 'success': false, 'message': err });
    });
}

function getUserDetails(token) {
    let payload;
    if (token) {
        payload = token.split('.')[1];
        payload = atob(payload);
        return JSON.parse(payload);
    } else {
        return null;
    }
}