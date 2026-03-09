const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const Article = require("../models/Article");
const Counter = require('../models/Counter');  
const cloudinary = require('cloudinary').v2;

exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Backend controller Error: ", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}
exports.createUser = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({ success: false, message: "Missing fields!" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            role: (role === "admin" || role === "parent") ? role : "parent",
            isVerified: true
        });
        await newUser.save();

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error("Backend createUser Error: ", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        

        await User.findByIdAndDelete(id);

        res.status(200).json({ 
            success: true, 
            message: `User ${user.fullName} deleted successfully` 
        });

    }catch (error) {
        console.error("Backend deleteUser Error: ", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

exports.createArticle = async (req, res) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET
    });

    try {
        const { title, author, date, status } = req.body;
        
        let blocks;
        try {
            blocks = JSON.parse(req.body.content);
        } catch (e) {
            return res.status(400).json({ success: false, error: "Invalid JSON format in content field" });
        }
        const topArticle = await Article.findOne().sort("-article_ID");
        const highestId = topArticle ? topArticle.article_ID : 0;

        const counter = await Counter.findOneAndUpdate(
            { id: 'article_id_sequence' },
            { $set: { seq: highestId + 1 } },
            { new: true, upsert: true }
        );

        const continuous_ID = counter.seq;

        const files = req.files || [];

        let imageCounter = 1;
        const formattedBlocks = [];

        for (const block of blocks) {
            const base = { content_order: block.order };

            if (block.type === "paragraph") {
                formattedBlocks.push({ ...base, content_type: "Parapragh", content: block.text });
            } 
            else if (block.type === "header") {
                formattedBlocks.push({ ...base, content_type: "Header", content: block.text });
            } 
            else if (block.type === "bullet") {
                formattedBlocks.push({ ...base, content_type: "List", content: block.items.join("||") });
            } 
            else if (block.type === "image") {
                const file = files[imageCounter-1 ];
                
                if (file) {
                    const uploadResult = await new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream(
                            {
                                folder: "articles",
                                public_id: `article${continuous_ID}_image${imageCounter}`, 
                                resource_type: "image"
                            },
                            (error, result) => {
                                if (error) reject(error);
                                else resolve(result);
                            }
                        );
                        stream.end(file.buffer);
                    });

                    formattedBlocks.push({ 
                        ...base, 
                        content_type: "Image", 
                        image_url: uploadResult.secure_url 
                    });
                    imageCounter++;
                } else {
                    formattedBlocks.push({ ...base, content_type: "Image", image_url: "" });
                }
            }
        }

        let categoriesArray = [];
        if (req.body.categories) {
            try {
                categoriesArray = JSON.parse(req.body.categories);
            } catch (e) {
                categoriesArray = [req.body.categories];
            }
        }
        // 4. Save to MongoDB
        const newArticle = new Article({
            article_ID: continuous_ID, 
            article_title: title,
            article_author: author,
            publish_date: date || new Date(),
            article_status: status || 'Published',
            categories: categoriesArray,
            content_block: formattedBlocks
        });

        await newArticle.save();
        
        res.status(201).json({ 
            success: true, 
            message: "Article created successfully!",
            article_ID: continuous_ID
        });

    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ 
            success: false, 
            error: error.message,
            tip: "Check if your CLOUDINARY_KEY is correctly set in the .env file."
        });
    }
};

// Get all articles
exports.getallArticle = async (req, res) => {
    try {
        const articles = await Article.find().sort({ publish_date: -1 });

        res.status(200).json({
            success: true,
            count: articles.length,
            data: articles
        });
    } catch (error) {
        console.error("Error fetching articles:", error);
        res.status(500).json({
            success: false,
            error: "Server Error: Could not fetch articles"
        });
    }
};