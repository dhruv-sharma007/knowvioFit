import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { conf } from "../config/conf";
import { AppError } from "../utils/ApiError";
import { User } from "../models/user.model";
import { getCache, setCache } from "../cache/cache";
import { asyncHandler } from "../utils/asyncHandler";

export const authMiddleware = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const accessToken = req.cookies.accessToken;

		if (!accessToken) {
			throw new AppError("Access token missing", 403);
		}

		let decoded: jwt.JwtPayload;
		try {
			decoded = jwt.verify(
				accessToken,
				conf.accessTokenSecret,
			) as jwt.JwtPayload;
		} catch {
			throw new AppError("Invalid or expired token", 403);
		}

		const email = decoded.email;
		if (!email) {
			throw new AppError("Invalid token payload", 400);
		}

		const userData = getCache(email);
		let user = userData ? JSON.parse(userData as string) : null;

		if (!user) {
			user = await User.findOne({ email });
			if (!user) throw new AppError("User not found", 404);
			setCache(email, JSON.stringify(user));
		}

		if (!user.isVerified) {
			throw new AppError("User not verified", 403);
		}

		(req as any).user = user;
		next();
	},
);
