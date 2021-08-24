import Auth from '../Models/auth_model';
import Helpers from '../Utils/Helpers';

class AuthController {

    static async signup(req, res, next){
        const {email, password} = req.body

        try {
            const find_if_exist = await Auth.findOne({email:email})
            if(!find_if_exist){
                const new_user = await new Auth({...req.body}).save()

                return res.status(201).json({
                    
                })
                
            }

        } catch (error) {
            Helpers.appError(error, next)
        }
    }
}


export default AuthController