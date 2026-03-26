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


exports.getArticleById = async (req, res) => {
    try {
        const article = await Article.findOne({ article_ID: req.params.id });
        if (!article) return res.status(404).json({ message: "Article not found" });

        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const userId = decoded.id || decoded._id;

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