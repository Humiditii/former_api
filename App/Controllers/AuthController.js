import Auth from '../Models/auth_model';
import Helpers from '../Utils/Helpers';

const status = Helpers.statuses()

class AuthController {

    static async signup(req, res, next){
        req.body.password = Helpers.hashPassword(req.body.password)
        const {email, password} = req.body

        try {
            const find_if_exist = await Auth.findOne({email:email})
            if(!find_if_exist){
                const new_user = await new Auth({...req.body}).save()

                return res.status(201).json({
                    statusCode: status.created,
                    message: 'user created, proceed to login'
                })
                
            }

        } catch (error) {
            Helpers.appError(error, next)
        }
    }

    static async signin(req, res, next){
        // signin with fingerprint(native apps), ip_address, email 
        const auth_type = req.body.auth_type 
        if(auth_type === 'fingerprint'){
            const {finger} = req.body
            // confirm
        }
        if(auth_type === 'ip'){
            
        }
        
        // auth with email
        const {email, password} = req.body;

        try {
            const finder = await Auth.findOne({email: email})
            if(Helpers.decodePwd(password,finder.password)){
                const token_payload = {
                    email: finder.mail,
                    userId: finder._id

                }
                const token = Helpers.generateToken(token_payload)

                return res.status(200).json({
                    message: `${finder.email} authenticated`,
                    statusCode: status.ok,
                    data: {
                        token: token
                    }
                })
            }

        } catch (error) {
            return Helpers.appError(error, next)
        }
    }
}


export default AuthController