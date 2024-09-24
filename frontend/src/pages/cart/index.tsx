import "./index.less";
import React, { useState } from 'react';
import { message, List, Avatar, Button, Popconfirm, InputNumber, Image } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from '@apollo/client';
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { DefaultRootState } from '@/interface/DefaultRootState';
import { removeCart, clearAllCart, updateCartQuantities } from '@/stores/user.store';
import { ProductItem } from "@/interface/user/user";
import { mutation_order } from '@/apollo/gqlQuery';
import { getHeaders } from '@/utils';
import handlerError from '@/utils/handlerError';

const { REACT_APP_HOST_GRAPHAL } = process.env;
const Cart: React.FC = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { carts } = useSelector((state: DefaultRootState) => state.user);

  console.log("Cart :", carts)
  const [loading, setLoading] = useState(false);

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

  const onView = (_id: string) => {
    navigate(`/view?v=${_id}`, { state: { _id } });
  };

  const onDelete = (_id: string) => {
    dispatch(removeCart(_id));
    message.warning('Deleted from cart!');
  };

  const onQuantitiesChange = (id: string, quantities: number) => {
    if (quantities <= 0) {
      message.warning('Quantity cannot be less than 1');
      return;
    }
    dispatch(updateCartQuantities({id, quantities}));
  };

  const onCheckout = () => {
    setLoading(true);

    const productIds =   _.map(carts, item => ({
                            productId: item._id,
                            quantities: item.current.quantities
                          }));

    onOrder({ variables: { input: { mode: 'added', productIds } } });
  };

  return (
    <div>
      <List
        itemLayout="horizontal"
        dataSource={carts}
        header={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px' }}>
            <div style={{ fontSize: 20 }}>{`List product (${carts.length})`}</div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ marginRight: 8, fontSize:20 }}>
                Total: ${_.sumBy(carts, (item) => item.current.quantities !== undefined ? parseFloat(item.current.price) * item.current.quantities  : parseFloat(item.current.price) )}
              </div>
              <Button type="primary" onClick={onCheckout} loading={loading}>
                {`Checkout (${carts.length})`}
              </Button>
            </div>
          </div>
        }
        renderItem={(item: ProductItem) => {
          // let items = item.current.images

          const items = _.map(item.current.images, v=> `http://${REACT_APP_HOST_GRAPHAL}/${v.url}`);
          return  <List.Item
                    style={{ padding: '10px' }}
                    actions={[
                      <Button type="link" icon={<EyeOutlined />} onClick={() => onView(item._id)}>
                        View
                      </Button>,
                      <Popconfirm
                        title="Are you sure to delete this product?"
                        onConfirm={() => onDelete(item._id)}
                        okText="Yes"
                        cancelText="No">
                        <Button type="link" danger icon={<DeleteOutlined />}>
                          Delete
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
                          <div>{`Price: $${ item.current.quantities !== undefined ? parseInt(item.current.price) * item.current.quantities : parseInt(item.current.price)  } - ${item.current.detail}`}</div>
                          <div>Max quantity: { item.current.quantity }</div>
                          <div style={{ marginTop: 8 }}>
                            <span>Quantity: </span>
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
    </div>
  );
};

export default Cart;
