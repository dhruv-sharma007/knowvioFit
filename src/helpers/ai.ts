import { GoogleGenAI } from "@google/genai";
import { conf } from "../config/conf";
import { aiPrompt } from "./prompt";

const ai = new GoogleGenAI({ apiKey: conf.geminiKey });

const getAiData = async (data: string) => {
	const response = await ai.models.generateContent({
		model: "gemini-2.0-flash",
		contents: `${aiPrompt} ${data}`,
	});

	return response.text;
};

export { getAiData };
