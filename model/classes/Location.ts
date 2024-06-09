import mongoose from 'mongoose';

const { Schema } = mongoose;

export interface ILocation {
    inZone: mongoose.Schema.Types.ObjectId,
    inRoom: mongoose.Schema.Types.ObjectId,
}

const locationSchema = new Schema<ILocation>({
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