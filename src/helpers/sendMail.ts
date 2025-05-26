import { conf } from "../config/conf";
import logger from "../utils/logger";
import { MailTemplate } from "./OtpMailTemplate";
import nodemailer from "nodemailer";

export const sendMail = async (
	name: string,
	mailId: string,
	verificationLink: string,
) => {
	try {
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: conf.mailId,
				pass: conf.mailPass,
			},
		});

		const template = MailTemplate(name, verificationLink);
		const info = await transporter.sendMail({
			from: `"KNOWVIOFIT" <${conf.mailId}>`,
			to: mailId,
			subject: "Verification - KNOWVIOFIT",
			text: `Hi ${name}, your Verificatin link is here. It's valid for 3 minutes.`,
			html: template,
		});
		// console.log("mail sent", info);
		return info;
	} catch (error: unknown) {
		const err = error as Error;
		logger.error(err.message);
	}
};

