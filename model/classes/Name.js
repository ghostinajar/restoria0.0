import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const nameSchema = new Schema({
    name: { type: String, required: true, unique: true }
});

const Name = model('Name', nameSchema);
export default Name;
