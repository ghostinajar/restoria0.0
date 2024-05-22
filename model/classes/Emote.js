import mongoose from 'mongoose';

const { Schema } = mongoose;

const emoteSchema = new Schema({
    commandWord: String,
    text: String,
    //TODO add strings for what is echoed when this emote targets a character
});

export default emoteSchema;