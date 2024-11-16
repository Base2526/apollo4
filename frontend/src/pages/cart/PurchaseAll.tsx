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
import { getHeaders, ___price_discount_bm_or_bs, ___vat, ___discount_position_for_member } from '@/utils';
import handlerError from '@/utils/handlerError';
import * as utils from "@/utils";
import * as Constants from "@/constants";
import { useAppContext } from '@/AppContext';
import { OrderItem, ProfileType } from "@/interface/user/user"

const { Paragraph, Text } = Typography;

interface PurchaseAllProps {
  purchaseData: any;
  positions: any;
  refetch:() => Promise<ApolloQueryResult<any>>;
}

const columns = ( navigate: ReturnType<typeof useNavigate>, 
                  onDelete: (item: OrderItem) => void, 
                  onOrder: (options?: any | undefined) => void ,
                  positions: any,
                  profile: ProfileType,
                  tax: number) => [
  {
    title: 'Code ID',
    dataIndex: '_id',
    render: (_id: string) => <Paragraph copyable>{_id}</Paragraph> ,
  },
  {
    title: 'Products',
    dataIndex: 'current',
    render: (current: any) => {
      let { owner, products} = current
      let position = _.find(positions, (p)=>p._id?.toString() === owner?.positionId?.toString())
      return (
        <>
          <div>
            ตำแหน่ง: { position.name }
          </div>
          <Tree
            treeData={products.map((detail: any, index: number) => {
              let { quantities, product} = detail
              // console.log("treeData Products :", detail)

              return{
                title: `${index+1} : ${product.name}(${ ___vat(product.vat) }) - ฿${product.price_sell} x ${ quantities }, ส่วนลดตำแหน่ง (${ ___price_discount_bm_or_bs(positions, profile.current.positionIds, product) }%), ค่าจัดส่ง (${ product.price_delivery })`,
                key: detail._id
              }
            })}
            defaultExpandAll
          />
        </>
      );
    }
  },
  {
    title: 'Total',
    dataIndex: 'current',
    render: (current: any) => {
      let { type_plan, owner, products } = current

      const summaryDelivery = (products: any[]) =>{
        return _.sumBy(products, (item) => item.product.price_delivery )
      }

      const summaryPriceDiscount = (products: any[]) =>{
        let sum_price = 0;
        _.map(products, (cart, index)=>{
          let { quantities, product } = cart

          let newProduct = {...product, quantities}
          switch(product.vat){
            // None
            case 0:{
              let discount_position_for_member = ___discount_position_for_member(positions, profile.current.positionIds, newProduct);
              let price = (parseInt(product.price_sell)  * quantities) - discount_position_for_member;
              sum_price += price;              
              break;
            }

            // Include
            case 1:{
              let discount_position_for_member = ___discount_position_for_member(positions, profile.current.positionIds, newProduct);
              let price  =  (parseInt(product.price_sell)  * quantities) - discount_position_for_member;
              sum_price += price;
              break;
            }

            // Exclude
            case 2:{
              let discount_position_for_member = ___discount_position_for_member(positions, profile.current.positionIds, newProduct);
              let price  =  ((parseInt(product.price_sell)  * quantities) + (parseInt(product.price_sell)  * quantities) * (tax/100)) - discount_position_for_member;
              sum_price += price;
              break;
            }
          }
        })

        return sum_price;
      }

      const ___tax_at_pay5 = (products: any[]) =>{
        let ___summary_discount = 0;
        
        _.map(products, (cart, index)=>{
          let { quantities, product } = cart
          let newProduct = {...product, quantities}

          let price  = ___discount_position_for_member(positions, profile.current.positionIds, newProduct)
          ___summary_discount += price
        })

        return ___summary_discount * 5/100;
      }

      return  <> 
                <Typography>ค่าจัดส่ง : { summaryDelivery(products) }</Typography>
                <Typography>ภาษีหัก ณ​ ที่จ่าย 5% : { ___tax_at_pay5(products) }</Typography>
                <Typography>ราคาหักส่วนลด : { summaryPriceDiscount(products) }</Typography>
                <Typography>ยอดชำระเงินทั้งหมด : ฿{ Math.ceil(summaryPriceDiscount(products) + ___tax_at_pay5(products) + summaryDelivery(products)) }</Typography>
              </>
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
                <Button type="link" icon={<EyeOutlined />} onClick={() =>{ navigate('/purchases/1/view', { state: { _id: data._id, mode: 'view' } }) }} >View</Button>
                {
                  utils.checkRole(profile) === Constants.ADMINISTRATOR
                  && <Button type="link" icon={<EyeOutlined />} onClick={() =>{ navigate('/purchases/1/edited', { state: { _id: data._id, mode: 'edited' } }) }} >View</Button>
                }
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

  // console.log("positions :", props.positions)

  const { homeFilter } = useAppContext();

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
        columns={columns(navigate, showDeleteConfirm, onOrder, props.positions, profile, homeFilter.tax)}
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