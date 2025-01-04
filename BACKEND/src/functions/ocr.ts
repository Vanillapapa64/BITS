import vision from '@google-cloud/vision'
import fs from 'fs'
import { PDFDocument } from 'pdf-lib';
import path from 'path';

import { fromPath } from 'pdf2pic';
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

// export async function OcrPdf(pdfPath:string,pages:number):Promise<string>{
//     const outputDir = path.dirname(pdfPath);
//     const opts: pdfPoppler.ConvertOptions = {
//         format: 'jpeg', // Explicitly typed as one of the allowed values
//         out_dir: outputDir,
//         out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
//         page: null, // Converts all pages
//       };
//     const allTexts: string[] = [];
//     console.log('started')
//     try{
//         console.log('before poppler')
//         await pdfPoppler.convert(pdfPath,opts)
//         console.log('inside try block')
//         const generatedImages = Array.from({ length: pages }, (_, i) => path.join(outputDir, `${opts.out_prefix}-${i + 1}.jpeg`));
//         console.log('Generated images:', generatedImages);
//         generatedImages.forEach((imagePath) => {
//             if (!fs.existsSync(imagePath)) {
//               console.log(`Image file missing: ${imagePath}`);
//             }
//           });
//           const ocrPromises = generatedImages.map(async (imagePath) => {
//             try {
//               console.log(`Processing OCR for image: ${imagePath}`);
//               const text = await performOCr(imagePath);
//               console.log(`OCR Text for ${imagePath}:`, text);  // Log the text extracted
//               allTexts.push(text);
//             } catch (ocrErr) {
//               console.error(`Error processing OCR for image: ${imagePath}`, ocrErr);
//             }
//           });

//         // Wait for all OCR tasks to complete
//         await Promise.all(ocrPromises);
//         return allTexts.join('\n');
//     }catch(err){
//         throw new Error('error occured')
//     }
// }
// export async function pdfcount(pdfPath:string):Promise<number>{
//     try{
//         const Bytes=fs.readFileSync(pdfPath)
//         const doc=await PDFDocument.load(Bytes)
//         return doc.getPages().length;
//     }catch(err){
//         console.error('Error reading PDF:', err);
//         throw new Error('Failed to get PDF page count');
//     }
// }
// export async function OcrPdf(pdfPath: string): Promise<string> {
//     // Set up pdf2pic converter options
//     const converter = fromPath(pdfPath, {
//       density: 100,      // Image quality (higher density = better quality)
//       format: 'jpeg',    // Output format (can also use 'png' or 'tiff')
//       width: 800,        // Image width
//       height: 800,       // Image height
//     });

//     // Convert all pages to images
//     const numPages = await pdfcount(pdfPath);  
//     const imagePaths: string[] = [];
//     const allTexts: string[] = []
//     try{
//         for (let page = 1; page <= numPages; page++) {
//             const image = await converter(page); 
//             if (image.path) {
//               imagePaths.push(image.path);  // Store the path of the generated image
//             } else {
//                 console.error(`Error: No path returned for page ${page}`);
//                 }
//             }
//             const ocrPromises= imagePaths.map(async(image)=>{
//                 try{
//                     const text=await performOCr(image)
//                     allTexts.push(text)
//                 }catch(err){
//                     console.error(err)
//                 }
//             })
//             await Promise.all(ocrPromises)
//             return allTexts.join('\n')
//     }
//     catch(err){
//         console.error(err)
//         return 'Error during processing';
//     }
// }