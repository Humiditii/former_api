//filename=>payer_model.js

import {Schema, model} from 'mongoose';

const payerSchema = new Schema({
    email: {
        required: true,
        type: String
    },
    phonenumber: {
        type: Number,
        required: true
    },
    name: {
        required: true,
        type: String
    }
})

export default model('payer', payerSchema)