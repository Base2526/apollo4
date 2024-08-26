import mongoose from 'mongoose';
const Schema = mongoose.Schema

const nodeSchema = new Schema({
    ownerId: { type: Schema.Types.ObjectId, required: [true, "Owner ID is a required field"] },
    parentNodeId: { type: Schema.Types.ObjectId, required: [true, "Parent Node ID is a required field"] },
    level: { type: Number, required: [true, "Level is a required field"] },
    number: { type: Number },
    status: { 
        type: Number,
        enum : [0/*unpaid*/, 1/*paid*/],
        default: 0
    },
},
{
    timestamps: true
});

export default mongoose.model('node', nodeSchema,'node')