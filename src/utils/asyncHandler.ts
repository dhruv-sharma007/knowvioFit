import type { Request, Response, NextFunction } from "express";

type TAsyncHandler = (
	req: Request,
	res: Response,
	next: NextFunction,
) => Promise<void>;

export const asyncHandler =
	(fn: TAsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
