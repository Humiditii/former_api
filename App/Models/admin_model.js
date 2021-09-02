import {Schema, model} from 'mongoose';
import Helpers from '../Utils/Helpers';
import dotenv from 'dotenv';

dotenv.config()

const hashPassword = Helpers.hashPassword(process.env.SUDO_PASSWORD)

const admin_model = new Schema({

    email: {
        type: String,
        default: process.env.SUDO_MAIL
    },
    password: {
        type: String,
        default: hashPassword
    },
    fingerprint: {
        active: {
            default: false,
            type: Boolean
        },
        finger_id:String
    },
    access_type: 'sudo_1'

});

export default model('admin', admin_model);