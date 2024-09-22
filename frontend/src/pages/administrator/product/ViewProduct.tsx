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
import { addCart, removeCart } from '@/stores/user.store';
import { DefaultRootState } from '@/interface/DefaultRootState';

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
    
    const { carts } = useSelector((state : DefaultRootState) => state.user);
    const inCart = carts.find((item)=>item._id === _id ) === undefined ? false : true

    const { loading: loadingProduct, 
            data: dataProduct, 
            error: errorProduct,
            refetch: refetchProduct } = useQuery(guery_product, {
                context: { headers: getHeaders(location) },
                fetchPolicy: 'cache-first',
                nextFetchPolicy: 'network-only',
                notifyOnNetworkStatusChange: false,
            });

    if (errorProduct) {
        handlerError(props, errorProduct);
    }

    useEffect(() => {
        if (_id) {
            refetchProduct({ id: _id });
        }
    }, [_id, refetchProduct]);

    useEffect(() => {
        if (!loadingProduct && dataProduct?.product) {
            if (dataProduct.product.status) {
                setData(dataProduct.product.data);
            }
        }
    }, [dataProduct, loadingProduct]);

    const handleAddToCart = () => {
        if(data){
            if(inCart){
                dispatch(removeCart(data?._id))
                message.warning('Delete for cart!');
            } else {
                dispatch(addCart(data));
                message.success('Add to cart!');
            }
        } 
    };

    if(data === null){
        return <></>
    }

    return (
        <div style={{ padding: '5px' }}>
            <Row gutter={[16, 16]}>
            {/* Left Column - Product Images */}
            <Col xs={24} md={12}>
                <Card title="Product Images">
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
    
            {/* Right Column - Product Information */}
            <Col xs={24} md={12}>
                <Card title="Product Information">
                <Skeleton loading={loadingProduct} active>
                    <Descriptions column={1}>
                    <Descriptions.Item label="Name">{data.current.name}</Descriptions.Item>
                    <Descriptions.Item label="Details">{data.current.detail}</Descriptions.Item>
                    <Descriptions.Item label="Price">${data.current.price}</Descriptions.Item>
                    <Descriptions.Item label="Quantity">{data.current.quantity}</Descriptions.Item>
                    </Descriptions>
                    <Divider />
    
                    {/* Plan and Packages as Tags */}
                    <div>
                        <h4>Plans:</h4>
                        {data.current.plan.map((planId, index) => (
                            <Tag key={index} color="blue">
                            {planId}
                            </Tag>
                        ))}
                    </div>
                    <Divider />

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