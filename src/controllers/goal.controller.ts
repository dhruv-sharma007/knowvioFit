import Goal from "../models/goal.model";
import type { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/Response";
import { goalSchema } from "../schemas/goal";

const createGoal = async (req: Request, res: Response) => {
	const result = goalSchema.safeParse(req.body);
	if (!result.success) {
		return res
			.status(400)
			.json(
				errorResponse("Please provide correct field", result.error.flatten()),
			);
	}
	const { targetValue, progress, goalType, startDate, endDate, description } =
		result.data;
	const userId = req.user._id;
	const goal = await Goal.create({
		userId,
		targetValue,
		progress,
		goalType,
		startDate,
		endDate,
		description,
	});
	return res.status(201).json(successResponse("Goal created", goal));
};
const getGoal = async (req: Request, res: Response) => {
	const userId = req.user._id;

	const goal = await Goal.findOne({ userId });
	if (!goal) {
		return res
			.status(404)
			.json(errorResponse("Goal not found" ));
	}

	return res
		.status(200)
		.json(successResponse("Goals fetched successfully", goal));
};

const isGoalCompleted = async (req: Request, res: Response) => {
	const userId = req.user._id;
	const { goalId } = req.params;

	const goal = await Goal.findOne({ userId, _id: goalId });
};

export { createGoal, getGoal };
