import mongoose from 'mongoose';

const { Schema } = mongoose;

interface IChatter {
    commandWord: String;
    toTarget: String;
    toRoom: String;
}

const chatterSchema = new Schema<IChatter>({
    commandWord: String,
    toTarget: String,
    toRoom: String,
});

export default chatterSchema;