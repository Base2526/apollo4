import "./index.less";
import React, { useState, useEffect } from 'react';
import { message, List, Card, Button, Popconfirm, InputNumber, Image } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery, useMutation } from '@apollo/client';
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { DefaultRootState } from '@/interface/DefaultRootState';
import { removeCart_plan_front, removeCart_plan_back, updateQuantities_front, updateQuantities_back } from '@/stores/user.store';
import { ProductItem, PositionInterface } from "@/interface/user/user";
import { query_positions } from '@/apollo/gqlQuery';
import { getHeaders, getPositionId } from '@/utils';
import handlerError from '@/utils/handlerError';
import AddressModalForm from "@/pages/cart/AddressModalForm"
import { useAppContext } from '@/AppContext';

const { REACT_APP_HOST_GRAPHAL } = process.env;
const Cart: React.FC = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { profile, cart_plan_front, cart_plan_back } = useSelector((state: DefaultRootState) => state.user);
  const [isModalVisible, setIsModalVisible]  = useState(false)
  const { homeFilter } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState<PositionInterface[]>([]);

  const { loading: loadingPositions, data: dataPositions } = useQuery(query_positions, {
      context: { headers: getHeaders(location) },
      fetchPolicy: 'no-cache',
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

  useEffect(()=>{
    switch( homeFilter.filter.product_type ){
      case 1: {
        if(cart_plan_front.length === 0){
          navigate("/");
        }
        break;
      }

      case 2: {
        if(cart_plan_back.length === 0){
          navigate("/");
        }
        break;
      }
    }
  }, [ cart_plan_front, cart_plan_back ])

  const onView = (_id: string) => {
    navigate(`/view?v=${_id}`, { state: { _id } });
  };

  const onDelete = (_id: string) => {
    dispatch(
      homeFilter.filter.product_type === 1 
      ? removeCart_plan_front(_id)
      : removeCart_plan_back(_id)
    )
    message.warning('Deleted from cart!');
  };

  const onQuantitiesChange = (id: string, quantities: number) => {
    if (quantities <= 0) {
      message.warning('Quantity cannot be less than 1');
      return;
    }
    dispatch(
      homeFilter.filter.product_type === 1 
      ? updateQuantities_front({id, quantities})
      : updateQuantities_back({id, quantities})
    )
  };

  const onCheckout = () => {
    if(profile.current?.address_delivery){
      navigate("/checkout")
    }else{
      setIsModalVisible(true)
    }
  };

  const sumAllPrice = () =>{
    let sum_price = 0;

    _.map(homeFilter.filter.product_type  === 1 ? cart_plan_front :cart_plan_back , (cart)=>{
      let positionId = getPositionId(profile.current.positionIds)
      let position = _.find(positions, (p)=>p._id?.toString() === positionId.toString())
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

  return (
    <Card style={{ marginBottom: '20px' }}>
      <List
        itemLayout="horizontal"
        dataSource={
          homeFilter.filter.product_type === 1 
          ? cart_plan_front
          : cart_plan_back
        }
        header={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px' }}>
            <div style={{ fontSize: 20 }}>{`รายการสินค้า ${ homeFilter.filter.product_type === 1 ? 'แผนหน้า' : 'แผนหลัง'} (${  homeFilter.filter.product_type === 1 
                                                            ? cart_plan_front.length
                                                            : cart_plan_back.length
                                                          })`}</div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ marginRight: 8, fontSize:20 }}>
                {`ยอดทั้งหมด(หลังหัก % ค่าตำแหน่ง): ${ Math.ceil(sumAllPrice()) } บาท`}
              </div>
              <Button 
                type="primary" 
                onClick={onCheckout} 
                loading={loading}>
                {`ชำระเงิน (${homeFilter.filter.product_type === 1 ? cart_plan_front.length : cart_plan_back.length })`}
              </Button>
            </div>
          </div>
        }
        renderItem={(item: ProductItem, index: number) => {

          const items = _.map(item.current.images, v=> `http://${REACT_APP_HOST_GRAPHAL}/${v.url}`);
          return  <List.Item
                    key={index}
                    style={{ padding: '10px' }}
                    actions={[
                      <Button type="link" icon={<EyeOutlined />} onClick={() => onView(item._id)}>
                        ดู
                      </Button>,
                      <Popconfirm
                        title="Are you sure to delete this product?"
                        onConfirm={() => onDelete(item._id)}
                        okText="Yes"
                        cancelText="No">
                        <Button type="link" danger icon={<DeleteOutlined />}>
                          ลบ
                        </Button>
                      </Popconfirm>,
                    ]}>
                    <List.Item.Meta
                      avatar={ /*<Avatar shape="square" size={100} src={item.current.images.length > 0 ? item.current.images[0]?.url : ""} />*/ 
                              <Image.PreviewGroup items={items}>
                                <Image
                                  style={{ borderRadius: 5 }}
                                  src={items[0]}
                                  width={80}
                                />
                              </Image.PreviewGroup>
                      }
                      title={item.current.name}
                      description={
                        <div>
                          <div>{`รายละเอียด: ${item.current.detail}`}</div>
                          <div>{`ราคาต่อหน่อย: ${ item.current.price_sell } x ${ item.current.quantities } = ${ item.current.quantities !== undefined ? parseInt(item.current.price_sell) * item.current.quantities : parseInt(item.current.price_sell)  } บาท`}</div>
                          <div>{`จำนวนสินค้าทั้งหมด: ${ item.current.quantity } ชิ้น`}</div>
                          <div>{`ส่วนลดเฉพาะตำแหน่ง BM (ไม่เกิม 5%): ${ item.current.price_discount_bm } %`}</div>
                          <div>{`ส่วนลดมาตรฐาน BS (%): ${ item.current.price_discount_bs } %`}</div>
                          <div>{`ค่าจัดส่ง: ${ item.current.price_delivery } บาท`}</div>
                          <div style={{ marginTop: 8 }}>
                            <span>จำนวนสินค้าทีสั่งซื้อ: </span>
                            <InputNumber
                              min={1}
                              max={item.current.quantity}
                              value={item.current.quantities} 
                              onChange={(value) => onQuantitiesChange(item._id, value || 1)}
                            />
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
        }}
      />

      { isModalVisible && <AddressModalForm 
                            isModalVisible={isModalVisible}
                            setIsModalVisible={()=>{ setIsModalVisible(false) }}/> }
    </Card>
  );
};

export default Cart;
