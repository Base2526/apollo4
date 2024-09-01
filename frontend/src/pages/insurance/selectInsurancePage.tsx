import React from 'react';
import { List, Card, Col, Row } from 'antd';
import { useNavigate } from 'react-router-dom';

import './index.less';

const data = [
  {
    id: 1,
    name: 'อลิอันซ์ อยุธยา ประกันภัย',
    price: '$10',
    note: 'ผิดแล้วต้องแจ้งยกเลิกที่บริษัทประกัน',
    img: 'https://via.placeholder.com/100',
  },
  {
    id: 2,
    name: 'จรัญประกันภัย จำกัด(มหาชน)',
    price: '$20',
    note: 'ผิดแล้วต้องแจ้งยกเลิกที่บริษัทประกัน',
    img: 'https://via.placeholder.com/100',
  },
  {
    id: 3,
    name: 'เทเวศประกันภัย จำกัด (มหาชน)',
    price: '$30',
    note: 'ผิดแล้วต้องแจ้งยกเลิกที่บริษัทประกัน',
    img: 'https://via.placeholder.com/100',
  },
  {
    id: 4,
    name: 'อินทรประกันภัย จำกัด (มหาชน)',
    price: '$10',
    note: 'ผิดแล้วต้องแจ้งยกเลิกที่บริษัทประกัน',
    img: 'https://via.placeholder.com/100',
  },
  {
    id: 5,
    name: 'เคดับบลิวไอ จำกัด (มหาชน)',
    price: '$20',
    note: 'ผิดแล้วต้องแจ้งยกเลิกที่บริษัทประกัน',
    img: 'https://via.placeholder.com/100',
  },
  {
    id: 6,
    name: 'คุ้มภัยโตเกียวมารีนประกันภัย (ประเทศไทย) จำกัด (มหาชน)',
    price: '$30',
    note: 'ผิดแล้วต้องแจ้งยกเลิกที่บริษัทประกัน',
    img: 'https://via.placeholder.com/100',
  },
  {
    id: 7,
    name: 'ไทยไพบูลย์ประกันภัย จำกัด (มหาชน)',
    price: '$20',
    note: 'ผิดแล้วต้องแจ้งยกเลิกที่บริษัทประกัน',
    img: 'https://via.placeholder.com/100',
  },
  {
    id: 8,
    name: 'เออร์โกประกันภัย (ประเทศไทย) จำกัด (มหาชน)',
    price: '$30',
    note: 'ผิดแล้วต้องแจ้งยกเลิกที่บริษัทประกัน',
    img: 'https://via.placeholder.com/100',
  },
  // Add more items as needed
];

const selectInsurancePage: React.FC = () => {
  const navigate = useNavigate();

  return (<div style={{ paddingLeft: '10px' }}>
            <div>เลือกบริษัทประกัน</div>
            <Row gutter={16}>
              {data.map(item => (
                <Col span={4} key={item.id} style={{"margin": "5px"}}>
                  <Card
                    hoverable
                    cover={<img alt={item.name} src={item.img} />}
                    onClick={()=> navigate("/insurance") }>
                    <Card.Meta
                      // title={item.name}
                      title={<div style={{ whiteSpace: 'normal' }}>{item.name}</div>}
                      description={
                        <>
                          <p>{item.price}</p>
                          <p>{item.note}</p>
                        </>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
  );
};

export default selectInsurancePage;