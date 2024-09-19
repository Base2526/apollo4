import mongoose from 'mongoose';
const Schema = mongoose.Schema

const historySchema = new Schema({
    version: Number,
    data: Schema.Types.Mixed,
    updatedAt: Date
});

const orderSchema = new Schema({
    _isDEV: { type: Boolean, default: false },
    current: {
        productId: { type: [Schema.Types.ObjectId], required:[true, "Product-ID is a required field"]},
        ownerId: { type: Schema.Types.ObjectId, required:[true, "Owner-ID is a required field"]},
        editer: { type: Schema.Types.ObjectId },
        message: { type: String  },
        status: { type: Number, 
                  enum: [1, 2, 3], // 1 : waiting, 2: complete, 3: cancel
                  required:[true, "Status is a required field"] },
    },
    history: [historySchema]
},
{
    timestamps: true
})

const order = mongoose.model('order', orderSchema,'order')
export default order