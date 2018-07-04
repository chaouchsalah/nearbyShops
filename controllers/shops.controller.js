const mongoose = require('mongoose');
const axios = require('axios');
const atob = require('atob');

// Import the models needed
const Shop = mongoose.model('Shop');
const PreferedShops = mongoose.model('PreferedShops');
const DislikedShops = mongoose.model('DislikedShops');

exports.getShops = async(req, res) => {
    const authorization = req.headers.authorization;
    const token = authorization.substring(authorization.indexOf(" ") + 1, authorization.length);
    const user = getUserDetails(token);
    const userId = user._id;
    let ignoredShops = [];
    ignoredShops = await PreferedShops.find({ user: userId }).lean().exec().then((shops) => {
        let shopsId = [];
        for (let i = 0; i < shops.length; i++) {
            shopsId.push(shops[i].shop);
        }
        return shopsId;
    });
    const dislikedShops = await DislikedShops.find({ user: userId }).lean().exec().then((shops) => {
        let shopsId = [];
        for (let i = 0; i < shops.length; i++) {
            shopsId.push(shops[i].shop);
        }
        return shopsId;
    });
    Array.prototype.push.apply(ignoredShops, dislikedShops);
    let shops = await Shop.find({ "_id": { "$nin": ignoredShops } }).lean().exec().then((shops) => {
        return shops;
    }).catch((err) => {
        return res.json({ 'success': false, 'message': err });
    });
    const url = 'http://ip-api.com/json';
    try {
        let response = await axios.get(url);
        response = response.data;
        const lat = response.lat;
        const lon = response.lon;
        for (let i = 0; i < shops.length; i++) {
            const latTarget = shops[i].location.coordinates[1];
            const lonTarget = shops[i].location.coordinates[0];
            const dist = getDistanceFromLatLonInKm(lat, lon, latTarget, lonTarget);
            shops[i].distance = dist;
        }
        shops.sort((firstElem, secondElem) => {
            return firstElem.distance - secondElem.distance;
        });
    } catch (error) {
        console.error('message:' + error);
    }
    return res.json({ 'success': true, 'message': 'Shops fetched successfully', shops });
};

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

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}