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

        product_type: { type: [Number], enum: [1,2], default: [] },     // 1: แผนหน้า, 2: แผนหลัง
        option_front: { type: [Number], enum: [1,2], default: [] },     // 1: เอกสิทธิพิเศษ, 2: Power ship
        package_front: { type: [Number], enum: [1,2,3], default: [] },  // 1: 1, 2: 8, 3: 56
        option_back: { type: [Number], enum: [1,2], default: [] },      // 1: เอกสิทธิพิเศษ, 2: Power ship
        package_back: { type: [Number], enum: [1,2,3], default: [] },   // 1: 1, 2: 8, 3: 56
        

        price_discount_bm:  { type: Number , default: 0 },
        price_discount_bs:  { type: Number , default: 0 },
        price_discount_from_children:  { type: Number , default: 0 },
        price_discount_from_office:  { type: Number , default: 0 },
        all_sale:  { type: Number , default: 0 },

        price_delivery: { type: Number , default: 0 },

        // 01/11/24  0: none, 1: Include, 2: Exclude
        vat: { type: Number, enum: [0,1,2] , default: 0 },
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