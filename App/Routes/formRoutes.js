import {Router} from 'express';
import FormController from '../Controllers/FormController';
import AuthWare from '../Middlewares/AuthWares';

const baseRoute = Router()

const formRoute = Router()

formRoute.post('/create', AuthWare.checkAuthentication, FormController.create)

formRoute.get('/forms', AuthWare.checkAuthentication, FormController.get_all)

formRoute.get('/configs/:form_id', AuthWare.checkAuthentication, FormController.load_form_configs)

formRoute.put('/fill_form/:form_id', FormController.form_submit)

formRoute.delete('/delete/:form_id', AuthWare.checkAuthentication, FormController.delete)

formRoute.get('/fillers/:form_id', AuthWare.checkAuthentication, FormController.get_fillers)


baseRoute.use('/form', formRoute)

export default baseRoute
  