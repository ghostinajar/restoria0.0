import mongoose from 'mongoose';

const { Schema } = mongoose;

const mobNodeSchema = new Schema({
    loadsMobId: {
        type: Schema.Types.ObjectId,
        ref: 'Mob'  
    },
    fromZoneId: {
        type: Schema.Types.ObjectId,
        ref: 'Zone'  
    },
    quantity: Number
}, { _id: false });

export default mobNodeSchema;