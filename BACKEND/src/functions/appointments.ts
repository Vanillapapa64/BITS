export enum AppointmentStatus {
    Scheduled="Scheduled",
    Completed="Completed",
    Cancelled="Cancelled",
    NoShow="NoShow"
}
export interface Appointmentscreation{
    patientId:number,
    hospitalId: number;       
    time: string;              // ISO 8601 date-time string
    severity?: Severity;     
}
export enum Severity {
    Low = "Low",
    Medium = "Medium",
    High = "High",
    Emergency = "Emergency",
}
export interface user{
    username:string,
    password:string,
    age:number,
    gender:Gender 
}
export enum Gender{
    None="None",
    Male="Male",
    Female="Female"
}
import { Prisma, PrismaClient } from "@prisma/client";
const prisma=new PrismaClient()
export async function newuser(x:user) {
    try {
        await prisma.$connect();
        const response=await prisma.user.create({
            data:{
                username:x.username,
                password:x.password,
                age:x.age,
                gender:x.gender
            }

        })
        return response.id
    } catch (error) {
        return new Error("error creating user")
    }
}
export async function createAppointment(inputs:Appointmentscreation) {
    try{
        await prisma.$connect();
        const creation=await prisma.appointments.create({
            data:{
                patientId:inputs.patientId,
                hospitalId:inputs.hospitalId,
                time:inputs.time,
                severity:inputs.severity
            }
        })
        return (await creation).id
    }catch(err){
        console.error(err)
        throw new Error("error creating appointment")
    }finally{
        await prisma.$disconnect()
    }
}
export async function AppointmentUpdation(id:number,status:AppointmentStatus) {
    try{
        await prisma.$connect();
        const updation=await prisma.appointments.update({
            where:{
                id:id
            },
            data:{
                status:status
            }
        })
        return (await updation).id
    }catch(err){
        console.error(err)
        throw new Error("error updating appointment")
    }finally{
        await prisma.$disconnect()
    }
}
export async function deleteAppointment(id:number) {
    try{
        await prisma.$connect();
        const deletion=await prisma.appointments.delete({
            where:{
                id:id
            }
        })
        return 
    }catch(err){
        console.error(err)
        throw new Error("error deleting appointment")
    }finally{
        await prisma.$disconnect()
    }
}
export async function getAppointments(hospitalId:number) {
    try{
        await prisma.$connect();
        const get=await prisma.appointments.findMany({
            where:{
                hospitalId:hospitalId
            }
        })
        return get
    }catch(err){
        console.error(err)
        throw new Error("error fetching appointment")
    }finally{
        await prisma.$disconnect()
    }
}