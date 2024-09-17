import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Typography, Tag, Skeleton, Avatar } from 'antd';
import { Table, Input, Space, Dropdown, Image, Button, Divider, Tooltip } from 'antd';

import { useQuery } from "@apollo/client";
import { useLocation } from 'react-router-dom';
import _ from "lodash";

import { guery_product } from "@/apollo/gqlQuery";
import { getHeaders } from "@/utils";
import handlerError from "@/utils/handlerError";

const { Text } = Typography;

interface DataType {
    ownerId: string;
    name: string;
    detail: string;
    plan: string[]; // Adjusted to string[] assuming plan is an array of strings
    price: number;
    packages: string[]; // Adjusted to string[] assuming packages is an array of strings
    images: any[]; // Adjusted to string[] assuming images is an array of strings
}

const { VITE_HOST_GRAPHAL }  = process.env

const ViewProduct: React.FC = (props) => {
    const location = useLocation();
    const { _id } = location.state || {}; // Retrieve the state
    const [data, setData] = useState<DataType | null>(null); // Initialize as DataType | null

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

    useEffect(()=>{
        console.log("data :", data)
    }, [data])

    return (
        <Card title="Product Details" loading={loadingProduct}>
            {loadingProduct || data === null
                ? <Skeleton active />
                : <>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Text strong>Name:</Text>
                            <Text>{data.name}</Text>
                        </Col>
                        <Col span={12}>
                            <Text strong>Detail:</Text>
                            <Text>{data.detail}</Text>
                        </Col>
                    </Row>
                    <Row gutter={16} style={{ marginTop: 16 }}>
                        <Col span={12}>
                            <Text strong>Plan:</Text>
                            { data.plan.map((item, index) => <Tag color="#2db7f5" key={index}>{ parseInt(item) == 1 ? "Frontend" : "Backend"}</Tag>  ) }
                        </Col>
                        <Col span={12}>
                            <Text strong>Price:</Text>
                            <Text>${data.price}</Text>
                        </Col>
                    </Row>
                    <Row gutter={16} style={{ marginTop: 16 }}>
                        <Col span={12}>
                            <Text strong>Packages:</Text>
                            { data.packages.map((pkg, index) =>{
                                switch(parseInt(pkg)){
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
                                    _.map(data.images, (iv)=>{
                                        console.log("`http://${VITE_HOST_GRAPHAL}${iv.url} :", `${VITE_HOST_GRAPHAL}/${iv.url}`)
                                        return <Avatar src={`http://${VITE_HOST_GRAPHAL}/${iv.url}`}/>
                                    })
                                }
                            </Avatar.Group>
                        </Col>
                    </Row>
                </>
            }
        </Card>
    );
};

export default ViewProduct;
