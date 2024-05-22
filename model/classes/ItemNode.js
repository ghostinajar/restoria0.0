import mongoose from 'mongoose';

const { Schema } = mongoose;

const itemNodeSchema = new Schema({
    itemId: String, // how can we reference a Mob's ObjectId, which would be embedded in a zone?
    quantity: Number
});

export default itemNodeSchema;
