import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Typography, Tag, Skeleton, Avatar, Button, message } from 'antd';
import { useQuery } from "@apollo/client";
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import _ from "lodash";

import { Image, List, Divider, Descriptions } from 'antd';
import { guery_product } from "@/apollo/gqlQuery";
import { getHeaders } from "@/utils";
import handlerError from "@/utils/handlerError";
import { ProductItem } from "@/interface/user/user"
import { addCart, 
        removeCart,
        add_cart_plan_front, 
        removeCart_plan_front,
        add_cart_plan_back,
        removeCart_plan_back } from '@/stores/user.store';
import { DefaultRootState } from '@/interface/DefaultRootState';

import { useAppContext } from '@/AppContext';

const { Title, Paragraph, Text } = Typography;

const product = {
    ownerId: '123456',
    name: 'Example Product',
    detail: 'This is a sample product detail description.This is a sample product detail description.This is a sample product detail description.This is a sample product detail description.This is a sample product detail description.This is a sample product detail description.',
    plan: [1, 2, 3],
    price: '$99.99',
    packages: [101, 102, 103],
    images: [
        { url: 'https://example.com/image1.jpg', alt: 'Image 1' },
        { url: 'https://example.com/image2.jpg', alt: 'Image 2' },
        { url: 'https://example.com/image1.jpg', alt: 'Image 1' },
        { url: 'https://example.com/image2.jpg', alt: 'Image 2' },
        { url: 'https://example.com/image1.jpg', alt: 'Image 1' },
        { url: 'https://example.com/image2.jpg', alt: 'Image 2' },
        { url: 'https://example.com/image1.jpg', alt: 'Image 1' },
        { url: 'https://example.com/image2.jpg', alt: 'Image 2' },
        { url: 'https://example.com/image1.jpg', alt: 'Image 1' },
        { url: 'https://example.com/image2.jpg', alt: 'Image 2' },
    ],
    quantity: 50,
    quantities: 100
};

const { REACT_APP_HOST_GRAPHAL }  = process.env;
const ViewProduct: React.FC = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    let { _id } = location.state || {_id: searchParams.get('v')}; // Retrieve the state
    const [data, setData] = useState<ProductItem | null>(null); // Initialize as DataType | null

    let [inCart, setInCart] = useState(false)
    
    const { homeFilter } = useAppContext();

    const { cart_plan_front, cart_plan_back } = useSelector((state : DefaultRootState) => state.user);
    // const inCart = carts.find((item)=>item._id === _id ) === undefined ? false : true
    // let inCart = false;
    
    console.log("ViewProduct :", cart_plan_back)

    const { loading: loadingProduct, 
            data: dataProduct, 
            error: errorProduct,
            refetch: refetchProduct } = useQuery(guery_product, {
                context: { headers: getHeaders(location) },
                fetchPolicy: 'no-cache',
                nextFetchPolicy: 'network-only',
                notifyOnNetworkStatusChange: false,
                skip: _.isEmpty(_id)
            });

    if (errorProduct) {
        handlerError(props, errorProduct);
    }

    useEffect(()=>{
        if(data){
            switch(homeFilter.filter.product_type){
                case 1: {
                  if(cart_plan_front){
                    setInCart(cart_plan_front.some((item) => item._id === data._id));
                  }
                  break;
                }
            
                case 2: {
                  if(cart_plan_back){
                    setInCart(cart_plan_back.some((item) => item._id === data._id));
                  }
                  break;
                }
            }
        }
    }, [data, cart_plan_front, cart_plan_back])

    useEffect(() => {
        if (_id) {
            refetchProduct({ id: _id });
        }
    }, [_id, refetchProduct]);

    useEffect(() => {
        if (!loadingProduct && dataProduct?.product) {
            if (dataProduct.product.status) {
                setData(dataProduct.product.data);

                console.log("dataProduct.product.data :", dataProduct.product.data)
            }
        }
    }, [dataProduct, loadingProduct]);

    const handleAddToCart = () => {
        if(data){
            // if(inCart){
            //     dispatch(removeCart(data?._id))
            //     message.warning('Delete for cart!');
            // } else {
            //     dispatch(addCart(data));
            //     message.success('Add to cart!');
            // }

            if(homeFilter.filter.product_type === 1){
                !inCart 
                ? dispatch( add_cart_plan_front(data) )
                : dispatch( removeCart_plan_front(data._id) )
            }else{
                !inCart
                ? dispatch( add_cart_plan_back(data) )
                : dispatch( removeCart_plan_back(data._id) )
            }

            // dispatch( homeFilter.filter.product_type === 1 
            //     ? add_cart_plan_front(data) 
            //     : add_cart_plan_back(data)
            //   )
            inCart
            ? message.error('Delete to cart!')
            : message.success('Add to cart!')
        } 
    };

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

    // const packageFront_BackView = (package_front: number[]) =>{
    //     return _.map(package_front, (v, index)=>{
    //         switch(v){
    //             case 1:return <Tag key={index} color="#2db7f5">1</Tag>
    //             case 2:return <Tag key={index} color="#2db7f5">8</Tag>
    //             case 3:return <Tag key={index} color="#2db7f5">56</Tag>
    //         }
    //     } )
    // }

    const ___vat = (vat: number) =>{
        switch(vat){
            case 0:return <Tag color="#2db7f5">None</Tag>
            case 1:return <Tag color="#2db7f5">Include</Tag>
            case 2:return <Tag color="#2db7f5">Exclude</Tag>
        }
    }

    if( _.isEmpty(data) ){
        return (
            <div style={{ padding: '5px' }}>
                <Skeleton active paragraph={{ rows: 4 }} />
            </div>
        );
    }

    return (
        <div style={{ padding: '5px' }}>
            <Row gutter={[16, 16]}>
            {/* Left Column - Product Images */}
            <Col xs={24} md={12}>
                <Card title="ไฟล์แนบ">
                <Skeleton loading={loadingProduct} active>
                    <Row gutter={[16, 16]}>
                    <Image.PreviewGroup>
                        {data.current.images.map((img, index) => (
                        <Col span={12} key={index}>
                            <Image src={`http://${REACT_APP_HOST_GRAPHAL}/${img.url}`} width={200} />
                        </Col>
                        ))}
                    </Image.PreviewGroup>
                    </Row>
                </Skeleton>
                </Card>
            </Col>

            {  /*
            {label="ชื่อสินค้า" name="name"}
            {label="ราคา (บาท)" name="price"}
            {label="ราคาขาย (บาท)" name="price_sell"}
            {label="รายละเอียด" name="detail"}
            {label="ไฟล์แนบ" name="images"}

            {label="จำนวนสินค้าทั้งหมด" name="quantity"}
            {label="ส่วนลดหน้าร้าน %" name="price_front"}
            {label="ประเภทสินค้า" name="product_type"}
            {name="package_front"}
            {name="package_back"}
            {label="ส่วนลดเฉพาะตำแหน่ง BM (ไม่เกิม 5%)" name="price_discount_bm"}
            {label="ส่วนลดมาตรฐาน BS (%)" name="price_discount_bs"}
            {label="ส่วนลดค่าแนะนำจาการซื้อ/ขายชของลูกทีม ติดตัวเท่านั้น" name="price_discount_from_childen"}
            {label="ส่วนลดค่าสำนักงาน (%)" name="price_discount_from_office"}
            {label="All Sale (%)" name="all_sale"}

            {label="ค่าจัดส่ง" name="price_delivery"}
            
            */}
    
            {/* Right Column - Product Information */}
            <Col xs={24} md={12}>
                <Card title="ข้อมูลสินค้า">
                <Skeleton loading={loadingProduct} active>
                    <Descriptions column={1}>
                        <Descriptions.Item label="ชื่อสินค้า">{data.current.name}</Descriptions.Item>
                        <Descriptions.Item label="ราคา (บาท)">{data.current.price}</Descriptions.Item>
                        <Descriptions.Item label="ราคาขาย (บาท)">{data.current.price_sell}</Descriptions.Item>
                        <Descriptions.Item label="รายละเอียด">{data.current.detail}</Descriptions.Item>
                        <Descriptions.Item label="จำนวนสินค้าทั้งหมด">{data.current.quantity}</Descriptions.Item>

                        <Descriptions.Item label="ส่วนลดหน้าร้าน %">{data.current.price_front}</Descriptions.Item>

                        {
                            _.includes(data.current.product_type, 1)
                            ?   <>
                                    <Descriptions.Item label="ประเภทสินค้า"><Tag color="#2db7f5">แผนหน้า</Tag></Descriptions.Item>
                                    <Descriptions.Item label="Package">{___package(data.current.package_front)} {___option(data.current.option_front)}</Descriptions.Item>
                                </>
                            : <></>
                        }

                        {
                            _.includes(data.current.product_type, 2)
                            ?   <>
                                    <Descriptions.Item label="ประเภทสินค้า"><Tag color="#2db7f5">แผนหลัง</Tag></Descriptions.Item>
                                    <Descriptions.Item label="Package">{___package(data.current.package_back)} {___option(data.current.option_back)} </Descriptions.Item>
                                </>
                            : <></>
                        }
                       
                        <Descriptions.Item label="ส่วนลดเฉพาะตำแหน่ง BM (ไม่เกิม 5%)">{data.current.price_discount_bm}</Descriptions.Item>
                        <Descriptions.Item label="ส่วนลดมาตรฐาน BS (%)">{data.current.price_discount_bs}</Descriptions.Item>
                        <Descriptions.Item label="ส่วนลดค่าแนะนำจาการซื้อ/ขายชของลูกทีม ติดตัวเท่านั้น">{data.current.price_discount_from_children}</Descriptions.Item>
                        <Descriptions.Item label="ส่วนลดค่าสำนักงาน (%)">{data.current.price_discount_from_office}</Descriptions.Item>
                        <Descriptions.Item label="All Sale (%)">{data.current.all_sale}</Descriptions.Item>
                        <Descriptions.Item label="ค่าจัดส่ง">{data.current.price_delivery}</Descriptions.Item>
                        
                        {/* vat */}
                        <Descriptions.Item label="Vat">{___vat(data.current.vat)}</Descriptions.Item>
                    </Descriptions>
                    <Divider />
    
                    {/* Plan and Packages as Tags */}
                    {/* <div>
                        <h4>Plans:</h4>
                        {data.current.plan.map((planId, index) => (
                            <Tag key={index} color="blue">
                            {planId}
                            </Tag>
                        ))}
                    </div>
                    <Divider /> */}

                     {/* Add to Cart and Buy Now Buttons */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Button type="primary" onClick={handleAddToCart}>
                        {inCart ? "Delete from cart" : "Add to cart"}
                        </Button>
                        <Button type="default" onClick={()=>{navigate("/cart"); }}>
                        Buy Now
                        </Button>
                    </div>
                </Skeleton>
                </Card>
            </Col>
            </Row>
        </div>
    );
};

export default ViewProduct;