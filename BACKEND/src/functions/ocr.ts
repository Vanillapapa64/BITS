import vision from '@google-cloud/vision'
import fs from 'fs'
import { PDFDocument } from 'pdf-lib';
import path from 'path';

import { fromPath } from 'pdf2pic';
import { Prisma, PrismaClient } from '@prisma/client';
const prisma=new PrismaClient()
const client=new vision.ImageAnnotatorClient({
    keyFilename:'../BACKEND/high-age-414007-819123641f45.json'
})
export async function performOCr(imagepath:string): Promise<string>{
    try{
        const [result]= await client.textDetection({
            image: { content: fs.readFileSync(imagepath) },
            
        });
        const textAnnotations = result.textAnnotations;
        if (textAnnotations && textAnnotations.length > 0) {
            const fullText = textAnnotations[0].description;
            
            return(fullText||'No text detected');
        } else {
        return('No text detected')
        }
        
        } catch (error) {
            console.error('Error during OCR:', error);
            throw new Error('OCR processing failed.');
        }
}
export function extractBloodReportData(text: string): {
    hemoglobin: number | null;
    rbcCount: number | null;
    mcv: number | null;

    lymphocytes: number | null;
    date: string | null;
    totalLeukocyteCount:number| null
  } {
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
export interface report{
    patientId:number
    hemoglobin: number | null;
    rbcCount: number | null;
    mcv: number | null;
    summary:string
    lymphocytes: number | null;
    date: string | null;
    totalLeukocyteCount:number| null
}
export async function newreport(inputs:report) {
  try{
    await prisma.$connect();
    const response=await prisma.medicalRecord.create({
      data:{
        patientId:inputs.patientId,
        hemoglobin:inputs.hemoglobin,
        rbcCount:inputs.rbcCount,
        mcv:inputs.mcv,
        lymphocytes:inputs.lymphocytes,
        reportDate:inputs.date,
        leukocyte:inputs.totalLeukocyteCount,
        summary:inputs.summary
      }
    })
    return response.id
  }catch(err){
    throw new Error("error creating medical report")
  }finally{
    await prisma.$disconnect();
  }
}