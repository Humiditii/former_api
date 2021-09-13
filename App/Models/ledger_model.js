//filename=>ledger_model.js
import {Schema, model} from 'mongoose';

const ledgerSchema = new Schema({

    amount: {
        type: Number,
        required: true
    }

});

export default model('ledger', ledgerSchema)