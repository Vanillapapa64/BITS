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
const multer_1 = __importDefault(require("multer"));
const ocr_1 = require("../functions/ocr");
const fhir_1 = require("../functions/fhir");
const appointments_1 = require("../functions/appointments");
const userRouter = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
userRouter.post('/ocr', upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            res.status(400).json({ error: "No file detected" });
            return;
        }
        const path = req.file.path;
        const text = yield (0, ocr_1.performOCr)(path);
        res.json({ Detected: text });
    }
    catch (err) {
        res.status(500).json({ error: "Some error" });
    }
}));
userRouter.get('/fetch', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const response = yield (0, fhir_1.searchPatient)(body);
        res.json({ response: response });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err });
    }
}));
userRouter.post('/newAppointment', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const creation = yield (0, appointments_1.createAppointment)(body);
        res.json({ id: creation });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err });
    }
}));
exports.default = userRouter;
