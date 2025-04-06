import { z } from "zod";
import { EGoalType } from "../interfaces/models";

export const goalSchema = z.object({
	targetValue: z.number().min(1),
	progress: z.number().min(1),
	goalType: z.enum([
		EGoalType.Endurance,
		EGoalType.Flexibility,
		EGoalType.GeneralFitness,
		EGoalType.MuscleGain,
		EGoalType.StrengthTraining,
		EGoalType.WeightLoss,
	]),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    description: z.string().max(200).optional(),
});
