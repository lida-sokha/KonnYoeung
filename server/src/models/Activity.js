const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    action: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
    article:{type:mongoose.Schema.Types.ObjectId,ref:'Article'},
    type: String,
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Activity', activitySchema);