import {
	registerUser,
	verifyEmail,
	login,
	logout,
	deleteAccount,
} from "../controllers/user.controller";
import {
	createProfile,
	editProfile,
	getProfile,
} from "../controllers/profile.controller";
import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createGoal, getGoal, completeGoal } from "../controllers/goal.controller";
import { asyncHandler } from "../utils/asyncHandler";
import {
	createActivity,
	getActivities,
} from "../controllers/acivity.controller";
import { getAiInsights } from "../controllers/aiInsights.controller";

const router = express.Router();

// Auth Routes

router.get("/verifyemail/:id", asyncHandler(verifyEmail));
router.post("/register", asyncHandler(registerUser));
router.post("/login", asyncHandler(login));
router.get("/logout", authMiddleware, asyncHandler(logout));
router.get("/deleteuser", authMiddleware, asyncHandler(deleteAccount));

// Profile Routes
router.post("/createprofile", authMiddleware, asyncHandler(createProfile));
router.post("/editProfile", authMiddleware, asyncHandler(editProfile));
router.get("/getProfile", authMiddleware, asyncHandler(getProfile));

// Goal Routes
router.post("/createGoal", authMiddleware, asyncHandler(createGoal));
router.get("/getGoal", authMiddleware, asyncHandler(getGoal));
router.post("/completeGoal/:goalId", authMiddleware, asyncHandler(completeGoal));

// Activity Routes
router.post("/createActivity", authMiddleware, asyncHandler(createActivity));
router.get("/get-activities", authMiddleware, asyncHandler(getActivities));
// Ai Insights Routes

router.get("/get-ai-insights", authMiddleware, asyncHandler(getAiInsights));

export default router;
