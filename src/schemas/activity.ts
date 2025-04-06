import { z } from "zod";
import { EActivityType } from "../interfaces/models";

export const activitySchema = z.object({
	activityType: z.enum([
		EActivityType.CrossFit,
		EActivityType.Cycling,
		EActivityType.Elliptical,
		EActivityType.Hiking,
		EActivityType.Pilates,
		EActivityType.Pilates,
		EActivityType.Rowing,
		EActivityType.Running,
		EActivityType.Swimming,
		EActivityType.Walking,
		EActivityType.Weightlifting,
		EActivityType.Yoga,
		EActivityType.Zumba,
	]),
	// caloriesBurned: z.number().min(1).optional(),
    distance: z.number().min(10).optional(),
    weightUsed: z.number().optional(), // in meters
    reps: z.number().min(1).optional(),
    sets: z.number().min(1).optional(),
	time: z.number().min(1), // in minutes
});
