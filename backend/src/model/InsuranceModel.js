const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  version: Number,
  data: mongoose.Schema.Types.Mixed,
  updatedAt: Date
});

const InsuranceSchema = new mongoose.Schema({
  current: {
    policyNumber: { type: String, required: true }, // เลขที่กรมธรรม์
    type: { type: String, enum: ['normal', 'juristic'], default: 'normal' }, // ประเภท
    evidence: { type: String, enum: ['id card', 'passport'], default: 'id card' }, // หลักฐาน
    number: { type: String, required: true }, // เลขที่
    houseNumber: { type: String, required: true }, // บ้านเลขที่
    group: { type: String, required: true }, // หมู่ที่
    title: { type: String, enum: ['mr', 'mrs', 'miss'], default: 'mr' }, // คำแนะนำหน้า
    firstName: { type: String, required: true }, // ชื่อ
    lastName: { type: String, required: true }, // นามสกุล
    village: { type: String }, // หมู่บ้าน/ตึก/อาคาร
    alley: { type: String }, // ตรอก
    soi: { type: String }, // ซอย
    province: { type: String, required: true }, // จังหวัด
    district: { type: String, required: true }, // อำเภอ/เขต
    subDistrict: { type: String, required: true }, // ตำบล/แขวง
    postalCode: { type: String, required: true }, // รหัสไปรษณีย์
    mobile: { type: String }, // มือถือ
    phone: { type: String }, // โทรศัพท์
    occupation: { type: String, default: 'other' }, // อาชีพ
    businessAddress: { type: String }, // สถานที่ประกอบการ
    branch: { type: String }, // สาขา
    birthDate: { type: Date }, // วันเดือนปีเกิด
    gender: { type: String, enum: ['-', 'male', 'female'], default: '-' }, // เพศ
    nationality: { type: String, default: 'Thai' }, // สัญชาติ
    companyManager: { type: String }, // ชื่อกรรมการ บริษัท
    idNumber: { type: String }, // เลขที่ บัตรประชาชน กรรมการ
    dob: { type: Date }, // วันเดือนปีเกิด กรรมการ(พ.ศ)
    registeredAddress: { type: String }, // ที่อยู่ที่จดทะเบียน
    currentAddress: { type: String }, // ที่อยู่ปัจจุบัน
    vehicleCode: { type: String }, // รหัสรถ
    coverageStartDate: { type: Date }, // วันคุ้มครอง(พ.ศ)
    coverageEndDate: { type: Date }, // วันสิ้นสุด(พ.ศ)
    contractDate: { type: Date }, // วันทำสัญญา
    vehicleName: { type: String }, // ชื่อรถ
    vehicleModel: { type: String }, // รุ่นรถ
    vehicleYear: { type: Number }, // ปีรถ(ใส่ปี ค.ศ.)
    vehicleColor: { type: String }, // สีรถ
    plateType: { type: String}, // ชนิดป้าย
    vehicleType: { type: String, default: 'normal' }, // ประเภท
    vehicleCountry: { type: String, default: 'thai' }, // ประเทศรถ
    chassisNumber: { type: String }, // เลขตัวถัง
    registrationNumber1: { type: String }, // ทะเบียน 1
    registrationNumber2: { type: String }, // ทะเบียน 2
    registrationProvince: { type: String }, // ทะเบียน จังหวัด
    cc: { type: Number }, // ซีซี
    seats: { type: Number }, // ที่นั่ง
    weight: { type: Number }, // น้ำหนัก
    days: { type: Number, default: 365 }, // วัน
    expenses: { type: Number, default: 0.00 }, // ค่าใช้จ่าย
  },
  history: [historySchema]
},
{
  timestamps: true,
});

const Insurance = mongoose.model("insurance", InsuranceSchema, "insurance");
export default Insurance
