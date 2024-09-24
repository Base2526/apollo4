import mongoose from 'mongoose';

const Schema = mongoose.Schema
const periodSchema = new Schema({
    start: { type: Date, required:[true, "Start date is a required field"]},
    end: { type: Date, required:[true, "End date is a required field"]},
},
{
    timestamps: true
})

const period = mongoose.model('period', periodSchema,'period')
export default period