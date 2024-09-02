import React from 'react';
import { Row, Col, Input, Select, Button, Form } from 'antd';

const { Option } = Select;

interface FormValues {
  code: string;
  title: string;
  address: string;
  name: string;
  province: string;
  district: string;
  firstName: string;
  surname: string;
  subDistrict: string;
  postalCode: string;
  status: string;
  agentType: string;
  mobile: string;
  licenseNumber: string;
  idCardNumber: string;
  phone: string;
  collateralAmount: number;
  creditLimit: number;
  email: string;
  multipleAmount: number; //  multiplier
  availableCredit: number;
  lineUpAgent: string;
  seiBrokCode: string;
  sjaBrokCode: string;
  sales: number;
  payment: number;
  remainingCredit: number;
  oldCode: string;
  notes: string;
  salesStatus: string;
}

const AgentForm: React.FC = () => {
  const [form] = Form.useForm<FormValues>();

  const handleSubmit = (values: FormValues) => {
    console.log('Form values:', values);
    // Handle form submission, e.g., send data to the server
    // message.success('Form submitted successfully!');
  };

  const handleFailedSubmit = (errorInfo: any) => {
    console.error('Form submit failed:', errorInfo);
    // message.error('Form submission failed!');
  };

  return (
    <Form 
      layout="vertical"
      onFinish={handleSubmit}
      onFinishFailed={handleFailedSubmit}
      initialValues={{
        code: "",
        title: "",
        address: "",
        name: "",
        province: "",
        district: "",
        surname: "",
        subDistrict: "",
        postalCode: "",
        status: "",
        agentType: "",
        mobile: "",
        licenseNumber: "",
        idCardNumber: "",
        phone: "0988264820",
        collateralAmount: 0,
        creditLimit: 0,
        email: "a@local.local",
        multipleAmount: 0, //  multiplier
        availableCredit: 0,
        lineUpAgent: "",
        seiBrokCode: "",
        sjaBrokCode: "",
        sales: 0,
        payment: 0,
        remainingCredit: 0,
        oldCode: "",
        notes: "",
        salesStatus: "",
      }}>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="รหัส"
            name="code"
            rules={[{ required: true, message: 'กรุณากรอกรหัส' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="คำนำหน้า"
            name="prefix"
            rules={[{ required: true, message: 'กรุณาเลือกคำนำหน้า' }]}
          >
            <Select>
              <Option value="mr">Mr.</Option>
              <Option value="ms">Ms.</Option>
              <Option value="mrs">Mrs.</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="ที่อยู่"
            name="address"
            rules={[{ required: true, message: 'กรุณากรอกที่อยู่' }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="ชื่อ"
            name="name"
            rules={[{ required: true, message: 'กรุณากรอกชื่อ' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="จังหวัด"
            name="province"
            rules={[{ required: true, message: 'กรุณาเลือกจังหวัด' }]}
          >
            <Select>
              <Option value="bangkok">Bangkok</Option>
              {/* Add other options as needed */}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="อำเภอ/เขต"
            name="district"
            rules={[{ required: true, message: 'กรุณาเลือกอำเภอ/เขต' }]}
          >
            <Select>
              <Option value="someDistrict">Some District</Option>
              {/* Add other options as needed */}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="นามสกุล"
            name="surname"
            rules={[{ required: true, message: 'กรุณากรอกนามสกุล' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="ตำบล/แขวง"
            name="subDistrict"
            rules={[{ required: true, message: 'กรุณาเลือกตำบล/แขวง' }]}
          >
            <Select>
              <Option value="someSubdistrict">Some Subdistrict</Option>
              {/* Add other options as needed */}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="ไปรษณีย์"
            name="postalCode"
            rules={[{ required: true, message: 'กรุณากรอกไปรษณีย์' }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="สถานะ"
            name="status"
            rules={[{ required: true, message: 'กรุณาเลือกสถานะ' }]}
          >
            <Select defaultValue="active">
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="ประเภทตัวแทน"
            name="representativeType"
            rules={[{ required: true, message: 'กรุณาเลือกประเภทตัวแทน' }]}
          >
            <Select defaultValue="ตัวแทน">
              <Option value="ตัวแทน">ตัวแทน</Option>
              {/* Add other options as needed */}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="มือถือ"
            name="mobile"
            rules={[{ required: true, message: 'กรุณากรอกมือถือ' }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="เลขที่ใบอนุญาติ"
            name="licenseNumber"
            rules={[{ required: true, message: 'Please input your license number!' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="เลขที่บัตร"
            name="idCardNumber"
            rules={[{ required: true, message: 'Please input your ID card number!' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="โทร"
            name="phoneNumber"
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="จำนวนเงินค้ำ"
            name="guaranteeAmount"
            rules={[{ required: true, message: 'Please input the guarantee amount!' }]}
          >
            <Input type="number" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="จำนวนวงเงิน"
            name="creditAmount"
            rules={[{ required: true, message: 'Please input the credit amount!' }]}
          >
            <Input type="number" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="อีเมล"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'The input is not valid E-mail!' }
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="จำนวนเท่า"
            name="amount"
            initialValue={1.00}
            rules={[{ required: true, message: 'Please input the amount!' }]}
          >
            <Input type="number" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="วงเงินที่ได้"
            name="receivedAmount"
          >
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="LineUp Agent"
            name="lineUpAgent"
            initialValue="A02495"
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="SEI BrokCode"
            name="seiBrokCode"
            initialValue="NPRA"
          >
            <Select>
              <Option value="NPRA">NPRA</Option>
              {/* Add other options as needed */}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="SJA BrokCode"
            name="sjaBrokCode"
            initialValue="NPRA"
          >
            <Select>
              <Option value="NPRA">NPRA</Option>
              {/* Add other options as needed */}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="ยอดขาย"
            name="salesAmount"
          >
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="ยอดชำระ"
            name="paymentAmount"
          >
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="วงเงินที่เหลือ"
            name="remainingAmount"
            style={{ backgroundColor: 'red' }}
          >
            <Input disabled />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="รหัสเดิม"
            name="oldCode"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="หมายเหตุ"
            name="remarks"
          >
            <Input.TextArea />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="สถานะการขาย"
            name="salesStatus"
            initialValue="เครดิต"
          >
            <Select>
              <Option value="เครดิต">เครดิต</Option>
              {/* Add other options as needed */}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AgentForm;
