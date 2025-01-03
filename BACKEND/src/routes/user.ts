
import express from 'express';
import { Request, Response } from 'express';
import multer from 'multer'
import {  performOCr } from '../functions/ocr';
import { searchParams, searchPatient } from '../functions/fhir';
import { Appointmentscreation, createAppointment } from '../functions/appointments';
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
userRouter.get('/fetch',async(req:Request,res:Response)=>{
    try{
        
        const body:searchParams=req.body;
        
        const response= await searchPatient(body)
        res.json({response:response})
    }catch(err){
        console.error(err)
        res.status(500).json({error:err})
    }
})
userRouter.post('/newAppointment',async(req:Request,res:Response)=>{
    try{
        const body:Appointmentscreation=req.body;
        const creation=await createAppointment(body)
        res.json({id:creation})
    }catch(err){
        console.error(err)
        res.status(500).json({error:err})
    }
})
export default userRouter