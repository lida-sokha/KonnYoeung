const jwt = require("jsonwebtoken");
const { deflate } = require("zlib");

const protect = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "No token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// If you forget this line, 'protect' will be undefined in your route!
module.exports = { protect };