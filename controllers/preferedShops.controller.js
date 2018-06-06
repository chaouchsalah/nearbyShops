const mongoose = require('mongoose');

// Import the models needed
const Shops = mongoose.model('PreferedShops');
const User = mongoose.model('User');
const Shop = mongoose.model('Shop');

function getUser() {
    const authorization = req.headers.authorization;
    const token = authorization.substring(authorization.indexOf(" ") + 1, authorization.length);
    const user = getUserDetails(token);
    return user._id;
}
exports.getPreferedShops = async(req, res) => {
    const user = getUser();
    await User.findById(user).exec().catch((err) => {
        res.json({ 'success': false, 'message': 'User not found' });
    });
    Shops.find({ user: user }).exec((err, shops) => {
        if (err) res.json({ 'success': false, 'message': err });
        res.json({ 'success': true, 'message': 'Prefered shops fetched successfully', shops });
    })
}

exports.addPreferedShop = async(req, res) => {
    const user = getUser();
    const shop = req.params.shop;
    await User.findById(user).exec().catch((err) => {
        res.json({ 'success': false, 'message': 'User not found' });
    });
    await Shop.findById(shop).exec().catch((err) => {
        res.json({ 'success': false, 'message': 'Shop not found' });
    });
    let preferedShop = new Shops();
    preferedShop.user = user;
    preferedShop.shop = shop;
    preferedShop.save((err) => {
        if (err) res.json({ 'success': false, 'message': err });
        res.json({ 'success': true, 'message': 'Shop added successfully' });
    })
}