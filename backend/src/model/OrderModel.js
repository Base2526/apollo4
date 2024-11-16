import mongoose from 'mongoose';

import { productSchema as ProductSchema } from "./ProductModel";
// import { memberSchema as MemberSchema } from "./MemberModel";
import { fileSchema as file } from "./FileModel";

const Schema = mongoose.Schema

const historySchema = new Schema({
    version: Number,
    data: Schema.Types.Mixed,
    updatedAt: Date
});

const productType = new Schema({
    product: { 
        _id: {
            type: Schema.Types.ObjectId, 
            required: true,
        },
        ...ProductSchema.obj.current
    },
    quantities: { 
                    type: Number,
                    required: true,
                    min: [1, 'Quantity must be at least 1'], 
                },
});

const orderSchema = new Schema({
    current: {
        type_plan: {    type: Number, 
                        enum: [1, 2], // 1 : แผนหน้า, 2: แผนหลัง
                        required:[true, "Type plan is a required field"] },
        products: { 
                    type: [productType], 
                    required:[true, "Products is a required field"]
                },
        owner: { 
            _id: { 
                type: Schema.Types.ObjectId, 
                required: true,
            },
            positionId: { 
                type: Schema.Types.ObjectId, 
                required: true,
            }
        }, // เจ้าของ order
        editer: { type: Schema.Types.ObjectId },                                     // คน  edit/update
        message: { type: String  },
        attachFile: { type: [file], default: [] }, 
        status: { type: Number, 
                  enum: [1, 2, 3, 4], // 1 : waiting, 2: complete, 3: cancel, 4: delete
                  required:[true, "Status is a required field"] },
    },
    history: [historySchema]
},
{
    timestamps: true
})

const order = mongoose.model('order', orderSchema,'order')
export default order