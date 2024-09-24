import mongoose from 'mongoose';

import { fileSchema as file } from "./FileModel";

const Schema = mongoose.Schema

const historySchema = new Schema({
    version: Number,
    data: Schema.Types.Mixed,
    updatedAt: Date
});

const productIdSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, required:[true, "Product-ID is a required field"]},
    quantities: { 
                    type: Number,
                    required: true,
                    min: [1, 'Quantity must be at least 1'], 
                },
});

const orderSchema = new Schema({
    _isDEV: { type: Boolean, default: false },
    current: {
        productIds: { type: [productIdSchema], required:[true, "Products-ID is a required field"]},
        ownerId: { type: Schema.Types.ObjectId, required:[true, "Owner-ID is a required field"]},
        editer: { type: Schema.Types.ObjectId },
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