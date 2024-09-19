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
      cover={<img alt={title} src={imageUrl} />}
      // onClick={onClick}
    //   actions={[<HeartOutlined key="heart" />]}
    >
      <div onClick={onClick} style={{ cursor: 'pointer' }}>
        <Card.Meta title={title} description={details}   />
      </div>
      <div style={{ marginTop: '16px' }}>
        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>${price}</p>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', // Align buttons to the end of the flex container
          gap: '8px' // Space between buttons
        }}>
          <Button
            className='ant-btn-product-card'
            type="dashed"
            
            // style={{ color: isBuy ? 'red' : 'black', borderColor: isBuy ? 'red' : 'black' }}
            // disabled={isBuy}
            onClick={inCart ? onDeleteForCart : onAddToCart}
          >
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