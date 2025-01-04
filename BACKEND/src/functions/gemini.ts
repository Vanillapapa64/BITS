import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { log } from "node:console";
import { string } from "zod";

dotenv.config();

const API = process.env.GEMINI_KEY;
// console.log(API);

async function getAIResponse(query:string) {
    try {
        // Initialize the Google Generative AI client
        const genAI = new GoogleGenerativeAI(API || " ");

        // Get the specific generative model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Generate content based on the query
        const result = await model.generateContent(query);

        // Return the text response
        return result.response.text();
    } catch (error) {
        console.error("Error generating AI response:", error);
        throw error; // Re-throw the error for the caller to handle
    }
}
