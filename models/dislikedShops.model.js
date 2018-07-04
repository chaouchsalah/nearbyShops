const mongoose = require('mongoose');
const SchemaDislikedShops = mongoose.Schema({
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
module.exports = mongoose.model('DislikedShops', SchemaDislikedShops);