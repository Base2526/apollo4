import mongoose from 'mongoose';
import { fileSchema as file } from "./FileModel";

const Schema = mongoose.Schema

const historySchema = new Schema({
    version: Number,
    data: Schema.Types.Mixed,
    updatedAt: Date
});

const productSchema = new Schema({
    _isDEV: { type: Boolean, default: false },
    current: {
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
        quantity:  { type: Number , default: 0 },
    },
    history: [historySchema]
},
{
    timestamps: true
})

const product = mongoose.model('product', productSchema,'product')
export default product