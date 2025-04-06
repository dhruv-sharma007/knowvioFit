import type { CookieOptions, Request, Response } from "express";
import { User } from "../models/user.model";
import { loginSchema, signUpSchema, verificationShema } from "../schemas/auth";
import { errorResponse, successResponse } from "../utils/Response";
import { AppError } from "../utils/ApiError";
import { nanoid } from "nanoid";
import { sendMail } from "../helpers/sendMail";
import { conf } from "../config/conf";
import logger from "../utils/logger";
import type { IUser } from "../interfaces/models";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { delCache } from "../cache/cache";

const registerUser = async (req: Request, res: Response) => {
	const result = signUpSchema.safeParse(req.body);
	if (!result.success) {
		return res
			.status(400)
			.json(
				errorResponse("please provide correct field", result.error.flatten()),
			);
	}

	const { name, email, password } = result.data;

	const existingUser = await User.findOne({ email });

	if (existingUser) {
		return res.status(400).json(new AppError("Usre already exist", 400));
	}
	const payload = {
		email,
	};
	const verificationToken = await jwt.sign(payload, conf.verificationSecret);

	const verificationId = nanoid(7);

	let user: IUser;

	try {
		user = await User.create({
			name,
			email,
			password,
			verificationToken,
			verificationId,
		});
	} catch (err) {
		const error = err as Error;
		logger.error(error.message);
		return res.status(400).json(new AppError("Error in registering user", 500));
	}

	try {
		const sendEmail = await sendMail(
			name,
			email,
			`${conf.backendUrl}/api/v1/user/verifyemail/${verificationId}`,
		);
		if (sendEmail?.rejected.length) {
			return res.status(500).json(new AppError("Email id is not valid", 400));
		}

		return res
			.status(201)
			.cookie("verificationToken", verificationToken)
			.json(
				successResponse(
					"User created successfully please check your email or spam box to verify",
				),
			);
	} catch (err) {
		const error = err as Error;
		logger.error(error.message);
		return res.status(400).json(new AppError(error.message, 500));
	}
};

const verifyEmail = async (req: Request, res: Response) => {
	const result = verificationShema.safeParse(req.params);
	if (!result.success) {
		res
			.status(400)
			.json(
				errorResponse("Please provide correct field", result.error.flatten()),
			);
	}

	const verificationId = result?.data?.id;
	const verificationToken = req.cookies?.verificationToken;

	if (!verificationToken) {
		return res.status(400).json(errorResponse("Verification token is missing"));
	}

	let decodedToken: string | JwtPayload;
	try {
		decodedToken = jwt.verify(verificationToken, conf.verificationSecret);
	} catch (error) {
		return res.status(401).json(errorResponse("Invalid or expired token"));
	}

	const { email } = decodedToken as { email: string };

	const user = await User.findOne({ email, verificationId }); // extra load

	if (!user) {
		return res.status(404).json(errorResponse("User not found"));
	}

	if (user.isVerified) {
		return res.status(400).json(errorResponse("User already verified"));
	}

	user.isVerified = true;
	await user.save();

	return res
		.status(200)
		.clearCookie("verificationToken")
		.json(successResponse("Email verified successfully"));
};

const login = async (req: Request, res: Response) => {
	const result = loginSchema.safeParse(req.body);
	if (!result.success) {
		return res
			.status(400)
			.json(
				errorResponse("Please provide correct field", result.error.flatten()),
			);
	}
	const { email, password } = result.data;

	const user = await User.findOne({ email });

	if (!user) {
		return res.status(404).json(errorResponse("User not found"));
	}
	if (!user.isVerified) {
		return res.status(400).json(errorResponse("User is not valid"));
	}
	const isPasswordValidate = await user.verifyPassword(password);

	if (!isPasswordValidate) {
		return res.status(400).json(errorResponse("Incorrect password"));
	}

	const payload = {
		id: user.id,
		email: user.email,
	};
	const options: CookieOptions = {
		httpOnly: true,
		sameSite: "strict",
		secure: true,
		maxAge: 24 * 60 * 60 * 1000,
	};
	const accessToken = await jwt.sign(payload, conf.accessTokenSecret);

	res
		.status(200)
		.cookie("accessToken", accessToken, options)
		.json(successResponse("user successfully logged in"));
};

const logout = async (req: Request, res: Response): Promise<void> => {
	res
		.status(200)
		.clearCookie("accessToken")
		.json(successResponse("User logged out successfully"));
};

const deleteAccount = async (req: Request, res: Response) => {
	const email = req.user.email;

	const user = await User.findOneAndDelete({ email });

	if (!user) {
		return res
			.status(200)
			.clearCookie("accessToken")
			.json(successResponse("User logged out successfully"));
	}
	delCache(user.email);

	return res
		.status(200)
		.clearCookie("accessToken")
		.json(successResponse("User deleted successfully"));
};

const getCurrentUser = async (req: Request, res: Response) => {
	const userId = req.user._id;
	try {
		const user = await User.findById(userId);
		return res
			.status(200)
			.json(successResponse("User Fetched successfully", user));
	} catch (err) {
		const error = err as Error
		return res.status(200).json(errorResponse(error.message));
	}
};

export { registerUser, verifyEmail, login, logout, deleteAccount, getCurrentUser };
