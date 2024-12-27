import vision from '@google-cloud/vision'
import { error } from 'console';
import fs from 'fs'

const client=new vision.ImageAnnotatorClient({
    keyFilename:'../BACKEND/high-age-414007-819123641f45.json'
})
async function performOCr(imagepath:string){
    try{
        const [result]= await client.textDetection({
            image: { content: fs.readFileSync(imagepath) },
            
        });
        const textAnnotations = result.textAnnotations;
        if (textAnnotations && textAnnotations.length > 0) {
            const fullText = textAnnotations[0].description;
            
            return(fullText);
          } else {
            throw error
          }
        
        } catch (error) {
            throw error;
        }
}
performOCr('image.png')