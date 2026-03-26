const mongoose = require('mongoose');

const recentActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  actionType: {
    type: String, 
    enum: ['READ_ARTICLE', 'VIEWED_HOSPITAL', 'SEARCHED', 'LOGIN'], 
    required: true
  },
  metadata: {
    title: String,     
    entityId: mongoose.Schema.Types.ObjectId, 
    link: String       
  }
}, { timestamps: true });

module.exports = mongoose.model('RecentActivity', recentActivitySchema);