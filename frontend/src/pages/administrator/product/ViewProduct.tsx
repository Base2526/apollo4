import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Typography, Tag, Skeleton, Avatar, Button, message } from 'antd';
import { useQuery } from "@apollo/client";
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import _ from "lodash";

import { guery_product } from "@/apollo/gqlQuery";
import { getHeaders } from "@/utils";
import handlerError from "@/utils/handlerError";
import { ProductItem } from "@/interface/user/user"
import { addCart, removeCart } from '@/stores/user.store';
import { DefaultRootState } from '@/interface/DefaultRootState';

const { Text } = Typography;

const { VITE_HOST_GRAPHAL }  = process.env;
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

    const handleBuyNow = () => {
        navigate("/cart"); 
    };

    

    return (
        <Card 
            title="Product Details" 
            loading={loadingProduct}
            actions={[
                <div style={{ display: 'flex', justifyContent: 'end', padding: '5px' }}>
                    <Button type="default" onClick={handleAddToCart}>{inCart ? "Delete form cart" : "Add to cart"}</Button>
                    <Button type="primary" onClick={handleBuyNow}>Buy Now</Button>
                </div> 
            ]}
        >
            {loadingProduct || data === null
                ? <Skeleton active />
                : <div className='ant-card-body-view-product'>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Text strong>Name:</Text>
                            <Text>{data.current.name}</Text>
                        </Col>
                        <Col span={12}>
                            <Text strong>Detail:</Text>
                            <Text>{data.current.detail}</Text>
                        </Col>
                    </Row>
                    <Row gutter={16} style={{ marginTop: 16 }}>
                        <Col span={12}>
                            <Text strong>Plan:</Text>
                            { data.current.plan.map((v, index) => <Tag color="#2db7f5" key={index}>{ v == 1 ? "Frontend" : "Backend"}</Tag> ) }
                        </Col>
                        <Col span={12}>
                            <Text strong>Price:</Text>
                            <Text>${data.current.price}</Text>
                        </Col>
                    </Row>
                    <Row gutter={16} style={{ marginTop: 16 }}>
                        <Col span={12}>
                            <Text strong>Packages:</Text>
                            { data.current.packages.map((pkg, index) =>{
                                switch(pkg){
                                    case 1:
                                        return <Tag color="#2db7f5" key={index}>1</Tag>;
                                    case 2:
                                        return <Tag color="#2db7f5" key={index}>8</Tag>;
                                    case 3:
                                        return <Tag color="#2db7f5" key={index}>57</Tag>;
                                }
                            }) }
                        </Col>
                        <Col span={12}>
                            <Text strong>Images:</Text>
                            <Avatar.Group
                                max={{
                                    count: 2,
                                    style: { color: '#f56a00', backgroundColor: '#fde3cf' },
                                }}>
                                {
                                    _.map(data.current.images, (iv, index) => {
                                        return <Avatar key={index} src={`http://${VITE_HOST_GRAPHAL}/${iv.url}`} />;
                                    })
                                }
                            </Avatar.Group>
                        </Col>
                    </Row>
                </div>
            }
        </Card>
    );
};

export default ViewProduct;