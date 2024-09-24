import mongoose from 'mongoose';
const Schema = mongoose.Schema

const historySchema = new Schema({
    version: Number,
    data: Schema.Types.Mixed,
    updatedAt: Date
});

const amountSchema = new Schema({
    value:  { 
                type: Number, 
                required: [true, "Amount value is a required field"],
                min: [0, "Amount value must be at least 0"] 
            },
    lastUpdate: { type: Date },
    period: {
        startDate: { type: Date, required: [true, "Start date is a required field"] },
        endDate: { type: Date, required: [true, "End date is a required field"] }
    }
})

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

        // 6/Sep/24 คนแนะนำ
        suggester: { type: Schema.Types.ObjectId, default: null },  

        // 23/sep/24 เก็บ amount ของแต่บะ node
        amount: {type: amountSchema },
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