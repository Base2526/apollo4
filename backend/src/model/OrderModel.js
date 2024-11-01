import mongoose from 'mongoose';

import { fileSchema as file } from "./FileModel";

const Schema = mongoose.Schema

const historySchema = new Schema({
    version: Number,
    data: Schema.Types.Mixed,
    updatedAt: Date
});

const productSchema = new Schema({
    // productId: { type: Schema.Types.ObjectId, required:[true, "Product-ID is a required field"]},
    product: { 
        _id: {
            type: Schema.Types.ObjectId, 
            required: true,
        },
        price: { type: Number , default: 0 },
        price_sell: { type: Number , default: 0 },
        price_discount_bm:  { type: Number , default: 0 },
        price_discount_bs:  { type: Number , default: 0 },
        price_discount_from_children:  { type: Number , default: 0 },
        price_discount_from_office:  { type: Number , default: 0 },
        all_sale:  { type: Number , default: 0 },
        price_delivery: { type: Number , default: 0 },
    },
    quantities: { 
                    type: Number,
                    required: true,
                    min: [1, 'Quantity must be at least 1'], 
                },
});

const orderSchema = new Schema({
    current: {
        products: { type: [productSchema], required:[true, "Products is a required field"]},
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