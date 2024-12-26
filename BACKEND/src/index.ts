import  express  from "express";
import cors from "cors";
import bodyparser from 'body-parser';
import rootrouter from './routes/index.js'
const app=express();
app.use(bodyparser.json())
app.use(cors());
app.use(express.json());
app.use("/api/v1",rootrouter)
console.log("hi from main index.ts")
app.listen(3000)
