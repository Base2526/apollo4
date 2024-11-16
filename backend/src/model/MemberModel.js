import mongoose from 'mongoose';
const Schema = mongoose.Schema

import { ADMINISTRATOR, AUTHENTICATED } from "../constants"

const historySchema = new Schema({
    version: Number,
    data: Schema.Types.Mixed,
    updatedAt: Date
});

const positionIdSchema = new Schema({
    version: Number,
    positionId: {
        type: Schema.Types.ObjectId, 
        default: mongoose.Types.ObjectId('6721098ce9dccb02aab4cb3e'),
        required: true,
    },
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

        // 09/Oct/24 
        // ระบุยี่ห้อรถ
        car_brand: { type: String },
        // เลือกรุ่นรถ
        car_model: { type: String },
        // เลือกปีรุ่น
        car_year_model: { type: String },
        // เดือนที่หมดอายุ
        car_month_expired: { type: String },
        // เลือกรุ่นย่อย
        // car_sub_model: { type: String },
        // เดือนที่ประกันภัยของท่านหมดอายุ
        // car_date_register:  { type : Date, default: Date.now },


        /*
        car_brand :  "SUZUKI"
        car_model :  "Swift"
        car_month_expired : 8
        car_year_model : 2567
        email : "test001@test.local"
        idCard :  "3452353245454"
        packages : 1
        parentId : "66c4b084cd538705b46a616b"
        tel : "4325454345"
        username : "somkid"
        */
    
        // 23/Oct/24
        // ตำแหน่ง
        position: {
            type: String,
            enum: ["BM", "BS", "BG", "BD", "BP", "MA", "MB", "MC", "MD", "ME", "MF", "MG", "MH", "MI", "MJ", "MK", "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS"],  // Enum values
            default: 'BM',  // Default value
            required: true,
        },
        positionId: { 
            type: Schema.Types.ObjectId, 
            default: mongoose.Types.ObjectId('6721098ce9dccb02aab4cb3e'),
            required: true,
        },
        positionIds:[ {
            type: positionIdSchema,
            default: () => ({
              version: 1,
              positionId: mongoose.Types.ObjectId('6721098ce9dccb02aab4cb3e'), // default positionId
              updatedAt: new Date(),
            }),
            required: true,
        }],
        address_delivery:{
            name: { type: String },
            phone: { type: String },
            address: { type: String },
        }
    },
    history: [historySchema]
},
{
    timestamps: true
})

// Add pre-save hook here
// memberSchema.pre('save', function(next) {
//     console.log("Add pre-save hook here ")
//     if (!this.positionIds || this.positionIds.length === 0) {
//         this.positionIds = [{
//             version: 1,
//             positionId: mongoose.Types.ObjectId('6721098ce9dccb02aab4cb3e'),
//             updatedAt: new Date(),
//         }];
//     }
//     next();
// });

// export default mongoose.model('member', memberSchema,'member')

const member = mongoose.model('member', memberSchema,'member')
export {
    member,
    memberSchema
} 