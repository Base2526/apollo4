import mongoose from 'mongoose';
const Schema = mongoose.Schema

const historySchema = new Schema({
    version: Number,
    data: Schema.Types.Mixed,
    updatedAt: Date
});

const logUserAccessSchema = new Schema({
    current: {
        websocketKey: {type: String, required:[true, "websocketKey Request is a required field"] },
        userId: { type: Schema.Types.ObjectId, required:[true, "userId Request is a required field"] },
        request: { type: Object },
        connectTime: { type : Date,  default : null },
        disconnectTime: { type : Date,  default : null },
        updatedAt: { type : Date },
    },
    history: [historySchema]
},
{
    timestamps: true
})

export default mongoose.model('logUserAccess', logUserAccessSchema,'logUserAccess')