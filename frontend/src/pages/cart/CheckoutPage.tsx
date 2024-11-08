import "./index.less"
import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Card, Typography, Divider, Button, Image, message, Skeleton } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { ShopOutlined } from "@ant-design/icons";
import _ from "lodash"
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

import { DefaultRootState } from "@/interface/DefaultRootState"
import AddressModalForm from "@/pages/cart/AddressModalForm"
import { query_positions, mutation_order } from '@/apollo/gqlQuery';
import { clearAllCart_plan_front, clearAllCart_plan_back } from '@/stores/user.store'
import handlerError from '@/utils/handlerError';
import { useAppContext } from '@/AppContext';
import { PositionInterface } from "@/interface/user/user"

import { getHeaders, 
        ___discount_position_for_member, 
        ___discount_position_for_member_inclue_vat, 
        ___price_discount_bm_or_bs, 
        ___vat, 
        ___price_before_vat } from '@/utils';

const { Header, Content, Footer } = Layout;
const { Text, Title, Link } = Typography;

const { REACT_APP_HOST_GRAPHAL } = process.env;

const CheckoutPage: React.FC = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cart_plan_front, cart_plan_back, profile } = useSelector((state: DefaultRootState) => state.user);
  const [loading, setLoading] = useState(false);
  const { homeFilter } = useAppContext();
  const [isModalVisible, setIsModalVisible]  = useState(false)
  const [positions, setPositions] = useState<PositionInterface[]>([]);

  const [onOrder] = useMutation(mutation_order, {
    context: { headers: getHeaders(location) },
    update: (cache, { data: { order } },  params: any) => {
      let { status } = order
      if(status){
        let { mode, type_plan } = params?.variables.input;

        switch(type_plan){
          // แผนหน้า
          case 1: {
            dispatch(clearAllCart_plan_front());
            break;
          }
          // แผนหลัง
          case 2: {
            dispatch(clearAllCart_plan_back());
            break;
          }
        }
      }

      setLoading(false);
      message.success('Order placed successfully!');
      navigate("/");
    },
    onError: (error) => {
      setLoading(false);
      handlerError(props, error);
    }
  });

  const { loading: loadingPositions, 
          data: dataPositions } = useQuery(query_positions, {
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
    switch(homeFilter.filter.product_type){
      case 1:{
        const products =  _.map(cart_plan_front, item => ({
                            productId: item._id,
                            quantities: item.current.quantities
                          }));
                      
        onOrder({ variables: { input: { mode: 'added', type_plan: 1, products } } });
        break;
      }

      case 2:{
        const products =  _.map(cart_plan_back, item => ({
                            productId: item._id,
                            quantities: item.current.quantities
                          }));
    
        onOrder({ variables: { input: { mode: 'added', type_plan: 2, products } } });
        break;
      }
    }
  };

  const ___tax_at_pay5 = () =>{
    return ___summary_discount_position_for_member() * 5/100;
  }

  const ___summary_discount_position_for_member = () =>{
    let ___summary_discount = 0;
   
    _.map( homeFilter.filter.product_type === 1 ? cart_plan_front : cart_plan_back, (cart, index)=>{
      let { vat } = cart.current
      switch(vat){
        // None
        case 0:{
          let price  = ___discount_position_for_member(positions, profile.current?.positionId || "", cart.current)
          ___summary_discount += price              
          break;
        }

        // Include
        case 1:{
          let price  = ___discount_position_for_member_inclue_vat(___price_before_vat(cart.current, homeFilter.tax), positions, profile.current?.positionId || "", cart.current)
          ___summary_discount += price
          break;
        }

        // Exclude
        case 2:{
          let price  = ___discount_position_for_member(positions, profile.current?.positionId || "", cart.current);
          ___summary_discount += price
          break;
        }
      }
    })
    return ___summary_discount;
  }

  const ___discount_position_name = () =>{
    let position = _.find(positions, (p)=>p._id?.toString() === profile.current?.positionId?.toString())
    return <Col span={2} style={{ textAlign: 'right' }}>
                <Text style={{color: 'gray'}}>{`ส่วนลดเฉพาะตำแหน่ง ${ position?.name?.toLocaleUpperCase() }`}</Text>
              </Col>
  }

  const ___price_delivery_view = (price: number) =>{
    return price <= 0 ? <Col><Text>ฟรี</Text></Col> : <Col><Text>฿{ price }</Text> </Col>
  }

  const summaryPriceDiscount = () =>{
    let sum_price = 0;
    _.map(homeFilter.filter.product_type ===  1 ? cart_plan_front : cart_plan_back, (cart)=>{
      let { vat } = cart.current
      switch(vat){
        // None
        case 0:{
          let price = (parseInt(cart.current.price_sell)  * cart.current.quantities) - ___discount_position_for_member(positions, profile.current?.positionId || "", cart.current);                         
          console.log("None :", price)
          sum_price += price              
          break;
        }

        // Include
        case 1:{
          let price  = (parseInt(cart.current.price_sell)  * cart.current.quantities) - ___discount_position_for_member_inclue_vat(___price_before_vat(cart.current, homeFilter.tax), positions, profile.current?.positionId || "", cart.current);                  
          console.log("Include :", price)
          sum_price += price
          break;
        }

        // Exclude
        case 2:{
          let price  = ((parseInt(cart.current.price_sell)  * cart.current.quantities) + (parseInt(cart.current.price_sell)  * cart.current.quantities) * (homeFilter.tax/100)) - ___discount_position_for_member(positions, profile.current?.positionId || "", cart.current);
          console.log("Exclude :", price)
          sum_price += price
          break;
        }
      }
    })
    return sum_price;
  }

  const summaryDelivery = () =>{
    return  _.sumBy(homeFilter.filter.product_type ===  1 ? cart_plan_front : cart_plan_back, (item) => item.current.price_delivery )
  }

  const ___section = () =>{
    return  _.map(homeFilter.filter.product_type ===  1 ? cart_plan_front : cart_plan_back, (cart)=>{
              let { vat, images } = cart.current
              const imagesUrl = _.map(images, v=> `http://${REACT_APP_HOST_GRAPHAL}/${v.url}`);
              switch(vat){
                // None
                case 0:{
                  return  <>
                            <Row align="middle" style={{ marginBottom: '16px' }}>
                              {/* 4, 3, 4, 2, 2, 2, 2, 2  */}
                              <Col span={4}>
                                <Text style={{fontSize: 20}}>สั่งซื้อสินค้าแล้ว ({ ___vat(vat) })</Text>
                              </Col>
                              <Col span={5}>
                              </Col>
                              { ___discount_position_name() }
                              <Col span={2} style={{ textAlign: 'right' }}>
                                <Text style={{color: 'gray'}}>ราคาต่อหน่วย</Text>
                              </Col>
                              <Col span={2} style={{ textAlign: 'right' }}>
                                <Text style={{color: 'gray'}}>จำนวน</Text>
                              </Col>
                              {/* <Col span={2} style={{ textAlign: 'right' }}>
                                <Text style={{color: 'gray'}}>รายการย่อย</Text>
                              </Col> */}
                              <Col span={2} style={{ textAlign: 'right' }}>
                                <Text style={{color: 'gray'}}>ส่วนลดตำแหน่งสมาชิก</Text>
                              </Col>
                              <Col span={2} style={{ textAlign: 'right' }}>
                                <Text style={{color: 'gray'}}>ราคาหักส่วนลด</Text>
                              </Col>
                            </Row>
                            <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
                              <Col>
                                <Row align="middle" gutter={8}>
                                  <Col>
                                    <ShopOutlined />
                                  </Col>
                                  <Col>
                                    <Text strong>{ !_.isEmpty(cart?.owner?.current?.displayName)  ? cart?.owner?.current?.displayName : "-"}</Text>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row align="middle" style={{ marginBottom: '16px' }}>
                              {/* 4, 3, 4, 2, 2, 2, 2, 2  */}
                              <Col span={4}>
                                <Image.PreviewGroup items={imagesUrl}>
                                  <Image
                                    style={{ borderRadius: 5 }}
                                    src={imagesUrl[0]}
                                    width={60}
                                  />
                                </Image.PreviewGroup>
                              </Col>
                              <Col span={5}>
                                <Text strong>{cart.current.name}</Text>
                                <br />
                              </Col>
                              <Col span={2} style={{ textAlign: 'right' }}>
                                <Text>{ ___price_discount_bm_or_bs(positions, profile, cart.current) } %</Text>
                              </Col> 
                              {/* ราคาต่อหน่วย */}
                              <Col span={2} style={{ textAlign: 'right' }}>
                                <Text>฿{ cart.current.price_sell }</Text>
                              </Col>
                              {/* จำนวน */}
                              <Col span={2} style={{ textAlign: 'right' }}>
                                <Text>{ cart.current.quantities }</Text>
                              </Col>
                              {/* ส่วนลดตำแหน่งสมาชิก */}
                              <Col span={2} style={{ textAlign: 'right' }}>
                                <Text>฿{ ___discount_position_for_member(positions, profile.current?.positionId || "", cart.current).toFixed(2) }</Text>
                              </Col>
                              {/* ราคาหักส่วนลด */}
                              <Col span={2} style={{ textAlign: 'right' }}>
                                <Text>฿{ ((parseInt(cart.current.price_sell)  * cart.current.quantities) - ___discount_position_for_member(positions, profile.current?.positionId || "", cart.current)).toFixed(2) }</Text>
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
                              { ___price_delivery_view(cart.current.price_delivery) }
                            </Row>
                            <Divider />
                          </>
                }
                // Include
                case 1:{
                  return  <>
                            <Row align="middle" style={{ marginBottom: '16px' }}>
                              <Col span={4}>
                                <Text style={{fontSize: 20}}>สั่งซื้อสินค้าแล้ว ({ ___vat(vat) })</Text>
                              </Col>
                              <Col span={5}>
                              </Col>
                              { ___discount_position_name() }
                              <Col span={2} style={{ textAlign: 'right' }}>
                                <Text style={{color: 'gray'}}>ราคาก่อน vat</Text>
                              </Col>
                              <Col span={2} style={{ textAlign: 'right' }}>
                                <Text style={{color: 'gray'}}>ราคาต่อหน่วย</Text>
                              </Col>
                              <Col span={2} style={{ textAlign: 'right' }}>
                                <Text style={{color: 'gray'}}>จำนวน</Text>
                              </Col>
                              <Col span={2} style={{ textAlign: 'right' }}>
                                <Text style={{color: 'gray'}}>ส่วนลดตำแหน่งสมาชิก</Text>
                              </Col>
                              <Col span={2} style={{ textAlign: 'right' }}>
                                <Text style={{color: 'gray'}}>ราคาหักส่วนลด</Text>
                              </Col>
                            </Row>
                            <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
                              <Col>
                                <Row align="middle" gutter={8}>
                                  <Col>
                                    <ShopOutlined />
                                  </Col>
                                  <Col>
                                    <Text strong>{ !_.isEmpty(cart?.owner?.current?.displayName)  ? cart?.owner?.current?.displayName : "-"}</Text>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row align="middle" style={{ marginBottom: '16px' }}>
                              <Col span={4}>
                                <Image.PreviewGroup items={imagesUrl}>
                                  <Image
                                    style={{ borderRadius: 5 }}
                                    src={imagesUrl[0]}
                                    width={60}
                                  />
                                </Image.PreviewGroup>
                              </Col>
                              <Col span={5}>
                                <Text strong>{cart.current.name}</Text>
                                <br />
                              </Col>
                              <Col span={2} style={{ textAlign: 'right' }}>
                                <Text>{ cart.current.price_discount_bm } %</Text>
                              </Col>
                              {/* ราคาก่อน vat */}
                              <Col span={2} style={{ textAlign: 'right' }}>
                                <Text>฿{ ___price_before_vat(cart.current, homeFilter.tax).toFixed(2) }</Text>
                              </Col>
                              {/* ราคาต่อหน่วย */}
                              <Col span={2} style={{ textAlign: 'right' }}>
                                <Text>฿{ cart.current.price_sell }</Text>
                              </Col>
                              {/* จำนวน */}
                              <Col span={2} style={{ textAlign: 'right' }}>
                                <Text>{ cart.current.quantities }</Text>
                              </Col>
                              {/* ส่วนลดตำแหน่งสมาชิก */}
                              <Col span={2} style={{ textAlign: 'right' }}>
                                <Text>฿{  ___discount_position_for_member_inclue_vat(___price_before_vat(cart.current, homeFilter.tax), positions, profile.current?.positionId || "", cart.current).toFixed(2)  }</Text>
                              </Col>
                              {/* ราคาหักส่วนลด */}
                              <Col span={2} style={{ textAlign: 'right' }}>
                                <Text>฿{ ((parseInt(cart.current.price_sell)  * cart.current.quantities) - ___discount_position_for_member_inclue_vat(___price_before_vat(cart.current, homeFilter.tax), positions, profile.current?.positionId || "", cart.current)).toFixed(2) }</Text>
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
                              { ___price_delivery_view(cart.current.price_delivery) }
                            </Row>
                            <Divider />
                          </>
                }

                // Exclude
                case 2:{
                  return  <>
                            <Row align="middle" style={{ marginBottom: '16px' }}>
                              <Col span={4}>
                                <Text style={{fontSize: 20}}>สั่งซื้อสินค้าแล้ว ({ ___vat(vat) })</Text>
                              </Col>
                              <Col span={5}>
                              </Col>
                              { ___discount_position_name() }
                              <Col span={2} style={{ textAlign: 'right' }}>
                                <Text style={{color: 'gray'}}>ราคาต่อหน่วย</Text>
                              </Col>
                              <Col span={2} style={{ textAlign: 'right' }}>
                                <Text style={{color: 'gray'}}>ราคาหลังรวม vat {' '}</Text>
                              </Col> 
                              <Col span={2} style={{ textAlign: 'right' }}>
                                <Text style={{color: 'gray'}}>จำนวน</Text>
                              </Col>
                              <Col span={2} style={{ textAlign: 'right' }}>
                                <Text style={{color: 'gray'}}>ส่วนลดตำแหน่งสมาชิก</Text>
                              </Col>
                              <Col span={2} style={{ textAlign: 'right' }}>
                                <Text style={{color: 'gray'}}>ราคาหักส่วนลด</Text>
                              </Col>
                            </Row>
                            <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
                              <Col>
                                <Row align="middle" gutter={8}>
                                  <Col>
                                    <ShopOutlined />
                                  </Col>
                                  <Col>
                                    <Text strong>{ !_.isEmpty(cart?.owner?.current?.displayName)  ? cart?.owner?.current?.displayName : "-"}</Text>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row align="middle" style={{ marginBottom: '16px' }}>
                              {/* 4, 5, 2, 2, 2, 2, 2, 2 */}
                              <Col span={4}>
                                <Image.PreviewGroup items={imagesUrl}>
                                  <Image
                                    style={{ borderRadius: 5 }}
                                    src={imagesUrl[0]}
                                    width={60}
                                  />
                                </Image.PreviewGroup>
                              </Col>
                              <Col span={5}>
                                <Text strong>{cart.current.name}</Text>
                                <br />
                              </Col>
                              <Col span={2} style={{ textAlign: 'right' }}>
                                <Text>{ ___price_discount_bm_or_bs(positions, profile, cart.current) } %</Text>
                              </Col> 
                              {/* ราคาต่อหน่วย */}
                              <Col span={2} style={{ textAlign: 'right' }}>
                                <Text>฿{ cart.current.price_sell }</Text>
                              </Col>
                              {/* ราคาหลังรวม vat */}
                              <Col span={2} style={{ textAlign: 'right' }}>
                                {/* <Text>{`cart.current.price_sell: ${cart.current.price_sell}, cart.current.quantities: ${ cart.current.quantities }, tax: ${homeFilter.tax}`}</Text> */}
                                <Text>฿{ ((parseInt(cart.current.price_sell)  * cart.current.quantities) + (parseInt(cart.current.price_sell)  * cart.current.quantities) * (homeFilter.tax/100)).toFixed(2) }</Text>
                              </Col>
                              {/* จำนวน */}
                              <Col span={2} style={{ textAlign: 'right' }}>
                                <Text>{ cart.current.quantities }</Text>
                              </Col>
                              {/* ส่วนลดตำแหน่งสมาชิก */}
                              <Col span={2} style={{ textAlign: 'right' }}>
                                <Text>฿{ ___discount_position_for_member(positions, profile.current?.positionId || "", cart.current).toFixed(2) }</Text>
                              </Col>                
                              {/* ราคาหักส่วนลด */}
                              <Col span={2} style={{ textAlign: 'right' }}>
                                <Text>฿{ (((parseInt(cart.current.price_sell)  * cart.current.quantities) + (parseInt(cart.current.price_sell)  * cart.current.quantities) * (homeFilter.tax/100)) - ___discount_position_for_member(positions, profile.current?.positionId || "", cart.current)).toFixed(2)  }</Text>
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
                              { ___price_delivery_view(cart.current.price_delivery) }
                            </Row>
                            <Divider />
                          </>
                }
              }
            })
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
        {/* List Product Section */}
        <Card style={{ marginBottom: '16px', padding: 20 }}> { ___section() } </Card> 

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
                <Text style={{ paddingRight: 10 }}>รวมรายการสั่งซื้อ</Text>
                <Text>฿{ ( summaryPriceDiscount() /* + ___summary_discount_position_for_member()*/ ).toFixed(2) }</Text>
              </Row>
              <Row justify="end" align="bottom" style={{ marginBottom: 8 }}>
                <Text style={{ paddingRight: 10 }}>ส่วนลดตำแหน่งสมาชิก</Text>
                <Text>฿{ ___summary_discount_position_for_member().toFixed(2) }</Text>
              </Row>

              <Row justify="end" align="bottom" style={{ marginBottom: 8 }}>
                <Text style={{ paddingRight: 10 }}>ราคาหักส่วนลด</Text>
                <Text>฿{ (summaryPriceDiscount() - ___summary_discount_position_for_member()).toFixed(2) }</Text>
              </Row>

              <Row justify="end" align="bottom" style={{ marginBottom: 8 }}>
                <Text style={{ paddingRight: 10 }}>ภาษีหัก ณ​ ที่จ่าย 5%</Text>
                <Text>฿{ ___tax_at_pay5().toFixed(2) }</Text>
              </Row>

              <Row justify="end" align="bottom" style={{ marginBottom: 8 }}>
                <Text style={{ paddingRight: 10 }}>ยอดสั่งซื้อรวม</Text>
                <Text>฿{ (summaryPriceDiscount() - ___summary_discount_position_for_member() + ___tax_at_pay5()).toFixed(2) }</Text>
              </Row>

              <Row justify="end" align="bottom" style={{ marginBottom: 8 }}>
                <Text style={{ paddingRight: 10 }}>ค่าจัดส่ง</Text>
                <Text>฿{ summaryDelivery() }</Text>
              </Row>

              <Row justify="end" align="bottom">
                <Text style={{ paddingRight: 10 }}>ยอดชำระเงินทั้งหมด</Text>
                <Text style={{ color: 'red', fontSize: 25, fontWeight: 600 }}>฿{ (summaryPriceDiscount() - ___summary_discount_position_for_member() + ___tax_at_pay5() + summaryDelivery()).toFixed(2) } </Text>
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
                  <Button type="primary" size="large" style={{width: 180, borderRadius: 0}} onClick={()=>onCheckout()} loading={loading} >สั่งสินค้า</Button>
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