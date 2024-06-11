import mongoose from 'mongoose';
const { Schema } = mongoose;
const mobNodeSchema = new Schema({
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
