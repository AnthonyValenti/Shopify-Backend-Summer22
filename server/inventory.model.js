const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const inventorySchema = new Schema({
    serial: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    price: {type: Number, required: true, min: 0},
    stock: {type: Number, required: true, min: 0,
        validate:{
            validator: Number.isInteger,
            message: 'Must be integer value'
        }
    },
},{
    versionKey: false
});

const Inventory = mongoose.model('Inventory',inventorySchema);

module.exports = Inventory;