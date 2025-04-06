import dotenv from "dotenv";
dotenv.config();

export const conf = {
	port: String(process.env.PORT),
	dbUri: String(process.env.DB_URI),
	clientUrl: String(process.env.CLIENT_URL),
	dbName: "knowvioFit",
	extraDbUri: "?retryWrites=true&w=majority",
	cookierSecret: String(process.env.COOKIE_SECRET),
	mailId: String(process.env.MAIL_ID),
	mailPass: String(process.env.MAIL_PASS),
	backendUrl: String(process.env.BACKEND_URI),
	verificationSecret: String(process.env.VERIFY_SECRET),
	accessTokenSecret: String(process.env.ACCESS_SECRET),
	geminiKey: String(process.env.URL_FOR_MAGIC_LINK),
};
