import "./index.less";
import React, { useState, useEffect } from 'react';
import { message, Table, Input, Tag, Avatar, Space, Dropdown, Button, Typography, Modal, Menu, Tree } from 'antd';
import moment from 'moment';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';
import _ from 'lodash';
import { DownOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

import { guery_orders, mutation_product } from '@/apollo/gqlQuery';
import { getHeaders } from '@/utils';
import handlerError from '@/utils/handlerError';

import { OrderItem, OrderProductDetail } from "@/interface/user/user"
const { Paragraph, Text } = Typography;

interface PurchaseCompleteProps {
  purchaseData: any;
}

interface MenuItem {
  key: string;
  label: string;
}

const menuItems: MenuItem[] = [
  { key: '1', label: 'Edit' },
  { key: '2', label: 'Delete' },
];

const columns = (navigate: ReturnType<typeof useNavigate>, onDelete: (item: OrderItem) => void) => [
  {
    title: 'Code ID',
    dataIndex: '_id',
    render: (_id: string) => <Paragraph copyable>{_id}</Paragraph>
  },
  {
    title: 'Products',
    dataIndex: 'productDetails',
    render: (values: OrderProductDetail[]) => {
        // console.log("values :", values)
      return (
        <Tree
          treeData={values.map((detail, index) => ({
            title: `${index+1} : ${detail.current.name} - $${detail.current.price}`,
            key: detail._id,
            // You can add more properties here if needed
          }))}
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
//   status
  {
    title: 'Status',
    dataIndex: ['current', 'status'],
    render: (status: number) => {
        // 1 : waiting, 2: complete, 3: cancel
        switch(status){
            case 1: {
                return <Tag color="#2db7f5" key={status}>{"waiting".toUpperCase()}</Tag> 
            }
            case 2: {
                return <Tag color="green" key={status}>{"complete".toUpperCase()}</Tag> 
            }
            case 3: {
                return <Tag color="red" key={status}>{"cancel".toUpperCase()}</Tag> 
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
    render: (data: any) => (
        <Space size="middle">
            <a onClick={() =>{   navigate('/administrator/orders/edit', { state: { _id: data._id } })  }}>
                View
            </a>
            {/* <Dropdown
                overlay={() => (
                    <Menu
                        onClick={(e) => {
                            if (e.key === '1') {
                               
                            } else if (e.key === '2') {
                          
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
            </Dropdown> */}
        </Space>
    ),
},
];

const PurchaseComplete: React.FC<PurchaseCompleteProps> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchText, setSearchText] = useState<string>('');
  const [filteredData, setFilteredData] = useState<OrderItem[]>();
  const [data, setData] = useState<OrderItem[]>();
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { profile } = useSelector((state: any) => state.user);

  const { Paragraph, Text } = Typography;

  let { purchaseData } = props

  const handleSearch = (value: string) => {
    // Add search functionality if needed
  };

  useEffect(()=>{
    const filtered = _.filter(purchaseData, (item) => item.current.status === 2);
    setData(filtered);
    setFilteredData(filtered);
  }, [purchaseData])

  const showDeleteConfirm = (item: OrderItem) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const handleDelete = () => {
    if (selectedItem) {
    //   onProduct({ variables: { input: { _id : selectedItem._id, mode: 'deleted'} } });
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
        columns={columns(navigate, showDeleteConfirm)}
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

export default PurchaseComplete;