import "./index.less";
import React, { useState, useEffect } from 'react';
import { message, Table, Input, Tag, Avatar, Space, Popconfirm, Button, Typography, Modal, Menu, Tree } from 'antd';
import moment from 'moment';
import { useQuery, useMutation, ApolloQueryResult } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';
import _ from 'lodash';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

import { mutation_order, mutation_product } from '@/apollo/gqlQuery';
import { getHeaders } from '@/utils';
import handlerError from '@/utils/handlerError';

import { OrderItem, OrderProductDetail } from "@/interface/user/user"

const { Paragraph, Text } = Typography;

interface PurchaseAllProps {
  purchaseData: any;
  refetch:() => Promise<ApolloQueryResult<any>>;
}

interface MenuItem {
  key: string;
  label: string;
}

const menuItems: MenuItem[] = [
  { key: '1', label: 'Edit' },
  { key: '2', label: 'Delete' },
];

// 
const columns = ( navigate: ReturnType<typeof useNavigate>, 
                  onDelete: (item: OrderItem) => void, 
                  onOrder: (options?: any | undefined) => void ) => [
  {
    title: 'Code ID',
    dataIndex: '_id',
    render: (_id: string) => <Paragraph copyable>{_id}</Paragraph> ,
  },
  {
    title: 'Products',
    // dataIndex: 'productDetails',
    render: (values: OrderItem) => {
      let { productDetails, current } = values
      return (
        <Tree
          treeData={productDetails.map((detail, index) => {
            let productId = _.find(current.productIds, (item) =>item.productId === detail._id)
            let quantities = productId !== undefined ? productId.quantities : 0
            return{
              title: `${index+1} : ${detail.current.name} - $${detail.current.price} x ${ quantities }`,
              key: detail._id,
              // You can add more properties here if needed
            }
          })}
          defaultExpandAll
        />
      );
    }
  },
  {
    title: 'Total',
    dataIndex: 'productDetails',
    render: (values: OrderProductDetail[]) => {
        return <Typography>${  _.sumBy(values, (item) => item.current.price )} </Typography>
    }
  },
  {
    title: 'Status',
    dataIndex: ['current', 'status'],
    render: (status: number) => {
        // 1 : waiting, 2: complete, 3: cancel
        switch(status){
            case 1: {
                return <Tag color="#2db7f5" key={status}>{"WAITING"}</Tag> 
            }
            case 2: {
                return <Tag color="green" key={status}>{"COMPLETE"}</Tag> 
            }
            case 3: {
                return <Tag color="red" key={status}>{"CANCEL"}</Tag> 
            }
            case 4: {
              return <Tag color="red" key={status}>{"DELETE"}</Tag> 
          }
        }
    }
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
    render: (data: OrderItem) => {
      return  <Space size="middle">
                <Button type="link" icon={<EyeOutlined />} onClick={() =>{ navigate('/purchases/1/view', { state: { _id: data._id } }) }} >View</Button>
                {
                  data.current.status === 1
                  ? <Popconfirm
                      title="Are you sure to delete this product?"
                      onConfirm={() => { 
                        onOrder({ variables: { input: { mode: 'edited', type: 4, _id: data._id } } });
                      }}
                      okText="Yes"
                      cancelText="No">
                      <Button type="link" danger icon={<DeleteOutlined />}>
                        Delete
                      </Button>
                    </Popconfirm>
                  : <></>
                }
              </Space>
    },
},
];

const PurchaseAll: React.FC<PurchaseAllProps> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchText, setSearchText] = useState<string>('');

  const [data, setData] = useState<OrderItem[]>(props.purchaseData);
  const [filteredData, setFilteredData] = useState<OrderItem[]>(props.purchaseData);
  
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { profile } = useSelector((state: any) => state.user);

  let { refetch, purchaseData } = props

  const [onOrder] = useMutation(mutation_order, {
    context: { headers: getHeaders(location) },
    update: (cache, { data: { order } }) => {
      console.log("useMutation order :", order)
    },
    onCompleted: (data, clientOptions) => {
      let { variables: { input } } : any = clientOptions;

      if(input?.type === 4){
        refetch()
        message.warning('Delete order successfully!');
      }    
    },
    onError: (error) => {
      handlerError(props, error);
    }
  });

  const [onProduct] = useMutation(mutation_product, {
    context: { headers: getHeaders(location) },
    update: (cache, { data: { product } }) => {
      console.log("product:", product);
    },
    onCompleted: (data, clientOptions) => {
      let { variables: { input } } : any = clientOptions;
      if(input?.mode === 'deleted'){
        message.success('Delete successfully!');
        // refetchProduct()
      }
    },
    onError: (error) => {
      handlerError(props, error);
    }
  });

  useEffect(()=>{
    let filtered = _.filter(purchaseData, (item) => item.current.status === 1 || 
                                                      item.current.status === 2 ||
                                                      item.current.status === 3);
    filtered = _.sortBy(filtered, (item) => new Date(item.updatedAt)).reverse();                                           
    setData(filtered);
    setFilteredData(filtered);
  }, [purchaseData])

  const handleSearch = (value: string) => {
    // Add search functionality if needed
  };

  const showDeleteConfirm = (item: OrderItem) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const handleDelete = () => {
    if (selectedItem) {
      onProduct({ variables: { input: { _id : selectedItem._id, mode: 'deleted'} } });
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
      </Space>
      <Table
        columns={columns(navigate, showDeleteConfirm, onOrder)}
        dataSource={filteredData}
        pagination={{ pageSize: 50 }}
        rowKey="_id"
      />
      {
        isModalVisible && 
        <Modal
          title="Confirm Deletion"
          visible={isModalVisible}
          onOk={handleDelete}
          onCancel={handleCancel}
        >
          <p>Are you sure you want to delete this item?</p>
        </Modal>
      }
    </div>
  );
};

export default PurchaseAll;