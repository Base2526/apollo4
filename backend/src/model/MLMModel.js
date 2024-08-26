import mongoose from 'mongoose';
const Schema = mongoose.Schema

const historySchema = new Schema({
    version: Number,
    data: Schema.Types.Mixed,
    updatedAt: Date
});

// var childSchema  = new Schema({
//     childId: { type: Schema.Types.ObjectId, required:[true, "Child ID Request is a required field"]},
//     updatedAt : { type : Date, default: Date.now },
// })

const mlmSchema = new Schema({
    current: {
        // เจ้าของ node
        ownerId: { type: Schema.Types.ObjectId, required:[true, "Level Request is a required field"]},

        // Case parent have multi level, we must know node id for connect
        //                            parent nodeId 1 (level0)
        // parent nodeId 1(level1)/1(numbe1), parent nodeId 1(level1)/2(number2), parent nodeId 1(level1)/3(number3)... parent nodeId 1(level1)/7(number7) 
        // parent nodeId 2(level2)/1(numbe1), parent nodeId 2(level2)/2(numbe2), (level2) parent nodeId 2(level2)/3(numbe3) ... parent nodeId 2(level2)/49(numbe49)
        // parent nodeId 3(level3)/1(numbe1) parent nodeId 3(level3)/2(numbe2) parent nodeId 3(level3)/3(numbe3) ... parent nodeId 3(level3)/343(numbe343)
        parentId: { type: Schema.Types.ObjectId, default : null },  
        level: { type: Number, required:[true, "Level Request is a required field"]},  
        number: { type: Number, required:[true, "Number Request is a required field"]},  

        // childs: [childSchema],
        status: [{ 
            type: Number,
            enum : [1/*waiting*/, 2/*ready*/, 3 /*paid*/],
            default: 1
        }],
        updatedAt: { type : Date, default: Date.now },
    },
    history: [historySchema]
},
{
    timestamps: true
})

export default mongoose.model('mlm', mlmSchema,'mlm')