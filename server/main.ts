/** biome-ignore-all assist/source/organizeImports: <'explanation'> */
import { Elysia, status, t } from "elysia";
import { GoogleGenAI } from "@google/genai";
import { instruction } from "./instruction";
import cors from "@elysiajs/cors";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const app = new Elysia()
	.use(cors({ origin: "*", credentials: true }))
	.get("/", () => ({ hello: "Bun👋" }))
	.post(
		"/joke",
		async ({ body }) => {
			const { content, category } = body;
			const prompt = content?.trim()
				? content
				: category?.trim()
					? `Generate a random joke based on the category: ${category}`
					: null;

			if (!prompt)
				return status(400, { message: "Please provide content or category" });

			const response = await ai.models.generateContent({
				model: "gemini-2.5-flash-lite",
				config: {
					thinkingConfig: {
						thinkingBudget: 0,
					},
					systemInstruction: instruction,
				},
				contents: [{ text: prompt }],
			});

			const joke =
				response.candidates?.[0]?.content?.parts?.[0]?.text ??
				"No joke found. Try again later";

			return { message: joke };
		},
		{
			body: t.Object({
				content: t.Optional(t.String()),
				category: t.Optional(t.String()),
			}),
		},
	)
	.listen(3000);
