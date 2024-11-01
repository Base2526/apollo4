import mongoose from 'mongoose';

const Schema = mongoose.Schema

const positionSchema = new Schema({
  _id: { type: Schema.Types.ObjectId },
  name: { type: String, required:[true, "Name is a required field"]},
  percent: { type: Number },
  budget: { type: Number },
  level: { type: Number },
  description: { type: String }
},
{
    timestamps: true
})

const Position = mongoose.model('position', positionSchema,'position')
export default Position