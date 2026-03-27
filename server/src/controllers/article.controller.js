const Article = require('../models/Article'); 

exports.getAllArticle = async (req, res) => {
    try {
        const articles = await Article.find(); 
        console.log("Article found in DB:", articles.length);
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
        
        if (!article) {
            return res.status(404).json({ message: "Article not found in dataset" });
        }
        res.status(200).json(article);
    } catch (error) {
        console.error("Error fetching article by ID:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};