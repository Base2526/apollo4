const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  version: Number,
  data: mongoose.Schema.Types.Mixed,
  updatedAt: Date
});

const AgentSchema = new mongoose.Schema({
    current: {
      code: { type: String, required: true },
      prefix: { type: String, enum: ['mr', 'ms', 'mrs'], required: true },
      address: { type: String, required: true },
      firstName: { type: String, required: true },
      province: { type: String, required: true },
      district: { type: String, required: true },
      lastName: { type: String, required: true },
      subDistrict: { type: String, required: true },
      postalCode: { type: String, required: true },
      status: { type: String, enum: ['active', 'inactive'], default: 'active' },
      agentType: { type: String, default: 'ตัวแทน' },
      mobile: { type: String, required: true },
      licenseNumber: { type: String, required: true },
      idCardNumber: { type: String, required: true },
      phone: { type: String, required: true },
      collateralAmount: { type: Number, required: true },
      creditLimit: { type: Number, required: true },
      email: { type: String, required: true },
      multipleAmount: { type: Number, default: 1.00 },
      availableCredit: { type: Number, required: true },
      lineupAgent: { type: String, default: 'A02495' },
      seiBrokerCode: { type: String, default: 'NPRA' },
      sjaBrokerCode: { type: String, default: 'NPRA' },
      salesAmount: { type: Number, default: 0 },
      paymentAmount: { type: Number, default: 0 },
      remainingCredit: { type: Number, default: 0 },
      oldCode: { type: String },
      remarks: { type: String },
      salesStatus: { type: String, default: 'เครดิต' },    
    },
    history: [historySchema]
}, { timestamps: true });

const Agent = mongoose.model("agent", AgentSchema, "agent");
export default Agent
