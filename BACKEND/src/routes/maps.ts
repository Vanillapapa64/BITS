import { any } from "zod";
import express from 'express';
import { Request, Response } from 'express';
require('dotenv').config();

import { map } from "../zodtypes";
const mapsroute = express.Router();
const api=process.env.googlemapsapiKey

mapsroute.post('/searchhospital',async(req:Request,res:any)=>{
    console.log("hi from route")
    const {body}=req;
    const safeinput=map.safeParse(body)
    if(!safeinput.success){
        return res.status(400).json({"message":"invalid input/bad request"})
    }
    
    const {userLat,userLng,radius,keyword} = safeinput.data;
    const newuserLat=parseFloat(userLat)
    const newuserLng=parseFloat(userLng)
    fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${newuserLat},${newuserLng}&radius=${radius}&type=hospital&keyword=${encodeURIComponent(keyword)}&key=${api}`)
    .then(response => response.json())
    .then(data => {
        res.json({answer:data.results})
        // Display hospitals on a map or as a list
    })
    .catch(error => console.error('Error fetching places:', error));
    console.log("done")
})
const userLat = 31.599833;
const userLng = 74.933556;
const radius = 5000; // Search radius in meters
const keyword="eye hospital"
fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLat},${userLng}&radius=${radius}&type=hospital&keyword=${encodeURIComponent(keyword)}&key=${api}`)
    .then(response => response.json())
    .then(data => {
        console.log("yoyoyoy")
        data.results.forEach((element:any) => {
            console.log(element.geometry.location)
        });
        // Display hospitals on a map or as a list
    })
    .catch(error => console.error('Error fetching places:', error));

export default mapsroute