
import express from 'express';
import { Request, Response } from 'express';
import multer from 'multer'
import {  extractBloodReportData, newreport, performOCr, report } from '../functions/ocr';
import { searchParams, searchPatient } from '../functions/fhir';
import { Appointmentscreation, createAppointment } from '../functions/appointments';
import { AIquery, getAIResponse } from '../functions/gemini';
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
        const extracted=extractBloodReportData(text)
        res.json(extracted)
    }catch(err){
        res.status(500).json({error:"Some error"})
    }
})
userRouter.post('/aireport',async(req:Request,res:Response)=>{
    try{
        const body:AIquery=req.body;
        const airesponse=getAIResponse(body)
        res.json({response:airesponse})
    }catch(err){
        res.status(500).json({error:"Some error"})
    }}
)
userRouter.post('/storereport',async(req:Request,res:Response)=>{
    try{
        const body:report=req.body;
        const response=newreport(body)
        res.json({message:response})
    }catch(err){
        res.status(500).json({error:"Some error"})
    }})
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