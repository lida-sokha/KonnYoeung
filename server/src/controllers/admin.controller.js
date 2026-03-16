const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const Article = require("../models/Article");
const Hospital = require("../models/Hospital");
// const Disease = require('../models/Disease');
const Activity = require("../models/Activity");
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

        try {
            await Activity.create({
                action: `New user registration: ${fullName}`,
                user: newUser._id, 
                type: 'registration'
            });
        } catch (activityError) {
            console.error("Activity Logging Failed: ", activityError.message);
        }

        res.status(201).json({
            success: true,
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
            const rawContent = req.body.content_blocks || req.body.content; 
            blocks = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent;
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
            const base = { content_order: block.content_order || block.order};
            const type = (block.type || block.content_type || "").toLowerCase();

            if (type === "parapragh" || type === "paragraph") {
                formattedBlocks.push({ ...base, content_type: "Parapragh", content: block.text });
            } 
            else if (type === "header") {
                formattedBlocks.push({ ...base, content_type: "Header", content: block.text });
            } 
            else if (type === "bullet") {
                formattedBlocks.push({ ...base, content_type: "List", content: block.items.join("||") });
            } 
            else if (   type === "image") {
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
            content_blocks: formattedBlocks
        });

        await newArticle.save();
        
        try {
            await Activity.create({
                action: `Published a new article: ${newArticle.article_title}`, 
                user: req.user ? req.user._id : null, 
                article: newArticle._id,
                type: 'article_published'
            });
        } catch (activityError) {
            console.error("Activity Logging Failed: ", activityError.message);
        }
        
        res.status(201).json({ 
            success: true, 
            message: "Article created successfully!",
            article_ID: continuous_ID,
            data: newArticle
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

        const blocks = req.body.content_blocks || req.body.content_block;
        if (blocks) {
            updateData.content_blocks = typeof blocks === 'string' 
                ? JSON.parse(blocks) 
                : blocks;
            
            delete updateData.content_block;
        }

        if (req.body.categories) {
            updateData.categories = typeof req.body.categories === 'string' 
                ? JSON.parse(req.body.categories) 
                : req.body.categories;
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

        try {
            await Activity.create({
                action: `Added new hospital: ${newHospital.name || req.body.name}`, 
                user: req.user?._id || null, 
                hospital: newHospital._id,
                type: 'hospital_added'
            });
            console.log("Activity logged successfully");
        } catch (activityError) {
            console.error("Activity Logging Failed: ", activityError.message);
        }

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
exports.UpdateHospital = async (req, res) => {
    try {
        const { id } = req.params;
        
        let hospital = await Hospital.findById(id);
        if (!hospital) {
            return res.status(404).json({ success: false, message: "Hospital not found" });
        }

        let updateData = {
            ...req.body,
            latitude: req.body.latitude ? Number(req.body.latitude) : hospital.latitude,
            longitude: req.body.longitude ? Number(req.body.longitude) : hospital.longitude,
            is_24h_service: req.body.is_24h_service === 'true'
        };

        if (req.file) {
            const fileBase64 = req.file.buffer.toString('base64');
            const fileUri = `data:${req.file.mimetype};base64,${fileBase64}`;

            await cloudinary.uploader.upload(fileUri, {
                folder: 'hospitals',
                public_id: id, 
                overwrite: true
            });
            
            updateData.image = `hospitals/${id}`;
        }

        const updatedHospital = await Hospital.findByIdAndUpdate(
            id, 
            { $set: updateData }, 
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Hospital updated successfully",
            data: updatedHospital
        });

    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getHospitalById = async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.params.id);
        
        if (!hospital) {
            return res.status(404).json({ success: false, message: "Hospital not found" });
        }

        res.status(200).json({
            success: true,
            data: hospital
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const [userCount, hospitalCount, articleCount] = await Promise.all([
            User.countDocuments(),
            Hospital.countDocuments(),
            // Disease.countDocuments(),
            Article.countDocuments()
        ]);
        console.log({ userCount, hospitalCount, articleCount });
        res.status(200).json({
            success: true,
            data: {
                users: userCount,
                hospitals: hospitalCount,
                // diseases: diseaseCount,
                articles: articleCount
            }
        });
    } catch (error) {
        console.error("Stats Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch dashboard statistics",
            error: error.message 
        });
    }
};

exports.getDashboardChartData = async (req, res) => {
    try {
        const stats = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const start = new Date(d.setHours(0,0,0,0));
            const end = new Date(d.setHours(23,59,59,999));

            const [h, a, u] = await Promise.all([
                Hospital.countDocuments({ createdAt: { $gte: start, $lte: end } }),
                Article.countDocuments({ createdAt: { $gte: start, $lte: end } }),
                User.countDocuments({ createdAt: { $gte: start, $lte: end } })
            ]);

            stats.push({
                day: start.toLocaleDateString('en-US', { weekday: 'short' }),
                hospitals: h,
                articles: a,
                users: u
            });
        }
        res.status(200).json({ success: true, data: stats });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getRecentActivities = async (req, res) => {
    try {
        const activities = await Activity.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('user', 'fullName')   // Check: Does User model have 'fullName'?
            .populate('hospital', 'name')   // Check: Does Hospital model have 'name'?
            .populate('article', 'article_title'); // Check: Does Article model have 'article_title'?

        res.status(200).json({ success: true, data: activities });
    } catch (error) {
        console.error("GET ACTIVITIES ERROR:", error); // Check your VS CODE TERMINAL for this!
        res.status(500).json({ success: false, error: error.message });
    }
};