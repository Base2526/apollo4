import React from 'react';
import { Card, Button, Image } from 'antd';
import { HeartOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { DefaultRootState } from '@/interface/DefaultRootState';
import _ from "lodash"
import { ProductItem } from "@/interface/user/user"

// Define a TypeScript interface for card props
interface ProductCardProps {
  product: ProductItem;
  onClick: () => void;
  onAddToCart: () => void;
  onDeleteForCart: () => void;
  onBuy: () => void;
}

const { REACT_APP_HOST_GRAPHAL } = process.env;
const HomeCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  onAddToCart,
  onDeleteForCart,
  onBuy
}) => {
  const { carts } = useSelector((state: DefaultRootState) => state.user);

  let inCart = false;
  if(carts){
    inCart = carts.some((item) => item._id === product._id);
  }
  
  const items = _.map(product.current.images, v=> `http://${REACT_APP_HOST_GRAPHAL}/${v.url}`);
  return (
    <Card
      hoverable
      cover={ /*<img alt={title} src={imageUrl} />*/ 
        <Image.PreviewGroup items={items}>
          <Image
            alt={product.current.name}
            src={items[0]}
            width="100%"
            style={{ objectFit: 'cover', height: '200px', borderTopRightRadius: 5, borderTopLeftRadius: 5 }} // Add some styling for image display
          />
        </Image.PreviewGroup>
      }>
      <div onClick={onClick} style={{ cursor: 'pointer' }}>
        <Card.Meta 
          title={product.current.name} 
          description={
            <div style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {product.current.detail}
            </div>
          }   
        />
      </div>
      <div style={{ marginTop: '16px' }}>
        <p onClick={onClick} style={{ fontSize: '12px', color:"rgba(0, 0, 0, 0.45)" }}>Max quantity: {product.current.quantity}</p>
        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>${product.current.price}</p>
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