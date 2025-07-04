"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.createUserProfile = exports.updateSessionStatus = void 0;
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../lib/prisma"));
const statusSchema = zod_1.z.object({
    status: zod_1.z.enum(["ACCEPTED", "REJECTED", "COMPLETED"]),
});
const profileSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    bio: zod_1.z.string().optional(),
    avatarUrl: zod_1.z.string().url().optional(),
    timeZone: zod_1.z.string().optional(),
    skillsOffered: zod_1.z.array(zod_1.z.string()).optional(), // Skill IDs
    skillsNeeded: zod_1.z.array(zod_1.z.string()).optional(), // Skill IDs
});
const updateSessionStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const mentorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { id } = req.params;
    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({
            message: "Invalid status",
            errors: parsed.error.format(),
        });
        return;
    }
    const { status } = parsed.data;
    try {
        const session = yield prisma_1.default.session.findFirst({
            where: { id, mentorId },
        });
        if (!session) {
            res.status(404).json({
                message: "Session not found or unauthorized",
            });
            return;
        }
        const updatedSession = yield prisma_1.default.session.update({
            where: { id },
            data: { status: status }, // Cast to 'any' or 'SessionStatus' if imported
        });
        res.status(200).json({ session: updatedSession });
        return;
    }
    catch (error) {
        console.error("Error updating session:", error);
        res.status(500).json({ message: "Server error" });
        return;
    }
});
exports.updateSessionStatus = updateSessionStatus;
const createUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("we are here in backend boyy");
    const userId = "1a3anx-29fdfj";
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const parsed = profileSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({
            message: "Invalid profile data",
            errors: parsed.error.format(),
        });
        return;
    }
    const { name, bio, avatarUrl, timeZone, skillsOffered, skillsNeeded } = parsed.data;
    try {
        // Disconnect existing skills to avoid duplication
        yield prisma_1.default.user.update({
            where: { id: userId },
            data: {
                skillsOffered: { set: [] },
            },
        });
        // Update with new data
        const user = yield prisma_1.default.user.update({
            where: { id: userId },
            data: {
                name,
                bio,
                avatarUrl,
                timeZone,
                skillsOffered: {
                    connect: (skillsOffered === null || skillsOffered === void 0 ? void 0 : skillsOffered.map((id) => ({ id }))) || [],
                },
                // skillsNeeded property removed or adjust according to your schema
            },
            include: {
                skillsOffered: true,
            },
        });
        res.status(200).json({ user });
        return;
    }
    catch (error) {
        console.error("Error creating/updating profile:", error);
        res.status(500).json({ message: "Server error" });
        return;
    }
});
exports.createUserProfile = createUserProfile;
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: { id },
            include: {
                skillsOffered: true,
            },
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ user });
        return;
    }
    catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Server error" });
        return;
    }
});
exports.getUserProfile = getUserProfile;
