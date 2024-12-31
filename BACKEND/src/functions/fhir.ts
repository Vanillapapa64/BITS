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
export interface patient{
    family:string,
    name:string,
    gender:string,
    birthdate:string,
    mobile:string,
    adressline:string,
    city:string,
    state:string,
    postalcode:string,
    country:string,
    temp:number,
    heartrate:number
}
export const createPatient = async (inputs:patient) => {
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
    const observationTemplate=(code:string,display:string,value:number,unit:string,system:string)=>({
        resourceType:"Observation",
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
                    code:code,
                    display:display,
                },
            ],
        },
        valueQuantity: {
            value:value,
            unit:unit,
            system:system,
            code: unit,
        },
    })

    try {
        const auth = new GoogleAuth({
            keyFile: '../BACKEND/FHIR.json',
            scopes: ['https://www.googleapis.com/auth/cloud-healthcare']
        });

        const authClient = await auth.getClient();
        const accessToken = await authClient.getAccessToken();


        const patientResponse = await axios.post(`${URL}/Patient`, patient, {
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
        ].map(obs => ({
            ...obs,
            subject: { reference: `Patient/${patientId}` },
        }));
        for (const obs of observations) {
            const observationResponse = await axios.post(`${URL}/Observation`, obs, {
                headers: {
                    'Content-Type': 'application/fhir+json',
                    Accept: 'application/fhir+json',
                    Authorization: `Bearer ${accessToken.token}`,
                },
            });
            console.log('Observation Created:', observationResponse.data);
        }
        return patientResponse.data
    } catch (error) {
        console.error(error)
        throw new Error("Error creating patient")
    }
};
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

export interface searchParams{
    name?:string,
    family?:string,
    state?:string,
    [key:string]:string | undefined
}
export async function searchPatient(inputs:searchParams){
    try{
        const auth = new GoogleAuth({
            keyFile: '../BACKEND/FHIR.json',
            scopes: ['https://www.googleapis.com/auth/cloud-healthcare']
        });
        const authClient = await auth.getClient();
        const accessToken = await authClient.getAccessToken();
        const query=Object.entries(inputs).map(([key,value])=>`${key}=${encodeURIComponent(value||"")}`)
        const res= await axios.get(`${URL}/Patient?${query}`,{
            headers:{
                Accept:'application/fhir+json',
                Authorization:`Bearer ${accessToken.token}`
            }
        })
        var final:any=[]
        if (res.data.entry && Array.isArray(res.data.entry)) {
            res.data.entry.forEach((x: any) => {
                if (x.resource) {
                    final.push(x.resource);
                }
            });
        } 
        return final
    }catch(err){
        console.error(err)
    }
}

export const deletePatient = async (patientId: string) => {
    try {
      const auth = new GoogleAuth({
        keyFile: '../BACKEND/FHIR.json',
        scopes: ['https://www.googleapis.com/auth/cloud-healthcare'],
      });
  
      const authClient = await auth.getClient();
      const accessToken = await authClient.getAccessToken();
      const observationsResponse = await axios.get(`${URL}/Observation?subject=Patient/${patientId}`, {
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
        },
      });
  
      const observations = observationsResponse.data.entry || [];
  
      // Step 2: Delete each observation
      for (const entry of observations) {
        const observationId = entry.resource.id;
        await axios.delete(`${URL}/Observation/${observationId}`, {
          headers: {
            Authorization: `Bearer ${accessToken.token}`,
          },
        });
        console.log(`Deleted Observation: ${observationId}`);
      }
      // Send DELETE request to the FHIR server
      const res = await axios.delete(`${URL}/Patient/${patientId}`, {
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
        },
      });
  
      console.log(`Patient with ID ${patientId} deleted successfully.`);
      return res.data;
    } catch (error) {
        //@ts-ignore
      console.error('Error deleting patient:', error?.response.data);
      throw new Error(`Failed to delete patient with ID ${patientId}`);
    }
  };
  
  // Example usage
//   const patientId = '19ad01ce-4879-4755-a2e6-60057f93acb5'; // Replace with the actual patient ID
//   deletePatient(patientId)
//     .then(() => console.log('Patient deletion completed.'))
//     .catch((err) => console.error(err.message));