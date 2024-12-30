
import express from 'express';
import { Request, Response } from 'express';
import multer from 'multer'
import {  performOCr } from '../functions/ocr';
const userRouter= express.Router();
const upload = multer({ dest: 'uploads/' });
userRouter.post('/ocr',upload.single('file'),async(req:Request,res:Response)=>{
    try{
        if(!req.file){
            res.status(400).json({error:"No file detected"})
            return
        }
        const path=req.file.path
        const text=await performOCr(path)
        res.json({Detected:text})
    }catch(err){
        res.status(500).json({error:"Some error"})
    }
})
// userRouter.post('/ocrpdf',upload.single('file'),async(req:Request,res:Response)=>{
//     try{
//         if(!req.file){
//             res.status(400).json({error:"no pdf found"})
//             return;
//         }
//         const path=req.file.path;
//         const pages=await pdfcount(path)
//         console.log(pages)
//         console.log('working')
//         const text=await OcrPdf(path)
//         console.log(text)
//         res.json({Detected:text})
//     }catch(err){
//         res.status(500).json({error:err})
//     }
// })
export default userRouter