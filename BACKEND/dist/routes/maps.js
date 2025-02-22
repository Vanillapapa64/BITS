"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require('dotenv').config();
const zodtypes_1 = require("../zodtypes");
const mapsroute = express_1.default.Router();
const api = process.env.googlemapsapiKey;
mapsroute.post('/searchhospital', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("hi from route");
    const { body } = req;
    const safeinput = zodtypes_1.map.safeParse(body);
    if (!safeinput.success) {
        return res.status(400).json({ "message": "invalid input/bad request" });
    }
    const { userLat, userLng, radius, keyword } = safeinput.data;
    const newuserLat = parseFloat(userLat);
    const newuserLng = parseFloat(userLng);
    fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${newuserLat},${newuserLng}&radius=${radius}&type=hospital&keyword=${encodeURIComponent(keyword)}&key=${api}`)
        .then(response => response.json())
        .then(data => {
        res.json({ answer: data.results });
        // Display hospitals on a map or as a list
    })
        .catch(error => console.error('Error fetching places:', error));
    console.log("done");
}));
exports.default = mapsroute;
