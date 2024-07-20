import mongoose from 'mongoose';
const Schema = mongoose.Schema

const historySchema = new Schema({
    version: Number,
    data: Schema.Types.Mixed,
    updatedAt: Date
});

var childSchema  = new Schema({
    childId: { type: Schema.Types.ObjectId },
    updateTime : { type : Date, default: Date.now },
})

const mlmSchema = new Schema({
    
    // parentId: { type: Schema.Types.ObjectId, default : null },
    // childs: [childSchema],
    // level: Number

    current: {
        parentId: { type: Schema.Types.ObjectId, default : null },
        childs: [childSchema],
        level: Number,
        updatedAt: Date
    },
    history: [historySchema]
},
{
    timestamps: true
})

export default mongoose.model('mlm', mlmSchema,'mlm')