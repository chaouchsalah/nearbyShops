const mongoose = require('mongoose');
const atob = require('atob');

// Import the models needed
const Shops = mongoose.model('PreferedShops');
const User = mongoose.model('User');
const Shop = mongoose.model('Shop');

function getUser(req) {
    const authorization = req.headers.authorization;
    const token = authorization.substring(authorization.indexOf(" ") + 1, authorization.length);
    const user = getUserDetails(token);
    return user._id;
}
exports.getPreferedShops = async(req, res) => {
    const user = getUser(req);
    await User.findById(user).exec().catch((err) => {
        res.json({ 'success': false, 'message': 'User not found' });
    });
    const preferedShops = await Shops.find({ user: user }).exec().then((shops) => {
        return shops;
    }).catch((err) => {
        res.json({ 'success': false, 'message': err });
    });
    let shopsId = [];
    for (let i = 0; i < preferedShops.length; i++) {
        shopsId.push(preferedShops[i].shop);
    }
    Shop.find({ '_id': { $in: shopsId } }).exec().then((shops) => {
        res.json({ 'success': true, 'message': 'Prefered shops fetched successfully', shops });
    }).catch((err) => {
        res.json({ 'success': false, 'message': err });
    });
}

exports.addPreferedShop = async(req, res) => {
    const user = getUser(req);
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
exports.removePreferedShop = async(req, res) => {
    const user = getUser(req);
    const shop = req.params.shop;
    await User.findById(user).exec().catch((err) => {
        res.json({ 'success': false, 'message': 'User not found' });
    });
    await Shop.findById(shop).exec().catch((err) => {
        res.json({ 'success': false, 'message': 'Shop not found' });
    });
    Shops.remove({ 'shop': shop }).exec().then(() => {
        res.json({ 'success': true, 'message': 'Shop removed successfully' });
    }).catch((err) => {
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