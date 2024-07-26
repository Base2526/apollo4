import mongoose from 'mongoose';

const Schema = mongoose.Schema
const fileSchema = new Schema({
    url: { type: String },
    filename: { type: String },
    mimetype: { type: String },
    encoding: { type: String },
},
{
    timestamps: true
})

const file = mongoose.model('file', fileSchema,'file')
export default file