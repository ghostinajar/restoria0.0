import mongoose from 'mongoose';

const { Schema } = mongoose;

export interface IMobNode {
    loadsMobBlueprintId: mongoose.Types.ObjectId;
    fromZoneId: mongoose.Types.ObjectId;
    quantity: number;
}

const mobNodeSchema = new Schema<IMobNode>({
    loadsMobBlueprintId: {
        type: Schema.Types.ObjectId,
        ref: 'MobBlueprint'  
    },
    fromZoneId: {
        type: Schema.Types.ObjectId,
        ref: 'Zone'  
    },
    quantity: Number
});

export default mobNodeSchema;