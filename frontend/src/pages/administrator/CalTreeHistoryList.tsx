import React, { useState, useEffect } from 'react';
import { Table, Input, Tag, Space, Dropdown, Spin } from 'antd';
import moment from "moment";
import { useQuery } from "@apollo/client";
import { useNavigate, useLocation } from "react-router-dom";
import _ from "lodash";
import { DownOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

import { query_cals } from "../../apollo/gqlQuery";
import { getHeaders } from "../../utils";

interface DataType {
    key: string;
    creator: any;
    path: string;
    status: number;
    createdAt: string;
}

const items = [
    { key: '1', label: 'Edit' },
    { key: '2', label: 'Delete' },
];

const columns = (navigate: ReturnType<typeof useNavigate>) => [
    {
        title: 'User',
        dataIndex: 'creator',
        render: (creator: any) => {
            return <Tag color="#2db7f5">{creator?.current?.displayName}</Tag>;
        },
    },
    {
        title: 'File Name',
        dataIndex: 'fileName',
        render: (fileName: string) => {
            return <Tag color="#2db7f5">{fileName}</Tag>;
        },
    },
    {
        title: 'Status',
        dataIndex: 'status',
        render: (status: number) => {
            return <Tag color={status === 0 ? "red" : "#2db7f5"}>{status === 0 ? 'failed' : 'success'}</Tag>;
        },
    },
    {
        title: 'Date',
        dataIndex: 'createdAt',
        render: (data: string) => {
            return <div>{moment(new Date(data)).format('MMMM Do YYYY, h:mm:ss a')}</div>;
        },
    },
    {
        title: 'Action',
        key: 'action',
        render: (data: any) => {
            return (
                <Space size="middle">
                    <a onClick={() => { /* navigate("/administrator/userlist/user") */ }}>View</a>
                    <Dropdown menu={{ items }}>
                        <a>More <DownOutlined /></a>
                    </Dropdown>
                </Space>
            );
        },
    },
];

const CalTreeHistoryList: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchText, setSearchText] = useState<string>('');
    const [data, setData] = useState<DataType[]>([]);
    const { profile } = useSelector((state: any) => state.user);

    const { loading: loadingCals, data: dataCals } = useQuery(query_cals, {
        context: { headers: getHeaders(location) },
        fetchPolicy: 'cache-first',
        nextFetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: false,
    });

    useEffect(() => {
        if (!loadingCals && dataCals?.cals?.status) {
            const fetchedData = dataCals.cals.data.map((e: any, key: number) => ({
                key: key.toString(),
                creator: e.creator,
                fileName: e.fileName,
                status: e.status,
                createdAt: e.createdAt,
            }));
            setData(fetchedData);
        }
    }, [dataCals, loadingCals]);

    const handleSearch = (value: string) => {
        setSearchText(value);
        // Add your search filter logic here
    };

    return (
        <div>
            <Input.Search
                placeholder="Search..."
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ marginBottom: 16 }}
            />
            <Spin spinning={loadingCals}>
                <Table
                    columns={columns(navigate)}
                    dataSource={data}
                    pagination={{ pageSize: 50 }}
                    rowKey="key"
                />
            </Spin>
        </div>
    );
};

export default CalTreeHistoryList;
