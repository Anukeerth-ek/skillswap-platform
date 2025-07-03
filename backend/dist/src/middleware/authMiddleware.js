"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const jwt = require("jsonwebtoken");
const authenticateUser = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1]; // Expecting "Bearer <token>"
        if (!token) {
            res.status(401).json({ message: "Unauthorized: Token missing" });
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(403).json({ message: "Forbidden: Invalid token" });
        return;
    }
};
exports.authenticateUser = authenticateUser;
