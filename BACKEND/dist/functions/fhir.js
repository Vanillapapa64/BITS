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
exports.deletePatient = exports.createPatient = void 0;
exports.viewpatient = viewpatient;
exports.searchPatient = searchPatient;
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
const createPatient = (inputs) => __awaiter(void 0, void 0, void 0, function* () {
    const patient = {
        resourceType: "Patient",
        name: [
            {
                use: "official",
                family: inputs.family,
                given: [inputs.name]
            }
        ],
        gender: inputs.gender,
        birthDate: inputs.birthdate,
        telecom: [
            {
                system: "phone",
                value: inputs.mobile,
                use: "mobile"
            }
        ],
        // Address information
        address: [
            {
                use: "home",
                line: [inputs.adressline],
                city: inputs.city,
                state: inputs.state,
                postalCode: inputs.postalcode,
                country: inputs.country
            }
        ]
    };
    const observationTemplate = (code, display, value, unit, system) => ({
        resourceType: "Observation",
        status: "final",
        category: [{
                coding: [
                    {
                        system: "http://terminology.hl7.org/CodeSystem/observation-category",
                        code: "vital-signs",
                        display: "Vital Signs",
                    },
                ],
            }],
        code: {
            coding: [
                {
                    system: "http://loinc.org",
                    code: code,
                    display: display,
                },
            ],
        },
        valueQuantity: {
            value: value,
            unit: unit,
            system: system,
            code: unit,
        },
    });
    try {
        const auth = new GoogleAuth({
            keyFile: '../BACKEND/FHIR.json',
            scopes: ['https://www.googleapis.com/auth/cloud-healthcare']
        });
        const authClient = yield auth.getClient();
        const accessToken = yield authClient.getAccessToken();
        const patientResponse = yield axios_1.default.post(`${URL}/Patient`, patient, {
            headers: {
                'Content-Type': 'application/fhir+json',
                Accept: 'application/fhir+json',
                Authorization: `Bearer ${accessToken.token}`
            }
        });
        console.log('Patient Created:', patientResponse.data);
        const patientId = patientResponse.data.id;
        const observations = [
            observationTemplate("8462-4", "Body temperature", inputs.temp, "°F", "http://unitsofmeasure.org"),
            observationTemplate("8480-6", "Heart rate", inputs.heartrate, "bpm", "http://unitsofmeasure.org"),
        ].map(obs => (Object.assign(Object.assign({}, obs), { subject: { reference: `Patient/${patientId}` } })));
        for (const obs of observations) {
            const observationResponse = yield axios_1.default.post(`${URL}/Observation`, obs, {
                headers: {
                    'Content-Type': 'application/fhir+json',
                    Accept: 'application/fhir+json',
                    Authorization: `Bearer ${accessToken.token}`,
                },
            });
            console.log('Observation Created:', observationResponse.data);
        }
        return patientResponse.data;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error creating patient");
    }
});
exports.createPatient = createPatient;
const newPatient = {
    family: "Singh",
    name: "Navkirat",
    gender: "male",
    birthdate: "1980-01-01",
    mobile: '9876543210',
    adressline: "123 Main Street",
    city: "New York",
    state: "NY",
    postalcode: '10001',
    country: "USA",
    temp: 98.6,
    heartrate: 72
};
function searchPatient(inputs) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const auth = new GoogleAuth({
                keyFile: '../BACKEND/FHIR.json',
                scopes: ['https://www.googleapis.com/auth/cloud-healthcare']
            });
            const authClient = yield auth.getClient();
            const accessToken = yield authClient.getAccessToken();
            const query = Object.entries(inputs).map(([key, value]) => `${key}=${encodeURIComponent(value || "")}`);
            const res = yield axios_1.default.get(`${URL}/Patient?${query}`, {
                headers: {
                    Accept: 'application/fhir+json',
                    Authorization: `Bearer ${accessToken.token}`
                }
            });
            var final = [];
            if (res.data.entry && Array.isArray(res.data.entry)) {
                res.data.entry.forEach((x) => {
                    if (x.resource) {
                        final.push(x.resource);
                    }
                });
            }
            return final;
        }
        catch (err) {
            console.error(err);
        }
    });
}
const deletePatient = (patientId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const auth = new GoogleAuth({
            keyFile: '../BACKEND/FHIR.json',
            scopes: ['https://www.googleapis.com/auth/cloud-healthcare'],
        });
        const authClient = yield auth.getClient();
        const accessToken = yield authClient.getAccessToken();
        const observationsResponse = yield axios_1.default.get(`${URL}/Observation?subject=Patient/${patientId}`, {
            headers: {
                Authorization: `Bearer ${accessToken.token}`,
            },
        });
        const observations = observationsResponse.data.entry || [];
        // Step 2: Delete each observation
        for (const entry of observations) {
            const observationId = entry.resource.id;
            yield axios_1.default.delete(`${URL}/Observation/${observationId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken.token}`,
                },
            });
            console.log(`Deleted Observation: ${observationId}`);
        }
        // Send DELETE request to the FHIR server
        const res = yield axios_1.default.delete(`${URL}/Patient/${patientId}`, {
            headers: {
                Authorization: `Bearer ${accessToken.token}`,
            },
        });
        console.log(`Patient with ID ${patientId} deleted successfully.`);
        return res.data;
    }
    catch (error) {
        //@ts-ignore
        console.error('Error deleting patient:', error === null || error === void 0 ? void 0 : error.response.data);
        throw new Error(`Failed to delete patient with ID ${patientId}`);
    }
});
exports.deletePatient = deletePatient;
// Example usage
//   const patientId = '19ad01ce-4879-4755-a2e6-60057f93acb5'; // Replace with the actual patient ID
//   deletePatient(patientId)
//     .then(() => console.log('Patient deletion completed.'))
//     .catch((err) => console.error(err.message));
