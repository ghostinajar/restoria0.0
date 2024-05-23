import mongoose from 'mongoose';

const { Schema } = mongoose;

const locationSchema = new Schema({
    inZone: {
        type: Schema.Types.ObjectId,
        ref: 'Zone'
    },
    inRoom: {
        type: Schema.Types.ObjectId,
        ref: 'Room'
    }
}, { _id: false });

export default locationSchema;