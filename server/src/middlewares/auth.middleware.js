const jwt = require("jsonwebtoken");
const { deflate } = require("zlib");

const protect = async (req, res, next) => {
    const fromCookie = req.cookies?.token;
    const authHeader = req.headers?.authorization;
    const fromHeader = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : undefined;
    const token = fromCookie || fromHeader;

    if (!token) return res.status(401).json({ message: "No token" });

    try {
        const secret = process.env.JWT_SECRET || "temp_secret";
        const decoded = jwt.verify(token, secret);
        req.user = { id: decoded.id || decoded._id };
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// If you forget this line, 'protect' will be undefined in your route!
module.exports = { protect };