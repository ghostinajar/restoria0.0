import mongoose from 'mongoose';

const { Schema } = mongoose;

const itemNodeSchema = new Schema({
    loadsItemId: {
        type: Schema.Types.ObjectId,
        ref: 'Item'  
    },
    fromZoneId: {
        type: Schema.Types.ObjectId,
        ref: 'Zone'  
    },
    quantity: Number
}, { _id: false });

export default itemNodeSchema;
