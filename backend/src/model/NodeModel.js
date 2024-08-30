import mongoose from 'mongoose';
const Schema = mongoose.Schema

const historySchema = new Schema({
    version: Number,
    data: Schema.Types.Mixed,
    updatedAt: Date
});

const nodeSchema = new Schema({
    current: {
        ownerId: { type: Schema.Types.ObjectId, required: [true, "Owner ID is a required field"] },
        // parentNodeId: { type: Schema.Types.ObjectId, required: [true, "Parent Node ID is a required field"] },
        parentNodeId: { type: Schema.Types.ObjectId, default: null },
        number: { type: Number },
        isParent: {
            type: Boolean,
            default: false,
        },
        status: { 
            type: Number,
            enum : [0/*unpaid*/, 1/*paid*/],
            default: 0
        },
    },
    history: [historySchema]
},
{
    timestamps: true
});

export default mongoose.model('node', nodeSchema,'node')

/*
{
    _id: ObjectId('66c567b58acb120679a5288b'),
    current: {
        parentNodeId: null,
        ownerId: ObjectId('66c4b084cd538705b46a616b'),
        number: 1,
        status: 0,
        isParent: true
    },
    history: [],
    createdAt: ISODate('2024-08-26T17:22:56.781Z'),
    updatedAt: ISODate('2024-08-26T17:22:56.781Z'),
    __v: 0
}
*/