import React from 'react';
import { Form, Input, Select, Button, DatePicker, Collapse } from 'antd';

import {  Row, Col } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';


const { Option } = Select;
const { Panel } = Collapse;

interface FormValues {
  policyNumber: string;
  type: string;
  evidence: string;
  number: string;
  houseNumber: string;
  villageNumber: string;
  prefix: string;
  firstName: string;
  lastName: string;
  village: string;
  alley: string;
  lane: string;
  province: string;
  district: string;
  subDistrict: string;
  postalCode: string;
  mobile: string;
  phone: string;
  occupation: string;
  workplace: string;
  branch: string;
  birthDate: moment.Moment | null;
  gender: string;
  nationality: string;

  companyManager: string;
  idNumber: string;
  dob: moment.Moment;
  registeredAddress: string;
  currentAddress: string;

  carCode?: string;
  startDate?: moment.Moment;
  endDate?: moment.Moment;
  contractDate?: moment.Moment;
  carName?: string;
  carModel?: string;
  carYear?: string;
  carColor?: string;
  plateType?: string;
  category?: string;
  carCountry?: string;
  vin?: string;
  plate1?: string;
  plate2?: string;
  plateProvince?: string;
  cc?: string;
  seats?: string;
  weight?: string;
  days?: string;
  cost?: string;
}

const insurancePage: React.FC = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values: FormValues) => {
    console.log('Form values:', values);
  };

  return (
          <div>
            <div>กรมธรรม์ใหม่ : อลิอันซ์ อยุธยา ประกันภัย</div>
            <Form 
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
              initialValues={{
                type: 'บุคคลธรรมดา',
                evidence: 'บัตรประชาชน',
                prefix: 'คุณ',
                occupation: 'อื่นๆ',
                workplace: 'สำนักงานใหญ่',
                gender: '-',
                nationality: 'Thai',

                companyManager: '',
                idNumber: '',
                dob: null,
                registeredAddress: '',
                currentAddress: '',

                carCode: '',
                startDate: null,
                endDate: null,
                contractDate: null,
                carName: '',
                carModel: '',
                carYear: '',
                carColor: '',
                plateType: '',
                category: '',
                carCountry: '',
                vin: '',
                plate1: '',
                plate2: '',
                plateProvince: '',
                cc: '',
                seats: '',
                weight: '',
                days: '',
                cost: '',
              }}>
              <Collapse defaultActiveKey={['1']} bordered={false} collapsible="disabled">
                <Panel header="" key="1" showArrow={false}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item label="เลขที่กรมธรรม์" name="policyNumber">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="ประเภท" name="type">
                        <Select>
                          <Option value="บุคคลธรรมดา">บุคคลธรรมดา</Option>
                          <Option value="นิติบุคคล">นิติบุคคล</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="หลักฐาน" name="evidence">
                        <Select>
                          <Option value="บัตรประชาชน">บัตรประชาชน</Option>
                          <Option value="หนังสือเดินทาง">หนังสือเดินทาง</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item label="เลขที่" name="number" rules={[{ required: true, message: 'Please enter the number' }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="บ้านเลขที่" name="houseNumber" rules={[{ required: true, message: 'Please enter the house number' }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="หมู่ที่" name="villageNumber" rules={[{ required: true, message: 'Please enter the village number' }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item label="คำแนะนำหน้า" name="prefix">
                        <Select>
                          <Option value="คุณ">คุณ</Option>
                          <Option value="นาย">นาย</Option>
                          <Option value="นาง">นาง</Option>
                          <Option value="นางสาว">นางสาว</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="ชื่อ" name="firstName" rules={[{ required: true, message: 'Please enter the first name' }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="นามสกุล" name="lastName" rules={[{ required: true, message: 'Please enter the last name' }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item label="หมู่บ้าน/ตึก/อาคาร" name="village">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="ตรอก" name="alley">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="ซอย" name="lane">
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item label="จังหวัด" name="province" rules={[{ required: true, message: 'Please select the province' }]}>
                        <Select>
                          <Option value="กรุงเทพ">กรุงเทพ</Option>
                          {/* Add more options here */}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="อำเภอ/เขต" name="district" rules={[{ required: true, message: 'Please select the district' }]}>
                        <Select>
                          <Option value="เขตบางรัก">เขตบางรัก</Option>
                          {/* Add more options here */}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="ตำบล/แขวง" name="subDistrict" rules={[{ required: true, message: 'Please select the sub-district' }]}>
                        <Select>
                          <Option value="บางรัก">บางรัก</Option>
                          {/* Add more options here */}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item label="รหัสไปรษณีย์" name="postalCode" rules={[{ required: true, message: 'Please enter the postal code' }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="มือถือ" name="mobile">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="โทรศัพท์" name="phone">
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item label="อาชีพ" name="occupation">
                        <Select>
                          <Option value="อื่นๆ">อื่นๆ</Option>
                          {/* Add more options here */}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="สถานที่ประกอบการ" name="workplace">
                        <Select>
                          <Option value="สำนักงานใหญ่">สำนักงานใหญ่</Option>
                          {/* Add more options here */}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="สาขา" name="branch">
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item label="วันเดือนปีเกิด" name="birthDate">
                        <DatePicker format="D/M/YYYY" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="เพศ" name="gender">
                        <Select>
                          <Option value="-">-</Option>
                          <Option value="ชาย">ชาย</Option>
                          <Option value="หญิง">หญิง</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="สัญชาติ" name="nationality">
                        <Select>
                          <Option value="Thai">Thai</Option>
                          {/* Add more options here */}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Panel>
              </Collapse>
              <Collapse defaultActiveKey={['2']} bordered={false} collapsible="disabled">
                <Panel header="เฉพาะไทยไพบูลย์ที่ต้องกรอก กรณีลูกค้าเป็นนิติบุคคล" key="2" showArrow={false}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        name="companyManager"
                        label="ชื่อกรรมการ บริษัท"
                        rules={[{ required: true, message: 'กรุณาใส่ชื่อกรรมการ บริษัท' }]}
                      >
                        <Input prefix={<UserOutlined />} placeholder="ชื่อกรรมการ บริษัท" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="idNumber"
                        label="เลขที่ บัตรประชาชน กรรมการ"
                        rules={[{ required: true, message: 'กรุณาใส่เลขที่ บัตรประชาชน กรรมการ' }]}
                      >
                        <Input placeholder="เลขที่ บัตรประชาชน กรรมการ" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="dob"
                        label="วันเดือนปีเกิด กรรมการ(พ.ศ)"
                        rules={[{ required: true, message: 'กรุณาใส่วันเดือนปีเกิด กรรมการ' }]}
                      >
                        <DatePicker style={{ width: '100%' }} placeholder="เลือกวันเดือนปีเกิด" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        name="registeredAddress"
                        label="ที่อยู่ที่จดทะเบียน"
                        rules={[{ required: true, message: 'กรุณาใส่ที่อยู่ที่จดทะเบียน' }]}
                      >
                        <Input.TextArea rows={2} placeholder="ที่อยู่ที่จดทะเบียน" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        name="currentAddress"
                        label="ที่อยู่ปัจจุบัน"
                        rules={[{ required: true, message: 'กรุณาใส่ที่อยู่ปัจจุบัน' }]}
                      >
                        <Input.TextArea rows={2} placeholder="ที่อยู่ปัจจุบัน" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Panel>
              </Collapse>
              <Collapse defaultActiveKey={['3']} bordered={false} collapsible="disabled">
                <Panel header="รายละเอียดรถ" key="3" showArrow={false}>
                  <Row gutter={16}>
                    <Col span={6}>
                      <Form.Item
                        name="carCode"
                        label="รหัสรถ"
                        rules={[{ required: true, message: 'กรุณาเลือก รหัสรถ' }]}
                      >
                        <Select>
                          <Option value="รหัส1">รหัส1</Option>
                          {/* Add more options here */}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="coverageDate"
                        label="วันคุ้มครอง(พ.ศ)"
                        rules={[{ required: true, message: 'กรุณาเลือก วันคุ้มครอง' }]}
                      >
                        <DatePicker format="D/M/YYYY" />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="endDate"
                        label="วันสิ้นสุด(พ.ศ)"
                        rules={[{ required: true, message: 'กรุณาเลือก วันสิ้นสุด' }]}
                      >
                        <DatePicker format="D/M/YYYY" />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="contractDate"
                        label="วันทำสัญญา"
                        rules={[{ required: true, message: 'กรุณาเลือก วันทำสัญญา' }]}
                      >
                        <DatePicker format="D/M/YYYY" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={6}>
                      <Form.Item
                        name="carName"
                        label="ชื่อรถ"
                        rules={[{ required: true, message: 'กรุณาเลือก ชื่อรถ' }]}
                      >
                        <Select>
                          <Option value="ชื่อรถ1">ชื่อรถ1</Option>
                          {/* Add more options here */}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="carModel"
                        label="รุ่นรถ"
                        rules={[{ required: true, message: 'กรุณาเลือก รุ่นรถ' }]}
                      >
                        <Select>
                          <Option value="รุ่นรถ1">รุ่นรถ1</Option>
                          {/* Add more options here */}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="carYear"
                        label="ปีรถ(ใส่ปี ค.ศ.)"
                        rules={[{ required: true, message: 'กรุณากรอก ปีรถ' }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="carColor"
                        label="สีรถ"
                        rules={[{ required: true, message: 'กรุณาเลือก สีรถ' }]}
                      >
                        <Select>
                          <Option value="สีรถ1">สีรถ1</Option>
                          {/* Add more options here */}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={6}>
                      <Form.Item
                        name="plateType"
                        label="ชนิดป้าย"
                      >
                        <Select defaultValue="รถในประเทศ มีทะเบียน">
                          <Option value="รถในประเทศ มีทะเบียน">รถในประเทศ มีทะเบียน</Option>
                          {/* Add more options here */}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="carType"
                        label="ประเภท"
                      >
                        <Select defaultValue="ปกติ">
                          <Option value="ปกติ">ปกติ</Option>
                          {/* Add more options here */}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="carCountry"
                        label="ประเทศรถ"
                      >
                        <Select defaultValue="ไทย">
                          <Option value="ไทย">ไทย</Option>
                          {/* Add more options here */}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="chassisNumber"
                        label="เลขตัวถัง"
                        rules={[{ required: true, message: 'กรุณากรอก เลขตัวถัง' }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={6}>
                      <Form.Item
                        name="registration1"
                        label="ทะเบียน 1"
                        rules={[{ required: true, message: 'กรุณากรอก ทะเบียน 1' }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="registration2"
                        label="ทะเบียน 2"
                        rules={[{ required: true, message: 'กรุณากรอก ทะเบียน 2' }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="registrationProvince"
                        label="ทะเบียน จังหวัด"
                        rules={[{ required: true, message: 'กรุณาเลือก ทะเบียน จังหวัด' }]}
                      >
                        <Select>
                          <Option value="กรุงเทพ">กรุงเทพ</Option>
                          {/* Add more options here */}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="cc"
                        label="ซีซี"
                        rules={[{ required: true, message: 'กรุณากรอก ซีซี' }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={6}>
                      <Form.Item
                        name="seats"
                        label="ที่นั่ง"
                        rules={[{ required: true, message: 'กรุณากรอก ที่นั่ง' }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="weight"
                        label="น้ำหนัก"
                        rules={[{ required: true, message: 'กรุณากรอก น้ำหนัก' }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="days"
                        label="วัน"
                      >
                        <Input defaultValue="365" />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="cost"
                        label="ค่าใช้จ่าย"
                      >
                        <Input defaultValue="0.00" readOnly />
                      </Form.Item>
                    </Col>
                  </Row>
                </Panel>
              </Collapse>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  บันทึก
                </Button>
                <Button style={{ marginLeft: '8px' }}>
                  กลับ
                </Button>
              </Form.Item>
            </Form>
          </div>
        );
};

export default insurancePage;

