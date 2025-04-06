import type { Request, Response } from "express";
import { AiInsights } from "../models/aiInsights.model";
import { delCache, getCache, setCache } from "../cache/cache";
import { errorResponse, successResponse } from "../utils/Response";
import Goal from "../models/goal.model";
import { getAiData } from "../helpers/ai";
import { Activity } from "../models/activity.model";
import { Profile } from "../models/profile.model";

const getAiInsights = async (req: Request, res: Response) => {
	const userId = req.user._id;
	const key = `${userId}:ai`;

	const rawCache = getCache(key);

	if (rawCache) {
		try {
			const parsedCache = JSON.parse(String(rawCache));
			return res
				.status(200)
				.json(successResponse("Activities fetched from cache", parsedCache));
		} catch (err) {
			console.error("Cache JSON parse error:", err);
		}
	}

	const aiData = await AiInsights.findOne({ userId });

	if (aiData) {
		setCache(key, JSON.stringify(aiData));
		return res
			.status(200)
			.json(successResponse("AI Insights data fetched successfully", aiData));
	}

	// Main AI functionality
	const goal = await Goal.findOne({ userId });
	const activity = await Activity.find({ userId });
	const profile = await Profile.findOne({ userId });
	if (!profile) {
		return res.status(404).json(errorResponse("Please first create a profile"));
	}
	if (!activity || activity.length === 0) {
		return res
			.status(404)
			.json(errorResponse("Please first create an activity"));
	}
	if (!goal) {
		return res.status(404).json(errorResponse("Please first create a goal"));
	}

	const prompt = `${goal}\n${activity}\n{profile}`;
	const response = await getAiData(String(prompt));

	const data = String(response);
	console.log(data);

	if (response) {
		const cleaned = data
			.replace(/```json\s*/g, "")
			.replace(/```/g, "")
			.trim();

		const { workOutSuggestion, progressiveAnalysis, motivationalMessage } =
			JSON.parse(cleaned);

		const aiInsights = await AiInsights.create({
			userId,
			workOutSuggestion,
			progressiveAnalysis,
			motivationalMessage,
		});
		setCache(key, JSON.stringify(aiInsights));

		return res
			.status(200)
			.json(
				successResponse("AI Insights data fetched successfully", aiInsights),
			);
	}

	return res
		.status(500)
		.json(errorResponse("Something went wrong while fetching data from ai"));
};

const deleteAiInsights = async (req: Request, res: Response) => {
	const userId = req.user._id;
	const key = `${userId}:ai`;

	const aiInsight = await AiInsights.findOneAndDelete({ userId });
	delCache(key);
	if (!aiInsight) {
		return res.status(404).json(errorResponse("No ai data found"));
	}
	return res.status(200).json(successResponse("Ai data Deleted"));
};

export { getAiInsights, deleteAiInsights };
