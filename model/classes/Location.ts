// Location

import { Schema, Types } from 'mongoose';

export interface ILocation {
    inZone: Types.ObjectId;
    inRoom: Types.ObjectId;
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