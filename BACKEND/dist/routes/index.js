"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const maps_1 = __importDefault(require("./maps"));
const user_1 = __importDefault(require("./user"));
const app = (0, express_1.default)();
const router = express_1.default.Router();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
console.log("hi from  index.ts");
//user
//hospital
router.use('/user', user_1.default);
router.use('/maps', maps_1.default);
exports.default = router;
