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
exports.viewpatient = viewpatient;
const axios_1 = __importDefault(require("axios"));
const { GoogleAuth } = require('google-auth-library');
require('dotenv').config();
const URL = process.env.FHIRbaseurl;
function viewpatient(patient) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield axios_1.default.get(`${URL}/Patient/${patient}`);
            console.log(res.data);
        }
        catch (err) {
            console.error(err);
            throw new Error(`error fetching patient with id ${patient}`);
        }
    });
}
const createPatient = () => __awaiter(void 0, void 0, void 0, function* () {
    const patient = {
        resourceType: "Patient",
        name: [
            {
                use: "official",
                family: "singh",
                given: ["Navkirat"]
            }
        ],
        gender: "male",
        birthDate: "1980-01-01"
    };
    try {
        const auth = new GoogleAuth({
            keyFile: '../BACKEND/FHIR.json',
            scopes: ['https://www.googleapis.com/auth/cloud-healthcare']
        });
        const authClient = yield auth.getClient();
        const accessToken = yield authClient.getAccessToken();
        // Make the POST request to create the Patient resource
        const response = yield axios_1.default.post(`${URL}/Patient`, patient, {
            headers: {
                'Content-Type': 'application/fhir+json',
                Accept: 'application/fhir+json',
                Authorization: `Bearer ${accessToken.token}`
            }
        });
        console.log('Patient Created:', response.data);
    }
    catch (error) {
        console.error('Error creating patient:', error);
    }
});
function fetch() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield axios_1.default.get(` http://hapi.fhir.org/baseR4/metadata`);
            console.log(res);
        }
        catch (err) {
            console.error(err);
        }
    });
}
createPatient();
