import express from "express";
import { Request, Response } from 'express';
import { createPatient, deletePatient, patient } from "../functions/fhir";
const hospitalRouter=express.Router();
hospitalRouter.post('/newpatient',async(req:Request,res:Response)=>{
    try{
        const body:patient=req.body;
        const response=await createPatient(body)
        res.json({response})
    }catch(err){
        console.error(err)
        res.status(500).json({err})
    }
})
hospitalRouter.delete('/deletepatient',async(req:Request,res:Response)=>{
    try{
        const body:string=req.body;
        const response=await deletePatient(body)
        res.json({response})
    }catch(err){
        console.error(err)
        res.status(500).json({err})
    }
})