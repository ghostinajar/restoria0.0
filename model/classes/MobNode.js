import mongoose from 'mongoose';

const { Schema } = mongoose;

const mobNodeSchema = new Schema({
    loadsMob: {
        type: Schema.Types.ObjectId,
        ref: 'Mob'  
    },
    fromZone: {
        type: Schema.Types.ObjectId,
        ref: 'Zone'  
    },
    quantity: Number
}, { _id: false });

export default mobNodeSchema;