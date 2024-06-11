import mongoose from 'mongoose';

const { Schema } = mongoose;

export interface IEmote {
    commandWord: String;
    toTarget: String;
    toRoom: String;
}

const emoteSchema = new Schema<IEmote>({
    commandWord: String,
    toTarget: String,
    toRoom: String
});

export default emoteSchema;