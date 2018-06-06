const mongoose = require('mongoose');
const SchemaPreferedShops = mongoose.Schema({
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
module.exports = mongoose.model('PreferedShops', SchemaPreferedShops);