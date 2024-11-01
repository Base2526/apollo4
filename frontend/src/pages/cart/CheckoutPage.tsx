import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Card, Typography, Divider, Button, Image, message, Skeleton } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { ShopOutlined } from "@ant-design/icons";
import _ from "lodash"
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';

import { DefaultRootState } from "@/interface/DefaultRootState"
import AddressModalForm from "@/pages/cart/AddressModalForm"
import { query_positions, mutation_order } from '@/apollo/gqlQuery';
import { getHeaders } from '@/utils';
import { removeCart, clearAllCart, updateCartQuantities } from '@/stores/user.store';

import handlerError from '@/utils/handlerError';


const { Header, Content, Footer } = Layout;
const { Text, Title, Link } = Typography;
const { REACT_APP_HOST_GRAPHAL } = process.env;

interface positionInterface {
  _id: string;
  level: number;
  name: string;
  percent: number;
  budget: number;
}

const CheckoutPage: React.FC = (props) => {
  const navigate = useNavigate();
  const { carts, profile } = useSelector((state: DefaultRootState) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible]  = useState(false)

  const [onOrder] = useMutation(mutation_order, {
    context: { headers: getHeaders(location) },
    update: (cache, { data: { order } }) => {
      dispatch(clearAllCart());
      setLoading(false);
      message.success('Order placed successfully!');
      navigate("/");
    },
    onError: (error) => {
      setLoading(false);
      handlerError(props, error);
    }
  });

  const [positions, setPositions] = useState<positionInterface[]>([]);
  const { loading: loadingPositions, data: dataPositions } = useQuery(query_positions, {
      context: { headers: getHeaders(location) },
      fetchPolicy: 'cache-first',
      nextFetchPolicy: 'network-only'
  });
  useEffect(() => {
      if (!loadingPositions && !_.isEmpty(dataPositions?.positions)) {
          const { status, data } = dataPositions.positions;
          if (status) {
              setPositions(data);
          }
      }
  }, [dataPositions, loadingPositions]);

  const onCheckout = () => {
    setLoading(true);
    const products =   _.map(carts, item => ({
                            productId: item._id,
                            quantities: item.current.quantities
                          }));
    onOrder({ variables: { input: { mode: 'added', products } } });
  };

  // const sumAllPrice = () =>{
  //   let price = _.sumBy(carts, (item) => item.current.quantities !== undefined ? parseFloat(item.current.price) * item.current.quantities  : parseFloat(item.current.price) )
  //   return price * (100-5)/100
  // }

  const sumAllPrice = () =>{
    let sum_price = 0;
    _.map(carts, (cart)=>{
      let position = _.find(positions, (p)=>p._id?.toString() === profile.current?.positionId?.toString())
      switch(position?.name?.toLocaleUpperCase()){
        case "BM":{
          sum_price +=((cart.current.quantities * parseFloat(cart.current.price_sell)) * (100-cart.current.price_discount_bm)/100 );
          break;
        }
        // BS, BG, BD, BP, MA, MB, MC, MD, ME, MF, MG, MH, MI, MJ, MK, ML, MM, MN, MO, MP, MQ, MR, MS
        case "BS":
        case "BG":
        case "BD":
        case "BP":
        case "MA":
        case "MB":
        case "MC":
        case "MD":
        case "ME":
        case "MF":
        case "MG":
        case "MH":
        case "MI":
        case "MJ":
        case "MK":
        case "ML":
        case "MM":
        case "MN":
        case "MO":
        case "MP":
        case "MG":
        case "MR":
        case "MS":{
          sum_price +=((cart.current.quantities * parseFloat(cart.current.price_sell)) * (100-(cart.current.price_discount_bs + position.percent ))/100 );
          break;
        }
      }
    })

    return sum_price;
  }

  const sumAllDelivery = () =>{
    return _.sumBy(carts, (item) => item.current.price_delivery );
  }

  if(!profile){
    return <Skeleton active paragraph={{ rows: 2 }} />
  }

  return (
    <Layout style={{ paddingBottom: '20px' }}>
      <Content>
        {/* Address Section */}
        <Card style={{ marginBottom: '16px', padding: 20 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Text style={{fontSize: 25}}>ที่อยู่ในการจัดส่ง</Text>
              <br />
              <Text>{ profile.current?.address_delivery?.name } { profile.current?.address_delivery?.phone }</Text>
              <br />
              <Text>{ profile.current?.address_delivery?.address }</Text>
            </Col>
            <Col>
              <Button type="link" onClick={()=> setIsModalVisible(true) }>แก้ไข</Button>
            </Col>
          </Row>
        </Card>

        {/* Product Details Section */}
        <Card style={{ marginBottom: '16px', padding: 20 }}>
          
          <Row align="middle" style={{ marginBottom: '16px' }}>
            <Col span={4}>
              <Text style={{fontSize: 25}}>สั่งซื้อสินค้าแล้ว</Text>
            </Col>
            <Col span={3}>
            </Col>

            <Col span={4} style={{ textAlign: 'right' }}>
              <Text style={{color: 'gray'}}>ส่วนลดเฉพาะตำแหน่ง BM (ไม่เกิม 5%)</Text>
            </Col>

            <Col span={2} style={{ textAlign: 'right' }}>
              <Text style={{color: 'gray'}}>ส่วนลดมาตรฐาน BS (%)</Text>
            </Col>

            <Col span={2} style={{ textAlign: 'right' }}>
              <Text style={{color: 'gray'}}>ราคาต่อหน่วย</Text>
            </Col>
            <Col span={2} style={{ textAlign: 'right' }}>
              <Text style={{color: 'gray'}}>จำนวน</Text>
            </Col>
            <Col span={2} style={{ textAlign: 'right' }}>
              <Text style={{color: 'gray'}}>รายการย่อย</Text>
            </Col>
            <Col span={2} style={{ textAlign: 'right' }}>
              <Text style={{color: 'gray'}}>สว่นลดตำแหน่งสมาชิก</Text>
            </Col>
            
          </Row>
          
          {/* Store and Chat Section */}
          {/* <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
            <Col>
              <Row align="middle" gutter={8}>
                <Col>
                  <img src="https://via.placeholder.com/20" alt="store icon" />
                </Col>
                <Col>
                  <Text strong>houseware_2020</Text>
                </Col>
                <Col>
                  <Button type="link">แชทเลย</Button>
                </Col>
              </Row>
            </Col>
          </Row> */}
          
          {/* Product Details Section */}
          {
            _.map(carts, (cart)=>{
              console.log("cart :", cart)
              const images = _.map(cart.current.images, v=> `http://${REACT_APP_HOST_GRAPHAL}/${v.url}`);
              return <>
                      <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
                        <Col>
                          <Row align="middle" gutter={8}>
                            <Col>
                              <ShopOutlined />
                            </Col>
                            <Col>
                              <Text strong>{ !_.isEmpty(cart?.owner?.current?.displayName)  ? cart?.owner?.current?.displayName : "-"}</Text>
                            </Col>
                            {/* <Col>
                              <Button type="link">แชทเลย</Button>
                            </Col> */}
                          </Row>
                        </Col>
                      </Row>
                      <Row align="middle" style={{ marginBottom: '16px' }}>
                      <Col span={4}>
                        {/* Placeholder for Product Image */}
                        {/* <img src="https://via.placeholder.com/100" alt="product" style={{ width: '80', height: '80' }} /> */}
                        <Image.PreviewGroup items={images}>
                          <Image
                            style={{ borderRadius: 5 }}
                            src={images[0]}
                            width={60}
                          />
                        </Image.PreviewGroup>
                      </Col>
                      <Col span={5}>
                        <Text strong>{cart.current.name}</Text>
                        <br />
                        {/* <Text type="secondary">ตัวเลือกสินค้า: PAE30 - 5m</Text> */}
                      </Col>

                      <Col span={2} style={{ textAlign: 'right' }}>
                        <Text>{ cart.current.price_discount_bm } %</Text>
                      </Col>
                      <Col span={2} style={{ textAlign: 'right' }}>
                        <Text>{ cart.current.price_discount_bs } %</Text>
                      </Col>

                      <Col span={2} style={{ textAlign: 'right' }}>
                        <Text>฿{ cart.current.price_sell }</Text>
                      </Col>
                      <Col span={2} style={{ textAlign: 'right' }}>
                        <Text>{ cart.current.quantities }</Text>
                      </Col>
                      <Col span={2} style={{ textAlign: 'right' }}>
                        <Text>฿{ parseInt(cart.current.price_sell)  * cart.current.quantities }</Text>
                      </Col>
                      <Col span={2} style={{ textAlign: 'right' }}>
                        <Text>฿----</Text>
                      </Col>

                      
                    </Row>
                    <Row justify="space-between" align="middle">
                      <Col span={5}>
                      </Col>
                      <Col>
                        <Text>Shipping Option</Text>
                        <Text>Fast Delivery - ส่งไวทันที</Text>
                      </Col>
                      <Col>
                        <Button type="link">เปลี่ยน</Button>
                      </Col>
                      <Col>
                        <Text>฿{ cart.current.price_delivery }</Text>
                      </Col>
                    </Row>
                    <Divider />
                  </>
                    
            })

          }
          
        </Card>

        {/* Shipping Option Section */}
        {/* <Card style={{ marginBottom: '16px' }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={4}>Shipping Option</Title>
              <Text>Fast Delivery - ส่งไวทันที</Text>
            </Col>
            <Col>
              <Text>฿29</Text>
            </Col>
          </Row>
        </Card> */}

        {/* Discount and Payment Section */}
        {/* <Card style={{ marginBottom: '16px' }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={4}>โค้ดส่วนลดของ Shopee</Title>
            </Col>
            <Col>
              <Button type="link">กดใช้โค้ด</Button>
            </Col>
          </Row>
          <Divider />
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={4}>Shopee Coins</Title>
            </Col>
            <Col>
              <Text>ไม่สามารถแลกเหรียญได้</Text>
            </Col>
          </Row>
        </Card> */}

        {/* Total Payment Section */}
        {/* <Card>
          <Row justify="space-between" align="middle">
            <Col>
              <Text strong>รวมการสั่งซื้อ</Text>
            </Col>
            <Col>
              <Text strong>฿117</Text>
            </Col>
          </Row>
          <Row justify="center" style={{ marginTop: '20px' }}>
            <Button type="primary" size="large">สั่งสินค้า</Button>
          </Row>
        </Card> */}

        <Card style={{padding: 20}}>
          <Row align="middle" style={{ marginBottom: '16px' }}>
            <Col span={4}>
              <Text style={{fontSize: 25}}>วิธีการชำระเงิน</Text>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col>
              <Button style={{borderRadius: 0}} disabled>QR Promptpay</Button>
            </Col>
            <Col>
              <Button type="primary" style={{borderRadius: 0}} >เก็บเงินปลายทาง</Button>
            </Col>
            <Col>
              <Button style={{borderRadius: 0}} disabled>บัตรเครดิต/บัตรเดบิต</Button>
            </Col>
            <Col>
              <Button style={{borderRadius: 0}} disabled>Credit Card Points</Button>
            </Col>
            <Col>
              <Button style={{borderRadius: 0}} disabled>Mobile Banking</Button>
            </Col>
            <Col>
              <Button style={{borderRadius: 0}} disabled>Google Pay</Button>
            </Col>
          </Row>
          <Row style={{ marginTop: 24 }}>
            <Col span={24}>
              <Text strong>เก็บเงินปลายทาง</Text>
              <div>Cash on Delivery</div>
            </Col>
          </Row>
          <Divider />
          <Row style={{ marginTop: 24 }}>
            <Col span={24}>
              <Row justify="end" align="bottom" style={{ marginBottom: 8 }}>
                <Text style={{ paddingRight: 10 }}>รวมการสั่งซื้อ</Text>
                <Text>฿{ Math.ceil(sumAllPrice()) }</Text>
              </Row>
              <Row justify="end" align="bottom" style={{ marginBottom: 8 }}>
                <Text style={{ paddingRight: 10 }}>ค่าจัดส่ง</Text>
                <Text>฿{ sumAllDelivery() }</Text>
              </Row>

              <Row justify="end" align="bottom" style={{ marginBottom: 8 }}>
                <Text style={{ paddingRight: 10 }}>ส่วนลด (ราคาทีได้ลด)</Text>
                <Text>฿---</Text>
              </Row>

              <Row justify="end" align="bottom" style={{ marginBottom: 8 }}>
                <Text style={{ paddingRight: 10 }}>โปรโมทชั่นค่าจัดส่ง</Text>
                <Text>฿---</Text>
              </Row>

              <Row justify="end" align="bottom" style={{ marginBottom: 8 }}>
                <Text style={{ paddingRight: 10 }}>ส่วนลดทั้งหมด</Text>
                <Text>฿---</Text>
              </Row>

              <Row justify="end" align="bottom">
                <Text style={{ paddingRight: 10 }}>ยอดชำระเงินทั้งหมด</Text>
                <Text style={{ color: 'red', fontSize: 25, fontWeight: 600 }}>฿{ Math.ceil(sumAllPrice()) + sumAllDelivery() } </Text>
              </Row>
            </Col>
          </Row>
          <Divider />
          <Row justify="center" style={{ marginTop: 24 }}>
            <Col span={24}>
              <Row 
                justify="space-between" 
                align="middle"
                style={{paddingBottom: 50, paddingTop: 50}}>
                <Col style={{ width: '80%' }}>
                  <Text>
                    โดยการคลิก "สั่งสินค้า" ฉันได้อ่านและยอมรับเงื่อนไขการให้บริการ <Link target="_blank" onClick={()=>{ console.log("bestmallu.com") }}>นโยบายการคืนเงิน/คืนสินค้า bestmallu</Link>, <Link target="_blank" onClick={()=>{ console.log("bestmallu.com") }}>เงื่อนไขการให้บริการเช็กก่อนจ่าย คืนได้ทันที</Link> และรับ หลักฐานการรับเงินการให้บริการขนส่งสินค้าโดยเรียกเก็บเงินปลายทางในรูปแบบอิเล็กทรอนิกส์
                  </Text>
                </Col>
                <Col style={{ width: '20%', display: 'flex', justifyContent: 'flex-end' }}>
                  <Button type="primary" size="large" style={{width: 180, borderRadius: 0}} onClick={()=>onCheckout()} >สั่งสินค้า</Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </Content>
      { isModalVisible && <AddressModalForm 
                            isModalVisible={isModalVisible}
                            setIsModalVisible={()=>{ setIsModalVisible(false) }}/> }
    </Layout>
  );
};

export default CheckoutPage;