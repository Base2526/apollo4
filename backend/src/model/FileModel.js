import mongoose from 'mongoose';

const Schema = mongoose.Schema
const fileSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required:[true, "User-ID is a required field"]},
    url: { type: String },
    filename: { type: String },
    mimetype: { type: String },
    encoding: { type: String },
},
{
    timestamps: true
})

const file = mongoose.model('file', fileSchema,'file')
export {
    file,
    fileSchema
} 