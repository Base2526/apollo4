import "./index.less";
import React, { useState, useEffect } from 'react';
import { message, Table, Input, Tabs, Tag, Avatar, Space, Dropdown, Button, Typography, Modal, Menu, Skeleton } from 'antd'; // Import Skeleton
import moment from 'moment';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';
import _ from 'lodash';
import { DownOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

import { guery_purchases, mutation_order } from '@/apollo/gqlQuery';
import { getHeaders } from '@/utils';
import handlerError from '@/utils/handlerError';

import PurchaseAll from "@/pages/cart/PurchaseAll";
import PurchaseComplete from "@/pages/cart/PurchaseComplete";
import PurchaseCancel from "@/pages/cart/PurchaseCancel";

import { OrderItem, OrderProductDetail } from "@/interface/user/user"

const { TabPane } = Tabs;

const Purchase: React.FC = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  let { key : defaultActive } = location.state || 1; 

  const [filteredData, setFilteredData] = useState<OrderItem[]>();
  const [data, setData] = useState<OrderItem[]>();

  const { loading: loadingPurchases, data: dataPurchases, error: errorPurchases, refetch: refetchPurchases } = useQuery(guery_purchases, {
    context: { headers: getHeaders(location) },
    fetchPolicy: 'no-cache',
    nextFetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: false,
  });

  if (errorPurchases) {
    handlerError(props, errorPurchases);
  }

  useEffect(() => {
    if (!loadingPurchases && dataPurchases?.purchases) {
      setData([]);
      setFilteredData([]);
      if (dataPurchases.purchases.status) {
        _.map(dataPurchases.purchases.data, (e, key) => {
          setData((prevItems) => Array.isArray(prevItems) ? [...prevItems, e] : [e]);
          setFilteredData((prevItems) => Array.isArray(prevItems) ? [...prevItems, e] : [e]);
        });
      }
    }
  }, [dataPurchases, loadingPurchases]);

  const handleTabChange = (key: string) => {
    defaultActive = key;
    navigate(`/purchases/${key}`);
  };

  return (
    <Tabs defaultActiveKey={`${defaultActive}`} onChange={handleTabChange}>
      <TabPane tab="ทั้งหมด" key="1">
        {/* Show Skeleton while loading */}
        {loadingPurchases ? <Skeleton active /> : <PurchaseAll purchaseData={data} refetch={refetchPurchases}/>}
      </TabPane>
      <TabPane tab="สำเร็จแล้ว" key="2">
        {loadingPurchases ? <Skeleton active /> : <PurchaseComplete purchaseData={data}/>}
      </TabPane>
      <TabPane tab="ยกเลิก" key="3">
        {loadingPurchases ? <Skeleton active /> : <PurchaseCancel purchaseData={data}/>}
      </TabPane>
    </Tabs>
  );
};

export default Purchase;
