import express from 'express';
import{ registerController  , loginController , productController, userController, refreshController} from '../controllers';
import auth from '../middlewares/auth';
const router  = express.Router();

router.post('/register' , registerController.register) // for handeling a new users login 
// user register logic


router.post('/login' , loginController.login) 




router.get('/me' , auth,userController.me)

// refresh token
router.post('/refresh' , refreshController.refresh)

// for logout

router.post('/logout' , auth , loginController.logout)

// create a products routes

router.post('/products' ,auth ,  productController.store)




export default router
