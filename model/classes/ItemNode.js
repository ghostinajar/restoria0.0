import mongoose from 'mongoose';

const { Schema } = mongoose;

const itemNodeSchema = new Schema({
    loadsItemBlueprintId: {
        type: Schema.Types.ObjectId,
        ref: 'ItemBlueprint'  
    },
    fromZoneId: {
        type: Schema.Types.ObjectId,
        ref: 'Zone'  
    },
    quantity: Number
}, { _id: false });

export default itemNodeSchema;
