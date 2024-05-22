import mongoose from 'mongoose';

const { Schema } = mongoose;

const chatterSchema = new Schema({
    commandWord: String,
    text: String,
    //TODO add strings for what is echoed when this chatter targets a character
});

export default chatterSchema;