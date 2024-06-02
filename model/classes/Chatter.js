import mongoose from 'mongoose';

const { Schema } = mongoose;

const chatterSchema = new Schema({
    commandWord: String,
    toTarget: String,
    toRoom: String,
});

export default chatterSchema;