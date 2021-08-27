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

            FormBrain.cache('all_forms',response, 2*60*1000)

            return res.status(status.ok).json(response)

        } catch (err) {

            return Helpers.appError(err, next)
        }
    }

    static async load_form_configs(req, res, next){
        
    }
}

export default FormController