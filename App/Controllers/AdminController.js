//filename=>SudoAdminController.js
import Admin from '../Models/admin_model';
import Form from '../Models/form_model';
import Helpers from '../Utils/Helpers';
import Brainer from '../Utils/Brainer';

const AdminBrain = new Brainer()

const {appError, hashPassword, statuses} = Helpers

class AdminController {
    
    static async signin(req, res, next){

        const {auth_type, email, password} = req.body

        if(auth_type === 'fingerprint' ){
        // use fingerprint to auth admin

        }

        try {

            const find_admin = await Admin.find(

                {   email: email, 
                    password: hashPassword(password) 
                }

            )

            const token_payload = {

                email: find_admin.email,
                userId: find_admin._id,
                access_type: find_admin.access_type

            }

            const token = generateToken(token_payload)

            if(!find_admin) return appError({message:'email not found or incorrect password perhaps',statusCode:status.forbidden}, next) 

            return res.status(statuses.ok).json({

                message:'Sudo Admin authenticated',
                statusCode: statuses.ok,
                data:{

                    token: token
                }

            })
            
        } catch (error) {

            return appError(error, next)
        }

    }

    static admin_dashboard(){

        const resp = {

            length_of_itms: null,
            creators:[],
            unique_count: [
                {
                    creator: null,
                    forms_owned: [
                        {
                            numbers_of_fillers: 0
                        }
                    ]
                }
            ],
            payment: {
                creators_subscribes: [],
                creator_forms: [
                    {
                        creator: null,
                        number_of_payment_forms: 0,
                        total_revenue: 0,
                        number_of_fillers: 0
                    }
                ]
            }
        }

        return resp
    }

    static async get_forms(req, res, next){

        try {
            
            const form_length = await Form.count()

            this.admin_dashboard().length_of_itms = form_length

            next()

        } catch (error) {

            return appError(error, next)
        }

    }

    static async get_creators(req, res, next){
 

    }

    static async creators_using_payment(req, res, next){


    }

    
}

export default AdminController