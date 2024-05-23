import mongoose from 'mongoose';

const { Schema } = mongoose;

const itemNodeSchema = new Schema({
    loadsItem: {
        type: Schema.Types.ObjectId,
        ref: 'Item'  
    },
    fromZone: {
        type: Schema.Types.ObjectId,
        ref: 'Zone'  
    },
    quantity: Number
}, { _id: false });

export default itemNodeSchema;
