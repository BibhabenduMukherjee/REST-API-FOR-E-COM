import Joi from 'Joi'
import bcrypt from 'bcrypt'
import {RefreshToken, User} from '../../models'
import CustomErrorHandler from '../../services/CustomErrorHandler'
import JwtService from '../../services/JwtService'
import { REFRESH_SECRET } from '../../config'
const registerController ={
    
   async register(req , res ,next){
  // write the logic
  
  // #### -  CHECKLIST ###### - 

  // 1] Validate the user
  // 2] authorised the req
  // 3] check if user is in the database already
  // 4] prepare model
  // 5] store in the database
  // 6] generate JWT token
  // 7] send response

   // validation

   const registerSchema = Joi.object({
    name : Joi.string().min(3).max(30).required(),
    email : Joi.string().email().required(),
    password : Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    repeat_password: Joi.ref('password')
   })
  //  console.log(req.body)
   const {error} = registerSchema.validate(req.body);
   if(error)
   {
     return next(error)
   }
  
   // check if given email is already in the database

   try{
    const exist=  await User.exists({email : req.body.email})
   //  console.log(exist)
    if(exist) return next(CustomErrorHandler.alreadyExist('This email is already taken'));
   } catch(error)
   {
    return next(err)
   }
  

   // hash password generate
    
 
   const {name , email , password} = req.body

   const hashPassword = await bcrypt.hash(password , 10);
   
   
   // prepare the model
  
     const user = new User({
      
        name : name,
        email : email,
        password :hashPassword
   
      
     })
  
   
   let acces_token , refresh_token

    try{
    const result = await user.save()


    // token create

    acces_token = JwtService.sign({_id : result._id , role : result.role})
    refresh_token = JwtService.sign({_id : result._id , role : result.role}, '1y' , REFRESH_SECRET)
 
     var message = ' Hello' + name + 'you have Successfully Registred in our DataBase , Thank You'
     
    // dataBase whitelist for this refreshToken

    await RefreshToken.create({token : refresh_token})


    }catch(error)
    {
return next(error)
    }

     // 

   res.json({acces_token, refresh_token , message:message })

  }
}

export default registerController