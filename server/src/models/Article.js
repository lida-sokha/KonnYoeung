const mongoose = require('mongoose');
const CountSchema = require('./Counter');
const ArticleSchema = new mongoose.Schema({

    article_ID: { type: Number, unique: true },
    article_title: { type: String, required: true },
    article_author: { type: String, required: true },
    publish_date: { type: Date, default: Date.now },
    article_status: { type: String, default: 'Published' },
    categories: [{ 
        type: String,
        enum:['Symtoms', 
            'illness', 
            'Emergency', 
            'First-Aids', 
            'Prevention & Care'],
        required: true,
    }],

    content_block: [{
        _id: false,
        content_order: Number,
        content_type: {
            type: String,
            required: true,
            enum: ['Parapragh', 'Image', 'Header', 'List']
        },
        // For text content (Paragraphs, Headers, Lists)
        content: { type: String },

        image_url: { type: String } 
    }]
}, { timestamps: true });


module.exports = mongoose.model('Article', ArticleSchema, 'Article');