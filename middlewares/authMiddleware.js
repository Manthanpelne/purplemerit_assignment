const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
       
        let token = req.headers.authorization

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token provided" });
        }

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        // 3. Attach user to request (excluding password)
        const currentUser = await User.findById(decoded.id).select("-password");
        
        if (!currentUser) {
            return res.status(401).json({ message: "The user belonging to this token no longer exists" });
        }

        req.user = currentUser;
        next();
    } catch (error) {
        // Distinguish between an expired token and a fake one
        const message = error.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
        res.status(401).json({ message, error: error.message });
    }
};

module.exports = protect;