const Article = require('../models/Article'); 
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RecentActivity = require('../models/RecentActivity');
exports.getAllArticle = async (req, res) => {
    try {
        const articles = await Article.find(); 
        res.status(200).json(articles);
    }
    catch (error) {
        console.error("Backend Controller Error:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// exports.getArticleById = async (req, res) => {
//     try {
//         const article = await Article.findOne({ article_ID: req.params.id });
        
//         if (!article) {
//             return res.status(404).json({ message: "Article not found in dataset" });
//         }
//         if (req.user) {
//             await RecentActivity.create({
//                 user: req.user._id,
//                 actionType: 'READ_ARTICLE',
//                 metadata: {
//                     title: article.article_title || article.title, 
//                     entityId: article._id,
//                     link: `/articles/${article.article_ID}`
//                 }
//             });
//         }
//         res.status(200).json(article);
//     } catch (error) {
//         console.error("Error fetching article by ID:", error.message);
//         res.status(500).json({ message: "Server Error", error: error.message });
//     }
// };
exports.getArticleById = async (req, res) => {
    try {
        const article = await Article.findOne({ article_ID: req.params.id });
        if (!article) return res.status(404).json({ message: "Article not found" });

        // 1. Manually check for the token we just added in the frontend API.js
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            try {
                // 2. Decode the token to get the user ID
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const userId = decoded.id || decoded._id;

                // 3. Create the activity record
                await RecentActivity.create({
                    user: userId,
                    actionType: 'READ_ARTICLE',
                    metadata: {
                        title: article.article_title,
                        entityId: article._id,
                        link: `/articles/${article.article_ID}`
                    }
                });
                console.log(`Activity saved for user: ${userId}`);
            } catch (err) {
                console.log("Token invalid or expired, viewing as guest.");
            }
        } else {
            console.log("No token found in headers, viewing as guest.");
        }

        res.status(200).json(article);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
};