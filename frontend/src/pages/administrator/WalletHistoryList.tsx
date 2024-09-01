import React from 'react';
import { Table, Typography, Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface DataType {
  key: string;
  date: string;
  name: string;
  amount: number;
  status: 'Deposit' | 'Withdraw';
}

const data: DataType[] = [
  { key: '1', date: '2024-08-28', name: 'John Brown', amount: 32, status: 'Deposit' },
  { key: '2', date: '2024-08-28', name: 'Jim Green', amount: 42, status: 'Withdraw' },
  { key: '3', date: '2024-08-27', name: 'Joe Black', amount: 52, status: 'Deposit' },
  { key: '4', date: '2024-08-26', name: 'Jim Red', amount: 62, status: 'Withdraw' },
  { key: '5', date: '2024-08-26', name: 'Jake White', amount: 72, status: 'Deposit' },
];

const columns: ColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: 'Deposit' | 'Withdraw') => (
      <Tag icon={status === 'Deposit' ? <ArrowUpOutlined /> : <ArrowDownOutlined />} color={status === 'Deposit' ? 'green' : 'red'}>
        {status}
      </Tag>
    ),
  },
];

const GroupedTable: React.FC = () => {
  const groupedData = data.reduce((acc: { [key: string]: DataType[] }, item) => {
    if (!acc[item.date]) {
      acc[item.date] = [];
    }
    acc[item.date].push(item);
    return acc;
  }, {});

  const renderGroupedSections = () => {
    return Object.keys(groupedData).map((date) => (
      <div key={date}>
        <Title level={4}>{date}</Title>
        <Table
          columns={columns}
          dataSource={groupedData[date]}
          pagination={false}
          rowKey="key"
        />
      </div>
    ));
  };

  return (
    <div>
      <h2>HISTORY-TRANSACTIONS</h2>
      {renderGroupedSections()}
    </div>
  );
};

export default GroupedTable;
