import React from 'react';
import { Form, Input, Button, Row, Col, Card, Table, Typography, Divider } from 'antd';
import { CreditCardOutlined, PayCircleOutlined, PropertySafetyOutlined as PaypalOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const dataSource = [
  {
    key: '1',
    date: '31/7/2567',
    rate: '1.10 เก๋ง 2 ตอน',
    brand: 'TOYOTA',
    year: '1996',
    color: 'เทา',
    startDate: '1/8/2567-1/8/2568',
    plateNumber: '5ษ 5332 กท',
    chassisNumber: 'AE1109014304',
    engineNumber: '4AH972681',
  },
];

const columns = [
  {
    title: 'วันออกกรมธรรม์',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'รหัสรถ',
    dataIndex: 'rate',
    key: 'rate',
  },
  {
    title: 'ยี่ห้อรถ',
    dataIndex: 'brand',
    key: 'brand',
  },
  {
    title: 'ปีรถ',
    dataIndex: 'year',
    key: 'year',
  },
  {
    title: 'สีรถ',
    dataIndex: 'color',
    key: 'color',
  },
  {
    title: 'วันคุ้มครอง',
    dataIndex: 'startDate',
    key: 'startDate',
  },
  {
    title: 'เลขทะเบียน',
    dataIndex: 'plateNumber',
    key: 'plateNumber',
  },
  {
    title: 'เลขตัวถัง',
    dataIndex: 'chassisNumber',
    key: 'chassisNumber',
  },
  {
    title: 'เลขเครื่อง',
    dataIndex: 'engineNumber',
    key: 'engineNumber',
  },
];

const PolicyDetails: React.FC = () => (
  <div>
    <Text>เลขที่กรมธรรม์: CTP-3202842171-24N10</Text><br />
    <Text>สถานะ: ยืนยันกรมธรรม์สำเร็จ</Text><br />
    <Text>จำนวนวัน: 365</Text><br />
    <Text>สถานะเหตุ: ไม่มี</Text><br />
    <Text>สถานหยุดเลิก: ไม่มี</Text><br />
    <Text>เลขที่อ้างอิง: 3117736</Text><br />
    <Text>เบี้ยรวม: 645.21</Text>
  </div>
);

const DetailnsurancePage: React.FC = () => {
  return (
    <div style={{ padding: '10px' }}>
      <Card>
        <Row gutter={[16, 16]}>
            <Col span={12}> {/* First column */}
                <Col span={24}>
                    <Text>ชื่อ: วรรณสันฑัต ชนะ</Text><br />
                    <Text>โทร: มือถือ: อีเมล:</Text>
                </Col>
                <Col span={24}>
                    <Text>ไทยไพบูลย์ประกันภัย จำกัด (มหาชน)</Text><br />
                    <Text>123 อาคารไทยประกันชีวิต ถนนรัชดาภิเษก แขวงดินแดง เขตดินแดง จ. กรุงเทพมหานคร 10400</Text><br />
                    <Text>โทร: 02-246-9635 Fax: 02-246-9660</Text>
                </Col>
                <Col span={24}>
                    <Text>ตัวแทน: คุณสนธยา เออสม 03 (คุณรถเดช แสงภัทรชัย) ***ระบบเติมเงินสด (A02505)</Text><br />
                    <Text>วงเงินคงเหลือ: 0.00</Text>
                </Col>
            </Col>
            <Col span={12}> {/* Second column */}
                <PolicyDetails />
            </Col>
          <Col span={24}>
            <Table dataSource={dataSource} columns={columns} pagination={false} />
          </Col>
          <Col span={24}>
            <Divider />
            <Title level={5}>วิธีการชำระเงิน</Title>
            <Row gutter={[16, 16]}>
              <Col>
                <Button icon={<PayCircleOutlined />} type="primary">MasterCard</Button>
              </Col>
              <Col>
                <Button icon={<CreditCardOutlined />} type="primary">Visa</Button>
              </Col>
              <Col>
                <Button icon={<CreditCardOutlined />} type="primary">American Express</Button>
              </Col>
              <Col>
                <Button icon={<PaypalOutlined />} type="primary">PayPal</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default DetailnsurancePage;
