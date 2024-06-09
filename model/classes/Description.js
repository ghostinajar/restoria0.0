import mongoose from 'mongoose';
const { Schema } = mongoose;
const descriptionSchema = new Schema({
    look: String,
    examine: String,
    study: String,
    research: String,
}, { _id: false });
export default descriptionSchema;
