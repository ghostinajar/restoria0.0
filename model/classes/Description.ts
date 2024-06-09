import mongoose from 'mongoose';

const { Schema } = mongoose;

export interface IDescription {
    look?: string;
    examine?: string;
    study?: string;
    research?: string
}

const descriptionSchema = new Schema<IDescription>({   
    look : String,
    examine : String,
    study : String,
    research : String,
}, { _id: false });

export default descriptionSchema;