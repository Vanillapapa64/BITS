import  express  from "express";
import cors from "cors";
import bodyparser from 'body-parser';
import mapsroute from "./maps";
import userRouter from "./user";
import webhooksroute from "./webhooks";
const app=express();
const router=express.Router()
app.use(bodyparser.json())
app.use(cors());
app.use(express.json());
console.log("hi from  index.ts")
//user
//hospital
router.use('/user',userRouter)
router.use('/maps',mapsroute)
router.use('/webhooks',webhooksroute)
export default router