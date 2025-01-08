import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const API = process.env.GEMINI_KEY;
// console.log(API);
export interface AIquery{
    age:number,
    gender:string,
    hemoglobin: number | null;
    rbcCount: number | null;
    mcv: number | null;
    summary:string
    lymphocytes: number | null;
    date: string | null;
    totalLeukocyteCount:number| null
}
export async function getAIResponse(query:AIquery) {
    try {
        // Initialize the Google Generative AI client
        const genAI = new GoogleGenerativeAI(API || " ");

        // Get the specific generative model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const newquery=`
    You are a helpful medical assistant who will summarize the medical blood test report for the patient.
    Patient Details:
    - Age: ${query.age}
    - Gender: ${query.gender}
    - Report Date: ${query.date || "N/A"}
    
    Blood Test Results:
    - Hemoglobin: ${query.hemoglobin !== null ? query.hemoglobin + " g/dL" : "N/A"}
    - RBC Count: ${query.rbcCount !== null ? query.rbcCount + " million/mm³" : "N/A"}
    - MCV: ${query.mcv !== null ? query.mcv + " fL" : "N/A"}
    - Total Leukocyte Count (TLC): ${query.totalLeukocyteCount !== null ? query.totalLeukocyteCount + " thousand/mm³" : "N/A"}
    - Lymphocytes: ${query.lymphocytes !== null ? query.lymphocytes + " thousand/mm³" : "N/A"}
    
    Summary:
    ${query.summary || "Please analyze the above data and provide helpful insights about the patient's condition."}

    Provide:
    - A concise summary of the report in simple language.
    - Key observations and potential health implications.
    - Suggestions for improvement, if applicable.
    `;
        // Generate content based on the query
        const result = await model.generateContent(newquery);

        // Return the text response
        return result.response.text();
    } catch (error) {
        console.error("Error generating AI response:", error);
        throw error; // Re-throw the error for the caller to handle
    }
}
