import React, { FC } from 'react';
import { LoadingOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Avatar, Badge, List, Popover, Spin, Tabs, Tag, Tooltip, Button, message } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import _ from "lodash"

import { getNoticeList } from '@/api/layout.api';
import { ReactComponent as NoticeSvg } from '@/assets/header/notice.svg';
import { EventStatus } from '@/interface/layout/notice.interface';
import { useLocale } from '@/locales';
import type { Notice } from '@/interface/layout/notice.interface';
import type { UserState } from '@/interface/user/user';

import { DefaultRootState } from '@/interface/DefaultRootState';
import { /*clearAllCart,*/ clearAllCart_plan_front, clearAllCart_plan_back } from "@/stores/user.store"
import { useAppContext } from '@/AppContext';

const { REACT_APP_HOST_GRAPHAL } = process.env;

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const { TabPane } = Tabs;
const CartComponent: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);
  const [noticeList, setNoticeList] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const { noticeCount } = useSelector((state: {user: UserState}) => state.user);
  const { formatMessage } = useLocale();

  const { homeFilter } = useAppContext();

  const { cart_plan_front, cart_plan_back } = useSelector((state : DefaultRootState) => state.user);

  const noticeListFilter = <T extends Notice['type']>(type: T) => {
    return noticeList.filter(notice => notice.type === type) as Notice<T>[];
  };

  // loads the notices belonging to logged in user
  // and sets loading flag in-process
  const getNotice = async () => {
    setLoading(true);
    const { status, result } = await getNoticeList();

    setLoading(false);
    status && setNoticeList(result);
  };

  useEffect(() => {
    getNotice();
  }, []);

  const ___badge = () => {
    switch(homeFilter.filter.product_type){
      case 1: {
        return  <Badge count={cart_plan_front?.length} overflowCount={999}>
                  <span 
                    className="notice" 
                    id="notice-center">
                    <ShoppingCartOutlined disabled={cart_plan_front.length === 0} style={{ opacity: cart_plan_front.length === 0 ? 0.5 : 1 }} />
                  </span>
                </Badge>
      }
      case 2: {
        return  <Badge count={cart_plan_back?.length} overflowCount={999}>
                  <span 
                    className="notice" 
                    id="notice-center">
                    <ShoppingCartOutlined disabled={cart_plan_back.length === 0} style={{ opacity: cart_plan_back.length === 0 ? 0.5 : 1 }} />
                  </span>
                </Badge>
      }
    }
  }
  
  const ___cart = () =>{
    switch(homeFilter.filter.product_type){
      case 1: {
        return  <TabPane
                  // tab={`${formatMessage({ id: 'app.notice.messages', })}(${noticeListFilter('notification').length})`}
                  tab={`List product (${cart_plan_front?.length}) แผนหน้า`}
                  key="1">
                  <List
                    style={{ maxHeight: '300px', overflowY: 'auto' }} 
                    dataSource={cart_plan_front}
                    renderItem={item => (
                      <List.Item onClick={()=> navigate(`/view?v=${item._id}`, { state: { _id: item._id } }) }>
                        <List.Item.Meta
                          avatar={<Avatar src={ item.current.images?.length > 0 ? `http://${REACT_APP_HOST_GRAPHAL}/${item.current.images[0]?.url }`: "" } />}
                          title={<a >{item.current.name}</a>}
                          description={item.current.detail}
                        />
                      </List.Item>
                    )}
                  />
                  {
                    cart_plan_front.length === 0 
                    ? <></>
                    : <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px' }}>
                        <Button 
                          type="primary" 
                          danger 
                          ghost 
                          disabled={_.isEmpty(cart_plan_front) ? true : false}
                          onClick={() => {
                            dispatch(clearAllCart_plan_front());
                            message.success('Clear all success!');
                            setVisible(false)
                          }}>
                          Clear all
                        </Button>
                        <Button type="primary" onClick={() => { 
                          navigate("/cart"); 
                          setVisible(false); 
                        }}>
                          See in cart
                        </Button>
                      </div>
                  }
                  
                </TabPane>
      }

      case 2: {
        return  <TabPane
                  // tab={`${formatMessage({ id: 'app.notice.messages', })}(${noticeListFilter('notification').length})`}
                  tab={`List product (${cart_plan_back?.length}) แผนหลัง`}
                  key="1">
                  <List
                    style={{ maxHeight: '300px', overflowY: 'auto' }} 
                    dataSource={cart_plan_back}
                    renderItem={item => (
                      <List.Item onClick={()=> navigate(`/view?v=${item._id}`, { state: { _id: item._id } }) }>
                        <List.Item.Meta
                          avatar={<Avatar src={ item.current.images?.length > 0 ? `http://${REACT_APP_HOST_GRAPHAL}/${item.current.images[0]?.url }`: "" } />}
                          title={<a >{item.current.name}</a>}
                          description={item.current.detail}
                        />
                      </List.Item>
                    )}
                  />
                  {
                    cart_plan_back.length === 0 
                    ? <></>
                    : <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px' }}>
                        <Button 
                          type="primary" 
                          danger 
                          ghost 
                          disabled={_.isEmpty(cart_plan_back) ? true : false}
                          onClick={() => {
                            dispatch(clearAllCart_plan_back());
                            message.success('Clear all success!');
                            setVisible(false)
                          }}>
                          Clear all
                        </Button>
                        <Button type="primary" onClick={() => { 
                          navigate("/cart"); 
                          setVisible(false); 
                        }}>
                          See in cart
                        </Button>
                      </div>
                  }
                  
                </TabPane>
      }
    }
  }

  const tabs = (
    <div>
      <Spin tip="Loading..." indicator={antIcon} spinning={loading}>
        <Tabs defaultActiveKey="1">
          {___cart()}
        </Tabs>
      </Spin>
    </div>
  );

  return (
    <Popover
      content={tabs}
      overlayClassName="bg-2"
      placement="bottomRight"
      trigger={['click']}
      open={visible}
      onOpenChange={v => setVisible(v)}
      overlayStyle={{ width: 336 }} >
      <Tooltip title={formatMessage({ id: 'gloabal.tips.theme.cartTooltip' })}> { ___badge() } </Tooltip>
    </Popover>
  );
};

export default CartComponent;
