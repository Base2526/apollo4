import mongoose from 'mongoose';
const Schema = mongoose.Schema
const calTreeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: [true, "User ID is a required field"] },
  path: { type: String, required:[true, "Path is a required field"] },
  fileName: { type: String, required:[true, "File Name is a required field"] },
  status: { 
    type: Number,
    enum : [0/*failed*/, 1/*success*/],
    default: 0
  },
},
{
    timestamps: true
})

const CalTree = mongoose.model('caltree', calTreeSchema,'caltree')
export default CalTree