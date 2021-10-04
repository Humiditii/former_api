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

                return res.status(status.created).json({

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

            const {finger, email} = req.body

            const finder = await Auth.findOne({email:email})

            if(!finder) return  Helpers.appError({message:'email not found',statusCode:status.forbidden}, next) 

            if(!finder.fingerprint.active) return Helpers.appError({message:'Fingerprint authentication not set', statusCode:status.forbidden}, next)

            if(finder.fingerprint.finger_id !== finger) return Helpers.appError({message:'fingerprint mismatch', statusCode:status.forbidden} ,next)

            const token = Helpers.generateToken({

                email: finder.fingerprint.finger_id,
                userId: fnder._id,
                access_type: finder.access_type

            }) 

            return res.status(status.ok).json({

                message:'User authenticated',
                statusCode: status.ok,
                data:{

                    token: token
                }

            })
        }

        if(auth_type === 'ip'){
            
        }

        // auth with email
        const {email, password} = req.body;

        try {
            const finder = await Auth.findOne({email: email})

            if(!finder) return Helpers.appError(
                
                {
                    message: ` User ${email} not found`,
                    statusCode: 404
                }

            , next)

            if(Helpers.decodePwd(password,finder.password)){

                const token_payload = {

                    email: finder.email,
                    userId: finder._id,
                    access_type: finder.access_type
                }

                const token = Helpers.generateToken(token_payload)

                return res.status(200).json({

                    message: `${finder.email} authenticated`,
                    statusCode: status.ok,
                    data: {
                        token: token
                    }               
                })

            }else{
                return res.status(400).json({

                    message:'invalid password',
                    statusCode: status.bad_req,

                })
            }

        } catch (error) {

            return Helpers.appError(error, next)
        }
    }

    static async set_finger(req, res, next){
      

        const {fingerprint} = req.body

        try {

            
            const find_user = await Auth.findByIdAndUpdate(req.userId, { 

                fingerprint: {
                    active: true,
                    finger_id:fingerprint
                }
    
             } )

            return res.status(status.ok).json({

                message: 'Fingerprint set',
                statusCode: status.ok
                
            })

        } catch (error) {

            return Helpers.appError(error, next)
        }

    }

    static async changePassword(req, res, next){

        const {userId} = req

        const {old_password, new_password} = req.body

        const user = await Auth.findById(userId)

        if( Helpers.decodePwd(old_password, user.password) ){

            user.password = Helpers.hashPassword(new_password)

            await user.save()

            return res.status(status.ok).json({

                statusCode: status.ok,
                message: 'password updated'

            })

        }

        const err = {}

        err.message = 'incorrect password'
        err.statusCode = status.forbidden

        return Helpers.appError(err, next)
    }

    static async updateProfile(req, res, next){

        

    }

    static async upload_profile(req, res, next){

    }

    static async forgetPassword(req, res, next){

    }
}


export default AuthController