import { Activity } from "../models/activity.model";
import type { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/Response";
import { activitySchema } from "../schemas/activity";
import { calculateBurnedCalories } from "../helpers/algorithms";
import { Profile } from "../models/profile.model";
import { getCache, setCache } from "../cache/cache";

const createActivity = async (req: Request, res: Response) => {
	const result = activitySchema.safeParse(req.body);
	if (!result.success) {
		return res
			.status(400)
			.json(
				errorResponse("Please provide correct field", result.error.flatten()),
			);
	}
	const { activityType, distance, weightUsed, reps, sets, time } = result.data;

	const data: Record<string, any> = {};

	if (activityType) data.activityType = activityType;
	// if (caloriesBurned) data.caloriesBurned = caloriesBurned;
	if (distance) data.distance = distance;
	if (weightUsed) data.weightUsed = weightUsed;
	if (reps) data.reps = reps;
	if (sets) data.sets = sets;
	if (time) data.time = time;

	const userId = req.user._id;
	const profile = await Profile.findOne({ userId });
	const calories = calculateBurnedCalories(activityType, profile?.weight, time);

	data.userId = userId;
	data.caloriesBurned = calories;
	try {
		const activity = await Activity.create(data);
		return res.status(201).json(successResponse("Activity created", activity));
	} catch (error) {
		const err = error as Error;
		return res
			.status(500)
			.json(errorResponse("Error creating activity", err.message));
	}
};

const getActivities = async (req: Request, res: Response) => {
	const page = Number.parseInt(req.query.page as string) || 1;
	const limit = Number.parseInt(req.query.limit as string) || 10;
	const skip = (page - 1) * limit;

	const userId = req.user._id;

	const cacheKey = `activities_${userId}_${page}_${limit}`;
	const rawCache = getCache(cacheKey);

	if (rawCache) {
		try {
			const cachedActivities = String(rawCache);
			return res.status(200).json(
				successResponse("Activities fetched from cache", JSON.parse(cachedActivities))
			);
		} catch (error) {
			console.error("Failed to parse cached data:", error);
		}
	}

	const activities = await Activity.find({ userId })
		.skip(skip)
		.limit(limit)
		.sort({ createdAt: -1 });

	if (!activities || activities.length === 0) {
		return res
			.status(404)
			.json(errorResponse("No activities found for this user"));
	}

	const totalActivities = await Activity.countDocuments({ userId });
	const totalPages = Math.ceil(totalActivities / limit);
	const response = {
		activities,
		page,
		limit,
		totalPages,
		totalActivities,
	};

	setCache(cacheKey, JSON.stringify(response));

	return res.status(200).json(successResponse("Activities fetched", response));
};


export { createActivity, getActivities };
