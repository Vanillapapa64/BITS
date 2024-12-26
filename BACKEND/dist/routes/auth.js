"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import the functions you need from the SDKs you need
const app_1 = require("firebase/app");
const analytics_1 = require("firebase/analytics");
require('dotenv').config();
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.firebaseapiKey,
    authDomain: process.env.firebaseauthDomain,
    projectId: process.env.firebaseprojectId,
    storageBucket: process.env.firebasestorageBucket,
    messagingSenderId: process.env.firebasemessagingSenderId,
    appId: process.env.firebaseappId,
    measurementId: process.env.firebasemeasurementId
};
// Initialize Firebase
const app1 = (0, app_1.initializeApp)(firebaseConfig);
const analytics = (0, analytics_1.getAnalytics)(app1);
