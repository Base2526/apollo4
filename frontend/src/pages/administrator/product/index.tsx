import React, { useState, useEffect } from 'react';
import { message, Table, Input, Tag, Avatar, Space, Dropdown, Button, Typography, Modal, Menu } from 'antd';
import moment from 'moment';
import { useQuery, useMutation, BaseMutationOptions } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';
import _ from 'lodash';
import { DownOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

import { guery_products, mutation_product } from '@/apollo/gqlQuery';
import { getHeaders } from '@/utils';
import handlerError from '@/utils/handlerError';

interface DataType {
    _id?: string;
    key: string;
    displayName: string;
    email: string;
    avatar?: string;
    roles: number[];
    timestamp: any;
    user?: any;
    filename?: string;
}

interface MenuItem {
    key: string;
    label: string;
}

const menuItems: MenuItem[] = [
    { key: '1', label: 'Edit' },
    { key: '2', label: 'Delete' },
];

const { VITE_HOST_GRAPHAL } = process.env;

const columns = (navigate: ReturnType<typeof useNavigate>, onDelete: (item: DataType) => void) => [
    {
        title: 'Avatar',
        dataIndex: 'images',
        render: (images: any) => (
            <Avatar.Group
                max={{
                    count: 2,
                    style: { color: '#f56a00', backgroundColor: '#fde3cf' },
                }}
            >
                {_.map(images, (iv) => (
                    <Avatar src={`http://${VITE_HOST_GRAPHAL}/${iv.url}`} />
                ))}
            </Avatar.Group>
        ),
    },
    {
        title: 'Name',
        dataIndex: 'name',
        render: (name: string) => <Typography>{name}</Typography>,
    },
    {
        title: 'Price',
        dataIndex: 'price',
        render: (price: number) => <Typography>{price}</Typography>,
    },
    {
        title: 'Plan',
        dataIndex: 'plan',
        render: (plan: string[]) => (
            <>
                {plan.map((item, index) => (
                    <Tag color="#2db7f5" key={index}>
                        {parseInt(item) === 1 ? 'Frontend' : 'Backend'}
                    </Tag>
                ))}
            </>
        ),
    },
    {
        title: 'Packages',
        dataIndex: 'packages',
        render: (packages: string[]) => (
            <>
                {packages.map((pkg, index) => {
                    switch (parseInt(pkg)) {
                        case 1:
                            return <Tag color="#2db7f5" key={index}>1</Tag>;
                        case 2:
                            return <Tag color="#2db7f5" key={index}>8</Tag>;
                        case 3:
                            return <Tag color="#2db7f5" key={index}>57</Tag>;
                        default:
                            return null;
                    }
                })}
            </>
        ),
    },
    {
        title: 'Creator',
        dataIndex: 'creator',
        render: (creator: any) => <Tag color="#2db7f5">{creator.current.displayName}</Tag>,
    },
    {
        title: 'Date',
        dataIndex: 'updatedAt',
        render: (updatedAt: string) => (
            <div>{moment(new Date(updatedAt), 'YYYY-MM-DD HH:mm').format('MM Do YY, h:mm')}</div>
        ),
    },
    {
        title: 'Action',
        key: 'action',
        render: (data: any) => (
            <Space size="middle">
                <a onClick={() => navigate('/administrator/products/view', { state: { _id: data._id } })}>
                    View
                </a>
                <Dropdown
                    overlay={() => (
                        <Menu
                            onClick={(e) => {
                                if (e.key === '1') {
                                    navigate('/administrator/products/edit', { state: { mode: 'edited', _id: data._id } });
                                } else if (e.key === '2') {
                                    onDelete(data);
                                }
                            }}
                        >
                            {menuItems.map(item => (
                                <Menu.Item key={item.key}>{item.label}</Menu.Item>
                            ))}
                        </Menu>
                    )}
                    trigger={['hover']}
                >
                    <Button style={{ borderWidth: 0 }}>
                        More <DownOutlined />
                    </Button>
                </Dropdown>
            </Space>
        ),
    },
];

const ProductList: React.FC = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchText, setSearchText] = useState<string>('');
    const [filteredData, setFilteredData] = useState<DataType[]>();
    const [data, setData] = useState<DataType[]>();
    const [selectedItem, setSelectedItem] = useState<DataType | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { profile } = useSelector((state: any) => state.user);

    const prevLocationRef = React.useRef(location);

    const [onProduct] = useMutation(mutation_product, {
        context: { headers: getHeaders(location) },
        update: (cache, { data: { product } }) => {
          console.log("product:", product);
        },
        onCompleted: (data, clientOptions) => {
            let { variables: { input } } : any = clientOptions
            if(input?.mode === 'deleted'){
                message.success('Delete successfully!');
                refetchProduct()
            }
        },
        onError: (error) => {
            handlerError(props, error);
        }
    });

    const { loading: loadingProducts, data: dataProducts, error: errorProducts, refetch: refetchProduct } = useQuery(guery_products, {
        context: { headers: getHeaders(location) },
        fetchPolicy: 'no-cache',
        nextFetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: false,
    });

    if (errorProducts) {
        handlerError(props, errorProducts);
    }

    useEffect(()=>{
        console.log("useEffect")
    }, [])

    useEffect(() => {
        if (!loadingProducts && dataProducts?.products) {
            setData([]);
            setFilteredData([]);
            if (dataProducts.products.status) {
                _.map(dataProducts.products.data, (e, key) => {
                    setData((prevItems) => Array.isArray(prevItems) ? [...prevItems, e] : [e]);
                    setFilteredData((prevItems) => Array.isArray(prevItems) ? [...prevItems, e] : [e]);
                });
            }
        }
    }, [dataProducts, loadingProducts]);

    const handleSearch = (value: string) => {
        setSearchText(value);
        const filtered = data?.filter((item) =>
            item.displayName.toLowerCase().includes(value.toLowerCase()) ||
            item.filename?.toLowerCase().includes(value.toLowerCase()) || false
        ) || [];
        setFilteredData(filtered);
    };

    const showDeleteConfirm = (item: DataType) => {
        setSelectedItem(item);
        setIsModalVisible(true);
    };

    const handleDelete = () => {
        if (selectedItem) {
            // Perform delete action here, e.g., call a mutation to delete the item
            // After deletion, you might want to refetch data or remove item from state
            // console.log('Delete item:', selectedItem);

            onProduct({ variables: { input: { _id : selectedItem._id, mode: 'deleted'} } });

            // Reset modal
            setIsModalVisible(false);
            setSelectedItem(null);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedItem(null);
    };

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <Input.Search
                    placeholder="Search..."
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                <Button
                    type="primary"
                    onClick={() => navigate('/administrator/products/new', { state: { mode: 'added' } })}
                >
                    New Product
                </Button>
            </Space>
            <Table
                columns={columns(navigate, showDeleteConfirm)}
                dataSource={filteredData}
                pagination={{ pageSize: 50 }}
                rowKey="key"
            />
            {
                isModalVisible && 
                <Modal
                    title="Confirm Deletion"
                    visible={isModalVisible}
                    onOk={handleDelete}
                    onCancel={handleCancel}>
                    <p>Are you sure you want to delete this item?</p>
                </Modal>
            }
        </div>
    );
};

export default ProductList;