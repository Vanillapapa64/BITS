import axios from 'axios'
const { GoogleAuth } = require('google-auth-library');
require('dotenv').config()
const URL=process.env.FHIRbaseurl;
export async function viewpatient(patient:string) {
    try{
        const res=await axios.get(`${URL}/Patient/${patient}`)
        console.log(res.data)
    }catch(err){
        console.error(err)
        throw new Error(`error fetching patient with id ${patient}`)
    }
}
interface patient{
    family:string,
    name:string,
    gender:string,
    birthdate:string,
    mobile:number,
    adressline:string,
    city:string,
    state:string,
    postalcode:number,
    country:string,
    temp:number,
    heartrate:number
}
const createPatient = async () => {
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
        birthDate: "1980-01-01",
        telecom: [
            {
                system: "phone",
                value: "+1234567890",
                use: "mobile"
            }
        ],
        // Address information
        address: [
            {
                use: "home",
                line: ["123 Main St"],
                city: "City",
                state: "State",
                postalCode: "12345",
                country: "Country"
            }
        ],
        
        // Adding vital signs (using the Observation resource for vitals)
        observation: [
            {
                resourceType: "Observation",
                status: "final",
                category: {
                    coding: [
                        {
                            system: "http://terminology.hl7.org/CodeSystem/observation-category",
                            code: "vital-signs",
                            display: "Vital Signs"
                        }
                    ]
                },
                code: {
                    coding: [
                        {
                            system: "http://loinc.org",
                            code: "8462-4",
                            display: "Body temperature"
                        }
                    ]
                },
                valueQuantity: {
                    value: 98.6,
                    unit: "F",
                    system: "http://unitsofmeasure.org",
                    code: "°F"
                },
                subject: {
                    reference: "Patient/123"  // Patient ID reference
                }
            },
            {
                resourceType: "Observation",
                status: "final",
                category: {
                    coding: [
                        {
                            system: "http://terminology.hl7.org/CodeSystem/observation-category",
                            code: "vital-signs",
                            display: "Vital Signs"
                        }
                    ]
                },
                code: {
                    coding: [
                        {
                            system: "http://loinc.org",
                            code: "8480-6",
                            display: "Heart rate"
                        }
                    ]
                },
                valueQuantity: {
                    value: 75,
                    unit: "beats/min",
                    system: "http://unitsofmeasure.org",
                    code: "bpm"
                },
                subject: {
                    reference: "Patient/123"  // Patient ID reference
                }
            }
        ]
    };
    

    try {
        const auth = new GoogleAuth({
            keyFile: '../BACKEND/FHIR.json',
            scopes: ['https://www.googleapis.com/auth/cloud-healthcare']
        });

        const authClient = await auth.getClient();
        const accessToken = await authClient.getAccessToken();

        // Make the POST request to create the Patient resource
        const response = await axios.post(`${URL}/Patient`, patient, {
            headers: {
                'Content-Type': 'application/fhir+json',
                Accept: 'application/fhir+json',
                Authorization: `Bearer ${accessToken.token}`
            }
        });
    console.log('Patient Created:', response.data);
    } catch (error) {
    console.error('Error creating patient:', error);
    }
};
async function fetch() {
    try{
        const res=await axios.get(` http://hapi.fhir.org/baseR4/metadata`)
        console.log(res)
    }catch(err){
    console.error(err)
    }
}
createPatient()