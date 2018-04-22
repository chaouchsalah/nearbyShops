const mongoose = require('mongoose');
const SchemaShop = mongoose.Schema({
    "picture": String,
    "name": String,
    "email": String,
    "city": String,
    "location": {
        "type": String,
        "coordinates": [String]
    }
}, { collection: 'shops' });
module.exports = mongoose.model('Shop', SchemaShop);