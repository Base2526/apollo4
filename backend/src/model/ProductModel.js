import mongoose from 'mongoose';

import { fileSchema as file } from "./FileModel";

const Schema = mongoose.Schema

const productSchema = new Schema({
    ownerId: { type: Schema.Types.ObjectId, required:[true, "Owner-ID is a required field"]},
    name: { type: String, required:[true, "Name Request is a required field"] },
    detail: { type: String  },
    plan: { type: [Number], 
            enum: [1, 2], // 1 : Frontend, 2 :Backend
            required:[true, "Plan Request is a required field"] },
    price: { type: Number  },
    packages: { type: [Number], 
                enum: [1,2,3], // 1, 8, 57
                required:[true, "Packages Request is a required field"] },
    images: { type: [file], default: [] }, 
},
{
    timestamps: true
})

/*
 type: [Number],
            enum: [AUTHENTICATED, ADMINISTRATOR],
            default: [AUTHENTICATED],
*/

const product = mongoose.model('product', productSchema,'product')
export default product