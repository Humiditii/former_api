import {Router} from 'express';
import AuthController from '../Controllers/AuthController';
import AuthWare from '../Middlewares/AuthWares';


const authRoute = Router();
const baseRoute = Router();

authRoute.post('/signup', AuthController.signup);

authRoute.post('/signin', AuthController.signin);

authRoute.patch('/set_finger', AuthWare.checkAuthentication, AuthController.set_finger)

authRoute.patch('/change_pwd', AuthWare.checkAuthentication, AuthController.changePassword)


baseRoute.use('/auth', authRoute);



export default baseRoute;