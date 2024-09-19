import "./index.less"
import React, { useState } from 'react';
import { message, List, Avatar, Button, Popconfirm } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from '@apollo/client';
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { DefaultRootState } from '@/interface/DefaultRootState';
import { removeCart, clearAllCart } from '@/stores/user.store';
import { ProductItem } from "@/interface/user/user";

import { mutation_order } from '@/apollo/gqlQuery';
import { getHeaders } from '@/utils';
import handlerError from '@/utils/handlerError';

const Cart: React.FC = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { carts } = useSelector((state: DefaultRootState) => state.user);
  
  console.log("carts :", carts)
  // Loading state for the Checkout button
  const [loading, setLoading] = useState(false);

  const [onOrder] = useMutation(mutation_order, {
    context: { headers: getHeaders(location) },
    update: (cache, { data: { order } }) => {
      console.log("order:", order);
    },
    onCompleted: () => {

      dispatch(clearAllCart());

      setLoading(false); // Stop loading when the mutation is completed
      message.success('Order placed successfully!');

      navigate("/")
    },
    onError: (error) => {
      setLoading(false); // Stop loading in case of error
      handlerError(props, error);
    }
  });

  const onView = (_id: string) => {
    navigate(`/view?v=${_id}`, { state: { _id } });
  };

  const onDelete = (_id: string) => {
    console.log(`Delete product ${_id}`);
    dispatch(removeCart(_id));
    message.warning('Deleted from cart!');
  };

  const onCheckout = () => {
    setLoading(true); // Set loading to true when starting checkout

    const productId = _.map(carts, '_id');
    onOrder({ variables: { input: { mode: 'added', productId } } });
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
              <div style={{ marginRight: 8 }}>Total: ${_.sumBy(carts, (item) => parseFloat(item.current.price))}</div>
              <Button
                type="primary"
                onClick={onCheckout}
                loading={loading} // Show loading spinner when loading is true
              >
                {`Checkout (${carts.length})`}
              </Button>
            </div>
          </div>
        }
        renderItem={(item: ProductItem) => (
          <List.Item
            style={{ padding: '10px' }}
            actions={[
              <Button type="link" icon={<EyeOutlined />} onClick={() => onView(item._id)}>
                View
              </Button>,
              <Popconfirm
                title="Are you sure to delete this product?"
                onConfirm={() => onDelete(item._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="link" danger icon={<DeleteOutlined />}>
                  Delete
                </Button>
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar shape="square" size={64} src={item.current.images.length > 0 ? item.current.images[0]?.url : ""} />}
              title={item.current.name}
              description={`Price: $${item.current.price} - ${item.current.detail}`}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default Cart;
