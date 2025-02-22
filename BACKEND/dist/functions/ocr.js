"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.performOCr = performOCr;
exports.extractBloodReportData = extractBloodReportData;
const vision_1 = __importDefault(require("@google-cloud/vision"));
const fs_1 = __importDefault(require("fs"));
const client = new vision_1.default.ImageAnnotatorClient({
    keyFilename: '../BACKEND/high-age-414007-819123641f45.json'
});
function performOCr(imagepath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [result] = yield client.textDetection({
                image: { content: fs_1.default.readFileSync(imagepath) },
            });
            const textAnnotations = result.textAnnotations;
            if (textAnnotations && textAnnotations.length > 0) {
                const fullText = textAnnotations[0].description;
                return (fullText || 'No text detected');
            }
            else {
                return ('No text detected');
            }
        }
        catch (error) {
            console.error('Error during OCR:', error);
            throw new Error('OCR processing failed.');
        }
    });
}
function extractBloodReportData(text) {
    const hemoglobinMatch = text.match(/Hemoglobin\s+([\d.]+)/i);
    const hemoglobin = hemoglobinMatch ? parseFloat(hemoglobinMatch[1].trim()) : null;
    const rbcMatch = text.match(/RBC\s*Count\s+([\d.]+)/i);
    const rbcCount = rbcMatch ? parseFloat(rbcMatch[1].trim()) : null;
    const mcvMatch = text.match(/MCV\s+([\d.]+)/i);
    const mcv = mcvMatch ? parseFloat(mcvMatch[1].trim()) : null;
    const tlcMatch = text.match(/Total\s*Leukocyte\s*Count\s*\(TLC\)\s+([\d.]+)/i);
    const totalLeukocyteCount = tlcMatch ? parseFloat(tlcMatch[1].trim()) : null;
    const absLymphocytesMatch = text.match(/Lymphocytes\s+([\d.]+)\s*thou\/mm3/i);
    const lymphocytes = absLymphocytesMatch ? parseFloat(absLymphocytesMatch[1].trim()) : null;
    const dateMatch = text.match(/(\d{2}\/\d{1,2}\/\d{4})/);
    const date = dateMatch ? dateMatch[1] : null;
    return {
        hemoglobin,
        rbcCount,
        mcv,
        totalLeukocyteCount,
        lymphocytes,
        date
    };
}
