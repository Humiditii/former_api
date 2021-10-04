import Form from '../Models/form_model';
import Helpers from '../Utils/Helpers';
import Brainer from '../Utils/Brainer'
import Email from '../Utils/Email';
import Auth from '../Models/auth_model';
import Payer from '../Models/payer_model';

const status = Helpers.statuses();

const FormBrain = new Brainer()

class FormController {
    static async create(req, res, next){

        const {userId} = req
        req.body.creator = userId

    //     const a = [ 
    //         {
    //             field_name: {
    //                 _name: 'school',
    //                 entries: []
    //             }, 
    //             field_type: 'String', 
    //             required: true
    //         }, 
    //         {
    //             field_name: {
    //                 _name: 'level',
    //                 entries: []
    //             }, 
    //             field_type: 'number', 
    //             required: true
    //         }, 
    // ]

        try {

            const new_form = await new Form({...req.body}).save()
            
            return res.status(status.created).json({
                message: 'new form created',
                statusCode: status.created,
                data: new_form
            })

        } catch (error) {

            return Helpers.appError(error, next)
        }
        
    }

    static async delete (req, res, next){

        const {form_id} = req.params 

        try {

            await Form.findByIdAndDelete(form_id)

            return res.status(status.ok).json({

                statusCode: status.ok,
                message: 'deleted'

            })

        } catch (err) {

            return Helpers.appError(err, next)
        }
    }

    static async get_all(req, res, next){

            
        const get_all_frm_brain = FormBrain.recall('all_forms')

        if(get_all_frm_brain.found){
            // return cache
            const cache_res = get_all_frm_brain.neuron

            cache_res.data.message = 'fetched from cache'

            return res.status(status.ok).json(cache_res.data)

        }

        // fetch from database
        try {

            const forms = await Form.find({creator: req.userId})

            if(forms.length == 0){
                
                const err = {}

                err.message = 'No forms created yet',
                err.statusCode = status.ok

                return Helpers.appError(err, next)
            }

            const response = {
            
                message:'fetched',
                statusCode: status.ok,
                data: forms
            }

            FormBrain.cache('all_forms',response, 2*60)

            return res.status(status.ok).json(response)

        } catch (err) {

            return Helpers.appError(err, next)
        }
    }

    static async load_form_configs(req, res, next){

        const {form_id} = req.params

        const get_cfg_frm_brain = FormBrain.recall('_form_config_')

        if(get_cfg_frm_brain.found){
            // return cache
            const cache_res = get_cfg_frm_brain.neuron

            cache_res.data.message = 'Fetched from cache'

            return res.status(status.ok).json({response:cache_res.data})

        }
        
        Form.findById(form_id).then( form => {

            // {
            //     "expiry_time": 2.657179777741764e+24,
            //     "_id": "612922bd69594834f70fa7c9",
            //     "formname": "school filler",
            //     "fields": [
            //         {
            //             "field_name": {
            //                 "entries": [],
            //                 "_name": "school"
            //             },
            //             "_id": "612922bd69594834f70fa7ca",
            //             "field_type": "String",
            //             "required": true
            //         },
            //         {
            //             "field_name": {
            //                 "entries": [],
            //                 "_name": "level"
            //             },
            //             "_id": "612922bd69594834f70fa7cb",
            //             "field_type": "number",
            //             "required": true
            //         }

            const  { expiry_time, _id, formname, fields, payment,send_mail } = form

            const configs_ = new Array()

            for (const itr of fields) {
                // form name
                const {_name} = itr.field_name

                itr.name = _name

                const {field_type, required, name} = itr

                configs_.push({ name, field_type, required })

            }

            const response = {

                message: 'Fetched',
                statusCode: status.ok,
                data: {formname, _id, expiry_time, configs_}

            }

            // FormBrain.cache('form_config',response, 3*60)

            FormBrain.cache('_form_config_',response)

            FormBrain.cache('_send_mail_', send_mail)

            FormBrain.cache('_payment_',payment)

            return res.status(status.ok).json({ response })

        }).catch( err => Helpers.appError(err, next) )

    }

    static async form_submit(req, res, next){

        // console.log(FormBrain.recall('_form_config_'))

        const { configs_, expiry_time } = FormBrain.recall('_form_config_').neuron.data.data;

        const _payment_ = FormBrain.recall('_payment_').neuron

        const _send_mail_ = FormBrain.recall('_send_mail_').neuron

        if( Date.now() > expiry_time ){

            const err = {}

            err.message = 'ops!!! Form expired, contact the administrator',
            err.statusCode = 400

            return Helpers.appError(err, next)
        }

        const {form_id} = req.params;

        // form_filled should b an object
        // i.e

        // what this method wants is ..>

        // form_filled == fromClient

        // const fromClient = {
        //     school: 'futa', // check type and present
        //     level: 200 // check type and if present
            
        // }

        // "configs_": [
        //     {
        //         "name": "school",
        //         "field_type": "String",
        //         "required": true
        //     },
        //     {
        //         "name": "level",
        //         "field_type": "number",
        //         "required": true
        //     }
        // ]

        // {
        //     config_.name_value: fromClient_key
        // }
        // process of filling the form:
        // loop through the client request body and the config object
        // check the key from the client request body in the loope dconfig object property
        // check for errors_send_mail_
        //create an object property with the client property
        // 
        
        const {form_filled} = req.body

        const new_obj = {}

        new_obj['filled_at'] = Date.now()

        const err_obj = {}

        err_obj.length = 0

        err_obj.message = 'Validation error'

        const mail_obj = {}

        for (const key_o in form_filled) {

            //console.log(key_o)

            if( !mail_obj.hasOwnProperty('mail') && RegExp('mail|email', 'i').test(key_o)){

                mail_obj['mail'] = form_filled[key_o] 
            }

            for (const key_1 in configs_) {

                //console.log(key_1, configs_)
                
                if( key_o === configs_[key_1].name ){

                    if( configs_[key_1].required ){

                        if( configs_[key_1].field_type.toLowerCase() === typeof form_filled[key_o] ){

                            new_obj[key_o] = form_filled[key_o]

                        }else{
                            
                            err_obj[key_o] = { type_err: `${key_o} typeError, must be ${configs_[key_1].field_type} ` }
                        }

                    }else{

                        err_obj[key_o] = { empty_err: `${key_o} can\'t be empty ` }

                    }

                    if( err_obj.hasOwnProperty(key_o) ) err_obj.length += 1
                }
            }
        }

        //console.log(err_obj)

        const err = {}
        err.message = err_obj

        if( err_obj.length > 0 ) return Helpers.appError(err, next)
                
        // "configs_": [
        //     {
        //         "name": "school",
        //         "field_type": "String",
        //         "required": true
        //     },
        //     {
        //         "name": "level",
        //         "field_type": "number",
        //         "required": true
        //     }
        // ]

        try {
            
            const get_form = await Form.findById(form_id)

            const {fillers, creator, formname} = get_form

            const {fullname} = await Auth.findById(creator)

            // console.log(new_obj)

            !_payment_.subscribed ?( fillers.push(new_obj), get_form.save() ) : FormBrain.cache('_hold_this_person_', new_obj ) 

            if( mail_obj['mail'] && _payment_.subscribed ){
                // send mail function here
                if(_send_mail_){

                    Email.formSubmitResponseTemplate({

                        to: mail_obj['mail'],
                        from: `${fullname}forms.com`,
                        subject: `Your response to ${formname} has been saved`

                    })

                }

            }

            FormBrain.forget('_form_config_')

            FormBrain.forget('_send_mail_')

            const resp = {
                statusCode: status.ok,
                message: null
            }

            resp.message = _payment_.subscribed ? 'Proceed to payment page' : 'Form submitted successfully'

            
            return res.status(status.ok).json(resp)
            
        } catch (err) {

            // console.log(err)
            
            return Helpers.appError(err, next)

        }
    }

    static async fill_multiple(req, res, next){

        const {userId} = req

        const {form_id} = req.params;

        const [ _payment_, _send_mail_ ] = [ FormBrain.recall('_payment_').neuron, FormBrain.recall('_send_mail_').neuron ]

        // filler_object must be an array, and overide_expiry must be a boolean and must hold a value
        const {filler_object, overide_expiry} = req.body

        const req_body_err = {}

        req_body_err.messsage = {}

        req_body_err.error = false

        if( typeof filler_object !== 'object' && 
        !filler_object.hasOwnProperty('length') ){

            req_body_err.error = true

            req_body_err.messsage['filler_object'] = 'filler_object must be an array'

        }

        if(overide_expiry == null){

            req_body_err.error = req_body_err.error ? req_body_err.error : true

            req_body_err.messsage['overide_expiry'] = 'overide_expiry must be a boolean and can\'t be empty'

        }

        if( req_body_err.error )return Helpers.appError(req_body_err, next)

        const { configs_, expiry_time } = FormBrain.recall('_form_config_').neuron.data.data;

        if( Date.now() > expiry_time && overide_expiry ){

            const err = {}

            err.message = 'ops!!! Form expired, contact the administrator',
            err.statusCode = 400

            return Helpers.appError(err, next)
        }

        var [ new_obj, new_obj_array ] = [ {}, [] ]

        var [err_obj, error_arr ] = [ {}, [] ]

        var [ mail_obj, mail_obj_arr ] = [ {}, [] ]

        // [
        //     {  },
        //     {  },
        //     {  }
        // ]

        for (const filler_x of filler_object ) {
            
            for (const key_0 in filler_x) {

                if( !mail_obj.hasOwnProperty('email') && RegExp('mail|email', 'i').test(key_0)){

                    mail_obj['mail'] = form_filled[key_0] 

                    mail_obj_arr.push(mail_obj)

                    mail_obj = {}
                }

                for (const key_1 in configs_) {
                   
                    if( key_0 === configs_[key_1].name ){

                        if( configs_[key_1].required ){

                            if( configs_[key_1].field_type.toLowerCase() === typeof filler_x[key_0]  ){
                            
                                new_obj[key_0] = filler_x[key_0]

                            }else{

                                err_obj[key_0] = {

                                    type_err: `${key_0} for index ${filler_object.indexOf(filler_x) + 1 } typeError, must be ${configs_[key_1].field_type} ` 
                                }

                                error_arr.push(err_obj)

                                err_obj = {}

                            }

                        }else{

                            err_obj[key_0] = { empty_err: `${key_0} can\'t be empty , for index ${filler_object.indexOf(filler_x) + 1 } ` }

                            error_arr.push(err_obj)

                            err_obj = {}

                        }

                    }

                }
            }

            new_obj_array.push(new_obj)

            new_obj = {}

        }

        const err = {}

        err.message = error_arr

        if( error_arr.length > 0 ) return Helpers.appError(err, next)

        try {
            
            const get_form = await Form.findById(form_id)

            const {fillers, formname} = get_form

            const {fullname} = await Auth.findById(userId)

            !_payment_.subscribed ?( fillers.push(...new_obj_array) , get_form.save() ) : FormBrain.cache('_hold_this_people_', new_obj ) 

            if( mail_obj_arr.length > 0 && _payment_.subscribed && _send_mail_ ){
                // send mail function here
                
                    for (const person_x of mail_obj_arr) {
                        
                        Email.formSubmitResponseTemplate({

                            to: person_x['mail'],
                            from: `${fullname}forms.com`,
                            subject: `Your response to ${formname} has been saved, filled by admin`
    
                        })

                    }

            }


        } catch (error) {
            
            return Helpers.appError(error, next)

        }

    }

    static async get_fillers (req, res, next){

        const _get_fillers_ = FormBrain.recall('_fillers_')

        if(_get_fillers_.found){
            // return cache
            const cache_res = _get_fillers_.neuron

            cache_res.message = 'fetched from cache'

            return res.status(status.ok).json(cache_res.data)

        }

        const {form_id} = req.params

        const get_form_fillers = await Form.findById(form_id).select('fillers')

        const resp = {
            statusCode: status.ok,
            message: 'Fillers fetched from Db',
            data: get_form_fillers
        }

        FormBrain.cache('_fillers_',resp, 3*60)

        return res.status(status.ok).json(resp)

    }

    static async get_payer(req, res, next){

        const { _id } = new Payer({...req.body}).save()

        return res.status(201).json({
            message: 'payer created',
            statusCode: status.created,
            data: { payer_id : _id }
        })
    }


    static async payer(req, res, next){

        const _hold_this_person_ = FormBrain.recall('_hold_this_person_').neuron

        const _payment_ = FormBrain.recall('_payment_').neuron

        const { form_id, payer_id } = req.params

        const {email, phonenumber, name} = await Payer.findById(payer_id)

        const payment_configs = {

            endpoint: 'https://api.flutterwave.com/v3/payments',
            header: `Authorization: Bearer ${process.env.FLUTTERWAVE_API_SEC_KEY}`,
            requests:  {

                "tx_ref":"hooli-tx-1920bbtytty",
                "amount":_payment_.amount,
                "currency":"NGN",
                "redirect_url":"https://webhook.site/9d0b00ba-9a69-44fa-a43d-a82c33c36fdc",
                "payment_options":"card",
                // "meta":{
                //    "consumer_id":23,
                //    "consumer_mac":"92a3-912ba-1192a"
                // },
                "customer":{
                   "email":email,
                   "phonenumber":phonenumber,
                   "name":name
                },
                "customizations":{
                   "title":"Pied Piper Payments",
                   "description":"Middleout isn't free. Pay the price",
                   "logo":"https://assets.piedpiper.com/logo.png"
                }
    
            }

        }
        
    }


    static async get_form_file(req, res, next){

        const {userId} = req

        const {form_id} = req.params

        try {

            const the_form = await Form.findById(form_id)
            
        } catch (err) {

            return Helpers.appError(err, next)  
        }

    }

}

export default FormController