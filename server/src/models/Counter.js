const mongoose = require('mongoose');
const CountSchema = new mongoose.Schema({
    id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});
module.exports = mongoose.model('Counter', CountSchema);