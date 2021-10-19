import { Product } from "../models"
import multer from "multer"
import path from "path"
import CustomErrorHandler from "../services/CustomErrorHandler"
import Joi from "joi"
import fs from 'fs'
import { nextTick } from "process"
// define storage 

const storage = multer.diskStorage({
    destination : (req , file , cb)=>cb(null , 'uploads/'),
    filename: (req , file , cb)=>{
        const uniqueName = `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`
        cb(null , uniqueName)
    }
    
})

const handleMatipartData = multer({storage , limits:{fileSize:1000000*5}}).single('image')

const productController = {
    async store(req , res , next){
    
        // Multipart-form data
        handleMatipartData(req,res , async(err)=>{
            if(err){
                return next(CustomErrorHandler.serverError(err.message))
            }

            const filePath = req.file.path

            // validation 

            const productsSchema = Joi.object({
             name : Joi.string().required(),
             price: Joi.number().required(),
             size: Joi.string().required(),
            })
   

            const {error} = productsSchema.validate(req.body)

            if(error)
            {
                // image already uploaded to the server  before validate unnecessary upload could be taken
                // so that's why  Delete that file

                fs.unlink(`${appRoot}/${filePath}` , (err)=>{
                    if(err)
                    {
                        return next(CustomErrorHandler.serverError(err.message))
                    }
                    
                })
                return next(error)
            }

            //console.log(filePath)


           // if everything is fine then store the data in the database

           const {name , price , size} = req.body
           let document;

           try{                                             // try catch 
               document = await Product.create({
                   name,
                   price , 
                   size,
                   image : filePath
               })
           }
           catch(err)
           {
             return next(err)
           }

   

            res.status(201).json(document)    // 201 sucessful creation in the server 

        })


    }
}

export default productController
