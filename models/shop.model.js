const mongoose = require('mongoose');
const SchemaPoint = new Schema({
    "type": String,
    "coordinates": [Number]
});
const SchemaShop = mongoose.Schema({
    "picture": String,
    "name": String,
    "email": String,
    "city": String,
    "location": { type: Schema.Types.ObjectId, ref: 'Point' }
});
module.exports = mongoose.model('Shop', SchemaShop);