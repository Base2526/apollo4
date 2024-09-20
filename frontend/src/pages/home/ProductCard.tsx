import React from 'react';
import { Card, Button } from 'antd';
import { HeartOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { DefaultRootState } from '@/interface/DefaultRootState';

// Define a TypeScript interface for card props
interface ProductCardProps {
  _id: string;
  title: string;
  imageUrl: string;
  details: string;
  price: string;
  quantity: number;
  onClick: () => void;
  onAddToCart: () => void;
  onDeleteForCart: () => void;
  onBuy: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  _id,
  title,
  imageUrl,
  details,
  price,
  quantity,
  onClick,
  onAddToCart,
  onDeleteForCart,
  onBuy
}) => {
  const { carts } = useSelector((state: DefaultRootState) => state.user);
  const inCart = carts.some((item) => item._id === _id);

  return (
    <Card
      hoverable
      cover={<img alt={title} src={imageUrl} />}>
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

export default ProductCard;