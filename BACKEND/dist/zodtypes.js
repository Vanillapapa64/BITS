"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.map = void 0;
const zod_1 = require("zod");
exports.map = zod_1.z.object({
    userLat: zod_1.z.string(),
    userLng: zod_1.z.string(),
    radius: zod_1.z.number(),
    keyword: zod_1.z.string()
});
