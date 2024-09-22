import React, { FC } from 'react';
import { LoadingOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Avatar, Badge, List, Popover, Spin, Tabs, Tag, Tooltip, Button, message } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import { getNoticeList } from '@/api/layout.api';
import { ReactComponent as NoticeSvg } from '@/assets/header/notice.svg';
import { EventStatus } from '@/interface/layout/notice.interface';
import { useLocale } from '@/locales';
import type { Notice } from '@/interface/layout/notice.interface';
import type { UserState } from '@/interface/user/user';

import { DefaultRootState } from '@/interface/DefaultRootState';
import { clearAllCart } from "@/stores/user.store"

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

  const { carts } = useSelector((state : DefaultRootState) => state.user);

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

  const tabs = (
    <div>
      <Spin tip="Loading..." indicator={antIcon} spinning={loading}>
        <Tabs defaultActiveKey="1">
          <TabPane
            // tab={`${formatMessage({ id: 'app.notice.messages', })}(${noticeListFilter('notification').length})`}
            tab={`List product (${carts?.length})`}
            key="1"
          >
            <List
              style={{ maxHeight: '300px', overflowY: 'auto' }} 
              dataSource={carts}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px' }}>
              <Button type="primary" danger ghost onClick={() => {
                dispatch(clearAllCart());
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
          </TabPane>

          {/* 
          <TabPane
            tab={`${formatMessage({
              id: 'app.notice.news',
            })}(${noticeListFilter('message').length})`}
            key="2"
          >
            <List
              dataSource={noticeListFilter('message')}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={<a href={item.title}>{item.title}</a>}
                    description={
                      <div className="notice-description">
                        <div className="notice-description-content">{item.description}</div>
                        <div className="notice-description-datetime">{item.datetime}</div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </TabPane>
          <TabPane
            tab={`${formatMessage({
              id: 'app.notice.tasks',
            })}(${noticeListFilter('event').length})`}
            key="3"
          >
            <List
              dataSource={noticeListFilter('event')}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <div className="notice-title">
                        <div className="notice-title-content">{item.title}</div>
                        <Tag color={EventStatus[item.status]}>{item.extra}</Tag>
                      </div>
                    }
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </TabPane>
           */}

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
      overlayStyle={{
        width: 336,
      }}
    >
      <Tooltip
        title={formatMessage({
          id: 'gloabal.tips.theme.cartTooltip',
        })}
      >
        <Badge count={carts?.length} overflowCount={999}>
          <span className="notice" id="notice-center">
          <ShoppingCartOutlined />
          </span>
        </Badge>
      </Tooltip>
    </Popover>
  );
};

export default CartComponent;
