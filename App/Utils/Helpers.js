import { hashSync , compareSync} from 'bcryptjs';
import {sign} from 'jsonwebtoken'
import dotenv from 'dotenv';
import { createTransport } from 'nodemailer';
import sendGridTransport from 'nodemailer-sendgrid-transport';
import {randomBytes} from 'crypto';


dotenv.config()


class Helpers {
    static  hashPassword(password){
        const hashedPwd =  hashSync(password, 10);
        return hashedPwd; 
    }

    static decodePwd(reqPassword, dbPassword){
        const compare = compareSync(reqPassword, dbPassword);
        return compare;
    }

    static appError (err, next){
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

    static generateToken(user_token_data){
        return sign({
            email:user_token_data.email,
            userId: user_token_data.userId,
            access_type: user_token_data.access_type
        }, process.env.SECRET,  { expiresIn: '24h' })
    }

    static mailer(){
        const transporter = createTransport(sendGridTransport({
            auth: {
                api_key: process.env.SEND_GRID_API
            }
        }));

        return transporter;

    }

    static randomStr(){
        return randomBytes(5).toString('hex');
    }

    static statuses(){
        return {
            ok : 200,
            created: 201,
            no_content: 204,
            bad_req: 400, // failed validation
            forbidden: 403, // authenticated but not permitted to access
            not_found: 404,
            unauthorized: 401,
            accepted: 202,
            not_allowed_mthod: 405
        }
    }

}


export default Helpers;
