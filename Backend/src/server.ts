import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import router from './router'
import { connectDB } from './config/db'
import { corsConfig } from './config/cors'


const app = express()

connectDB()
//Cors
app.use(cors(corsConfig))

//lerr datos de formulario
app.use(express.json())

//routing
app.use('/',router)

export default app