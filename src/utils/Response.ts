import type { ZodError } from "zod";

export type ApiResponse<T> = {
	status: "success" | "error";
	message: string;
	data?: T;
	error?: string | ReturnType<ZodError["flatten"]> | null;
	statusCode?: number;
};

export const successResponse = <T>(
	message: string,
	data?: T,
	statusCode?: number,
): ApiResponse<unknown> => {
	return { status: "success", message, data };
};

export const errorResponse = (
	message: string,
	error?: string | ReturnType<ZodError["flatten"]>,
	statusCode?: number,
): ApiResponse<null> => {
	return { status: "error", message, error: error || null};
};
