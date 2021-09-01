import Form from '../Models/form_model';
import Helpers from '../Utils/Helpers';
import Brainer from '../Utils/Brainer'

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

        const get_cfg_frm_brain = FormBrain.recall('form_config')

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

            const  {expiry_time, _id, formname, fields} = form

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

            FormBrain.cache('form_config',response, 3*60)

            FormBrain.cache('_form_config_',response)

            return res.status(status.ok).json({ response })

        }).catch( err => Helpers.appError(err, next) )

    }

    static async form_submit(req, res, next){

        const { configs_, expiry_time } = FormBrain.recall('_form_config_').response.data;

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
        
        const {form_filled} = req.body

        const new_obj = {}

        new_obj[filled_at] = Date.now()

        const err_obj = {}

        err_obj.length = 0

        err_obj.message = 'Validation error'

        for (const key_o in form_filled) {

            for (const key_1 in configs_) {
                
                if( key_o === configs_[key_1]){

                    if( configs_.required ){

                        if( configs_.field_type.toLowerCase() == typeof form_filled[key_o] ){

                            new_obj[key_o] = form_filled[key_o]

                        }

                        err_obj[key_o] = { type_err: `${key_o} typeError, must be ${configs_.field_type} ` }

                    }

                    err_obj[key_o] = { empty_err: `${key_o} can\'t be empty ` }

                    if( err_obj.hasOwnProperty(key_0) ) err_obj.length += 1
                }
            }
        }

        if( err_obj.length > 0 ) return Helpers.appError(err_obj, next)

        
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

            const {fillers} = get_form

            fillers.push(new_obj)

            FormBrain.forget('_form_config_')

            return res.status(status.ok).json({
                statusCode: status.ok,
                message: 'Form submitted successfully'
            })
            
        } catch (err) {
            
            return Helpers.appError(err, next)
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