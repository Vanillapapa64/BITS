import express from "express";
import { Request, Response } from 'express';
import { createPatient, deletePatient, patient } from "../functions/fhir";
import { AppointmentStatus, AppointmentUpdation, getAppointments } from "../functions/appointments";
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
hospitalRouter.get('/getAppointments',async(req:Request,res:Response)=>{
    try{
        const body:number=req.body;
        const response =await getAppointments(body)
        res.json({response})
    }catch(err){
        console.error(err)
        res.status(500).json({err})
    }
})
interface updation{
    id:number,
    status:AppointmentStatus
}
hospitalRouter.put('/updateAppointments',async(req:Request,res:Response)=>{
    try{
        const body:updation=req.body;
        const response =await AppointmentUpdation(body.id,body.status)
        res.json({response})
    }catch(err){
        console.error(err)
        res.status(500).json({err})
    }
})
export default hospitalRouter