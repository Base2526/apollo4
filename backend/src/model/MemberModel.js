import mongoose from 'mongoose';
const Schema = mongoose.Schema

import { ADMINISTRATOR, AUTHENTICATED } from "../constants"

const historySchema = new Schema({
    version: Number,
    data: Schema.Types.Mixed,
    updatedAt: Date
});

const memberSchema = new Schema({
    current: {
        // parentId: { type: Schema.Types.ObjectId, required:[true, "Parent ID Request is a required field"]  },
        parentId: { type: Schema.Types.ObjectId, default: null },
        username: { type: String, unique: true, required:[true, "Username Request is a required field"] },
        password: { type: String, required:[true, "Password Request is a required field"] },
        email: { type: String, unique: true, required:[true, "Email Request is a required field"] },
        tel: { type: String, unique: true, required:[true, "Email Request is a required field"] },
        displayName: { type: String, required:[true, "Email Request is a required field"]},
        idCard: { type: String, required:[true, "ID Card Request is a required field"]},
        address: { type: String },
        packages: { 
            type: Number,
            enum : [1, 2, 3],
            default: 1
        },
        roles: {
            type: [Number],
            enum: [AUTHENTICATED, ADMINISTRATOR],
            default: [AUTHENTICATED],
        },
        isActive: {
            type: Number,
            enum : [0, 1], // 0: FALSE, 1: TRUE
            default: 0
        },
        avatar:{
            url: { type: String },
            filename: { type: String },
            mimetype: { type: String },
            encoding: { type: String },
        },
        lockAccount: {
            lock: { type: Boolean, default: false },
            date: { type : Date, default: Date.now },
        },
        lastAccess : { type : Date, default: Date.now },
    },
    history: [historySchema]
},
{
    timestamps: true
})

export default mongoose.model('member', memberSchema,'member')