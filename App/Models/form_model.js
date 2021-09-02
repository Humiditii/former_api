import {Schema, model} from 'mongoose';

const formSchema = new Schema({
    // form_n: {
    //     form_name: 'hhjkjjk',
    //     expity_time: Date,
    //     fields: [
    //             {name: 'djdjd',
    //             type: 'string',
    //             required: true},
    
    //             {name: 'djdjd',
    //             type: 'string',
    //             required: true },
    //         ]
        
    // }
    creator:{
        type:Schema.Types.ObjectId,
        ref: 'auth'},
    formname: {
        type: String,
        required: true
    },
    expiry_time: {
        type: Number,
        default: Date.now() **2
    }, 
    fields: [
        {
            field_name: {
                _name: String,
                entries: []
            }, 
            field_type: String, 
            required: Boolean
        }
    ],

    payment: {
        subscribed: false,
        amount: 0,
        account_number: Number,
        bank_name: String

    },

    // fillers 
    // {
    //     school: [],
    //     level: []
    // }
    // [
    //     {
    //         school:"futa",
    //         level: 300
    //     }
    // ]
    fillers: []
})

export default model('form', formSchema)