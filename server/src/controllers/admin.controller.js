const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const Article = require("../models/Article");
const Hospital = require("../models/Hospital");
const Counter = require('../models/Counter');  
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');

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

exports.getArticleById = async (req, res) => {
    try {
        const { id } = req.params;

        const numericId = parseInt(id);

        if (isNaN(numericId)) {
            return res.status(400).json({
                success: false,
                error: "Article ID must be a number"
            });
        }

        const article = await Article.findOne({ article_ID: numericId });

        if (!article) {
            return res.status(404).json({
                success: false,
                error: `Article with ID ${id} not found`
            });
        }

        res.status(200).json({
            success: true,
            data: article
        });

    } catch (error) {
        console.error("Error fetching single article:", error);
        res.status(500).json({
            success: false,
            error: "Server Error: Could not fetch article"
        });
    }
};

exports.deleteArticle = async (req, res) => {
    try {
        const { id } = req.params;

        const article = await Article.findOne({
            $or: [
                { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
                { article_ID: !isNaN(id) ? parseInt(id) : null }
            ].filter(c => Object.values(c)[0] !== null)
        });

        if (!article) {
            return res.status(404).json({ success: false, message: "Article not found" });
        }

        await Article.findByIdAndDelete(article._id);

        res.status(200).json({ 
            success: true, 
            message: `Article "${article.article_title}" deleted successfully` 
        });

    } catch (error) {
        console.error("Delete Article Error:", error.message);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

exports.updateArticle = async (req, res) => {
    try {
        const { id } = req.params;
        
        let updateData = { ...req.body };

        if (req.body.content_block) {
            try {
                updateData.content_block = typeof req.body.content_block === 'string' 
                    ? JSON.parse(req.body.content_block) 
                    : req.body.content_block;
            } catch (e) {
                console.error("JSON Parse Error on content_block:", e);
            }
        }

        if (req.body.categories) {
            try {
                updateData.categories = typeof req.body.categories === 'string' 
                    ? JSON.parse(req.body.categories) 
                    : req.body.categories;
            } catch (e) {
                console.error("JSON Parse Error on categories:", e);
            }
        }

        const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
        const query = isObjectId 
            ? { _id: id } 
            : { article_ID: !isNaN(id) ? parseInt(id) : -1 };

        const updatedArticle = await Article.findOneAndUpdate(
            query, 
            { $set: updateData }, 
            { new: true, runValidators: true }
        );

        if (!updatedArticle) {
            return res.status(404).json({ success: false, message: "Article not found" });
        }

        res.status(200).json({ success: true, data: updatedArticle });

    } catch (error) {
        console.error("SERVER ERROR DURING UPDATE:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getallHospital = async (req, res) => {
    try {
        const hospitals = await Hospital.find();
        res.status(200).json({
            success: true,
            count: hospitals.length,
            data: hospitals
        });
    } catch (error) {
         console.error("Error fetching hospitals:", error);
        res.status(500).json({
            success: false,
            error: "Server Error: Could not fetch hospital"
        });
    }
}


exports.AddHospital = async (req, res) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET
    });

    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: "Image is required" });
        }

        const hospitalId = new mongoose.Types.ObjectId();

        const fileBase64 = req.file.buffer.toString('base64');
        const fileUri = `data:${req.file.mimetype};base64,${fileBase64}`;

        const uploadRes = await cloudinary.uploader.upload(fileUri, {
            folder: 'hospitals',
            public_id: hospitalId.toString(), 
            overwrite: true
        });

        const newHospital = new Hospital({
            ...req.body,
            _id: hospitalId, 
            image: `hospitals/${hospitalId}`, 
            latitude: Number(req.body.latitude),
            longitude: Number(req.body.longitude),
            is_24h_service: req.body.is_24h_service === 'true'
        });

        const savedHospital = await newHospital.save();

        res.status(201).json({
            success: true,
            data: savedHospital
        });

    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.DeleteHospital = async (req, res) => {
    try {
        const { id } = req.params;

        const hospital = await Hospital.findById(id);

        if (!hospital) {
            return res.status(404).json({ 
                success: false, 
                message: "Hospital not found" 
            });
        }

        try {
            await cloudinary.uploader.destroy(`hospitals/${id}`);
        } catch (cloudinaryErr) {
            console.error("Cloudinary error (non-fatal):", cloudinaryErr);
        }

        await Hospital.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Hospital and associated image deleted successfully"
        });

    } catch (error) {
        console.error("Delete Controller Error:", error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};