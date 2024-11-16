import React from 'react';
import { Card, Button, Image, Tag } from 'antd';
import { HeartOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { DefaultRootState } from '@/interface/DefaultRootState';
import _ from "lodash"
import { ProductItem } from "@/interface/user/user"

// Define a TypeScript interface for card props
interface ProductCardProps {
  product: ProductItem;
  productType: number;
  onClick: () => void;
  onAddToCart: () => void;
  onDeleteForCart: () => void;
  onBuy: () => void;
}

const { REACT_APP_HOST_GRAPHAL } = process.env;
const HomeCard: React.FC<ProductCardProps> = ({
  product,
  productType,
  onClick,
  onAddToCart,
  onDeleteForCart,
  onBuy
}) => {
  const { carts, cart_plan_front, cart_plan_back } = useSelector((state: DefaultRootState) => state.user);

  let inCart = false;
  // if(carts){
  //   inCart = carts.some((item) => item._id === product._id);
  // }

  switch(productType){
    case 1: {
      if(cart_plan_front){
        inCart = cart_plan_front.some((item) => item._id === product._id);
      }
      break;
    }

    case 2: {
      if(cart_plan_back){
        inCart = cart_plan_back.some((item) => item._id === product._id);
      }
      break;
    }
  }

  const ___option = (option_front: number[]) =>{
    return _.map(option_front, (v, index)=>{
        switch(v){
            case 1:return <Tag key={index} color="#2db7f5">เอกสิทธิพิเศษ</Tag>
            case 2:return <Tag key={index} color="#2db7f5">Power ship</Tag>
        }
    } )
  }

  const ___package = (package_front: number[]) =>{
    return _.map(package_front, (v, index)=>{
        switch(v){
            case 1:return <Tag key={index} color="#2db7f5">1</Tag>
            case 2:return <Tag key={index} color="#2db7f5">8</Tag>
            case 3:return <Tag key={index} color="#2db7f5">56</Tag>
        }
    } )
  }
  
  const items = _.map(product.current.images, v=> `http://${REACT_APP_HOST_GRAPHAL}/${v.url}`);
  return (
    <Card
      hoverable
      cover={ 
        <div style={{ position: 'relative', width: '100%', height: '200px' }}>
          <Image.PreviewGroup items={items}>
            <Image
              alt={product.current.name}
              src={items[0]}
              width="100%"
              style={{
                objectFit: 'cover',
                height: '200px',
                borderTopRightRadius: 5,
                borderTopLeftRadius: 5,
              }}
            />
          </Image.PreviewGroup>
          
          {/* Add the text count positioned at the bottom-right */}
          <div
            style={{
              position: 'absolute',
              bottom: '10px', // Adjust the positioning as needed
              right: '10px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
              color: '#fff',
              padding: '5px 10px',
              borderRadius: '5px',
            }}>{ items.length }</div>
        </div>
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
              รายละเอียด: {product.current.detail}
            </div>
          }   
        />
      </div>
      <div style={{ marginTop: '16px' }}  >
        <div onClick={onClick}>
          <p style={{ fontSize: '12px', color:"rgba(0, 0, 0, 0.45)" }}>จำนวนสินค้าทั้งหมด: {product.current.quantity}</p>
          <p style={{ fontSize: '12px', color:"rgba(0, 0, 0, 0.45)" }}>ราคา (บาท): {product.current.price}</p>
          <p style={{ fontSize: '12px', color:"rgba(0, 0, 0, 0.45)" }}>ราคาขาย (บาท): {product.current.price_sell}</p>
          <p style={{ fontSize: '12px', color:"rgba(0, 0, 0, 0.45)" }}>ค่าจัดส่ง (บาท): {product.current.price_delivery}</p>
          {
            _.includes(product.current.product_type, 1)
            ?   <>
                    <><Tag color="#2db7f5">แผนหน้า</Tag></>
                    <div>{___package(product.current.package_front)} {___option(product.current.option_front)}</div>
                </>
            : <></>
          }

          {
            _.includes(product.current.product_type, 2)
            ?   <>
                    <div><Tag color="#2db7f5">แผนหลัง</Tag></div>
                    <div>{___package(product.current.package_back)} {___option(product.current.option_back)} </div>
                </>
            : <></>
          }
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', // Align buttons to the end of the flex container
          gap: '8px', // Space between buttons
          paddingTop: "10px"
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