import React, { useState } from 'react';
import { Input, Upload, Button, Select, message, Card, Descriptions, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import moment from 'moment';

const Wallet: React.FC = () => {
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div style={{ padding: '3px' }}>
      <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
        <Card>
          <Descriptions title="Wallet Information" bordered column={1} style={{ marginTop: '10px' }}>
            <Descriptions.Item label="Balance">
              {'0.00'} Baht
              <Button 
                type="default" 
                style={{ marginRight: '10px' }}
                onClick={() => message.success('Balance refreshed!')}
              >
                Refresh
              </Button>
            </Descriptions.Item>

            <Descriptions.Item label="Calculate from Nodes">
              <Button 
                type="primary" 
                style={{ marginRight: '10px' }}
                onClick={() => handleNavigate('/administrator/wallet/calculate')}
              >
                Calculate from Nodes
              </Button>
            </Descriptions.Item>

            <Descriptions.Item label="History (Transactions)">
              <Button 
                type="primary" 
                style={{ marginRight: '10px' }}
                onClick={() => handleNavigate('/administrator/wallet/history')}
              >
                Show History
              </Button>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Spin>
    </div>
  );
};

export default Wallet;
