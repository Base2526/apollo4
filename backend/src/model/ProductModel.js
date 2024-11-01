import mongoose from 'mongoose';
import { fileSchema as file } from "./FileModel";

const Schema = mongoose.Schema
const historySchema = new Schema({
    version: Number,
    data: Schema.Types.Mixed,
    updatedAt: Date
});

const productSchema = new Schema({
    // _isDEV: { type: Boolean, default: false },
    current: {
        ownerId: { type: Schema.Types.ObjectId, required:[true, "Owner-ID is a required field"]},
        name: { type: String, required:[true, "Name Request is a required field"] },
        price: { type: Number , default: 0 },
        price_sell: { type: Number , default: 0 },
        detail: { type: String  },
        images: { type: [file], default: [] }, 
        quantity: { type: Number , default: 0 },
        price_front: { type: Number , default: 0 },
        package_front: { type: [Number], enum: [1,2,3], default: [] }, 
        package_back: { type: [Number], enum: [1,2,3], default: [] }, 
        product_type: { type: [Number], default: [] }, 
        price_discount_bm:  { type: Number , default: 0 },
        price_discount_bs:  { type: Number , default: 0 },
        price_discount_from_children:  { type: Number , default: 0 },
        price_discount_from_office:  { type: Number , default: 0 },
        all_sale:  { type: Number , default: 0 },

        price_delivery: { type: Number , default: 0 },
    },
    history: [historySchema]
},
{
    timestamps: true
})

// const product = mongoose.model('product', productSchema,'product')
// export default product

const product = mongoose.model('product', productSchema,'product')
export {
    product,
    productSchema
} 