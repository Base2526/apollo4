import React from 'react';
import { Card, Button, Image } from 'antd';
import { HeartOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { DefaultRootState } from '@/interface/DefaultRootState';
import _ from "lodash"
import { ProductItem } from "@/interface/user/user"

// Define a TypeScript interface for card props
interface ProductCardProps {
  _id: string;
  title: string;
  imageUrl: string;
  details: string;
  price: string;
  quantity: number;

  item: ProductItem;

  onClick: () => void;
  onAddToCart: () => void;
  onDeleteForCart: () => void;
  onBuy: () => void;
}

const { REACT_APP_HOST_GRAPHAL } = process.env;
const HomeCard: React.FC<ProductCardProps> = ({
  _id,
  title,
  imageUrl,
  details,
  price,
  quantity,

  item,

  onClick,
  onAddToCart,
  onDeleteForCart,
  onBuy
}) => {
  const { carts } = useSelector((state: DefaultRootState) => state.user);
  const inCart = carts.some((item) => item._id === _id);

  const items = _.map(item.current.images, v=> `http://${REACT_APP_HOST_GRAPHAL}/${v.url}`);
  return (
    <Card
      hoverable
      cover={ /*<img alt={title} src={imageUrl} />*/ 
        <Image.PreviewGroup items={items}>
          <Image
            alt={title}
            src={items[0]}
            width="100%"
            style={{ objectFit: 'cover', height: '200px', borderTopRightRadius: 5, borderTopLeftRadius: 5 }} // Add some styling for image display
          />
        </Image.PreviewGroup>
      }>
      <div onClick={onClick} style={{ cursor: 'pointer' }}>
        <Card.Meta 
          title={title} 
          description={
            <div style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {details}
            </div>
          }   
        />
      </div>
      <div style={{ marginTop: '16px' }}>
        <p onClick={onClick} style={{ fontSize: '12px', color:"rgba(0, 0, 0, 0.45)" }}>Max quantity: {quantity}</p>
        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>${price}</p>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', // Align buttons to the end of the flex container
          gap: '8px' // Space between buttons
        }}>
          <Button
            className='ant-btn-product-card'
            type="dashed"
            onClick={inCart ? onDeleteForCart : onAddToCart}>
            {inCart ? 'Delete form cart' : 'Add to cart'}
          </Button>
          <Button className='ant-btn-product-card' type="primary" onClick={onBuy}>
            Buy
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default HomeCard;