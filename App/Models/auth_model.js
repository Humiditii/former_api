import {Schema, model} from 'mongoose';


const auth_model = new Schema({

    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    fingerprint: {
        active: {
            default: false,
            type: Boolean
        },
        finger_id:String
    },
    // IP address aauthentiucation
    ip_auth: {
        active:{
            default: false,
            type: Boolean
        },
        ip_address: String,
        //  Number of times you can sign-in with ipaddress before it reset
        ip_auth_max: {
            type: Number,
            default: 0
        },
        ip_auth_next_login: {
            default: false,
            type: Boolean
        }

    },

    auth_count: {
        
    }


    
});

export default model('auth', auth_model)


