import mongoose from 'mongoose';

const { Schema } = mongoose;

const mobNodeSchema = new Schema({
    mobId: String, // how can we reference a Mob's ObjectId, which would be embedded in a zone?
    quantity: Number
});

export default mobNodeSchema;