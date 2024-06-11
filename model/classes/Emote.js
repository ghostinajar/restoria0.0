import mongoose from 'mongoose';
const { Schema } = mongoose;
const emoteSchema = new Schema({
    commandWord: String,
    toTarget: String,
    toRoom: String
});
export default emoteSchema;
