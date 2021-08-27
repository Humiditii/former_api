import {Router} from 'express';
import FormController from '../Controllers/FormController';
import AuthWare from '../Middlewares/AuthWares';

const baseRoute = Router()
const formRoute = Router()

formRoute.post('/create', AuthWare.checkAuthentication, FormController.create)

formRoute.get('/forms', AuthWare.checkAuthentication, FormController.get_all)


baseRoute.use('/form', formRoute)

export default baseRoute