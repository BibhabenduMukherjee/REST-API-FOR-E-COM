import express from 'express'
import { APP_PORT  , DB} from './config';
import errorHandler from './middlewares/errorHandler';
import routes from './routes/index'
import mongoose from 'mongoose'
import path from 'path'
const app = express();



app.use(express.urlencoded({extended: false}))


app.use(express.json())

app.use('/api',routes) // register routes in server.js first


/// mongodb connection 

mongoose.connect(DB, {useNewUrlParser:true , useUnifiedTopology:true })
const db = mongoose.connection;
db.on('error' , console.error.bind(console , 'connection error'))
db.once('open' , ()=>{
    console.log('connection successfull')
})

// define a global variable

global.appRoot = path.resolve(__dirname)



// middleware
app.use(errorHandler);


app.listen(APP_PORT ,  ()=> console.log("start"))
