import {Router} from 'express';
import AuthController from '../Controllers/AuthController';

const authRoute = Router();
const baseRoute = Router();

authRoute.post('/signup', AuthController.signup);

authRoute.post('/signin', AuthController.signin);

baseRoute.use('/auth', authRoute);



export default baseRoute;