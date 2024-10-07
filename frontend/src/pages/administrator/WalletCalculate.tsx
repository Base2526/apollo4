import React, { useState, useEffect } from 'react';
import { Table, Button, Spin, Tag, Select, message, Typography } from 'antd';
import { ReloadOutlined, FundViewOutlined, DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import moment from "moment";
import { useQuery } from "@apollo/client";
import { useLocation } from "react-router-dom";
import { DataNode as RcTreeDataNode } from 'rc-tree/lib/interface';
import _ from "lodash";

import { query_bills, query_periods } from "@/apollo/gqlQuery";
import { getHeaders } from "@/utils";
import TreeModal from "@/pages/administrator/TreeModal";
import handlerError from "@/utils/handlerError";

const { Paragraph } = Typography;
const { Option } = Select;

interface DataType {
    _id: string;
    current: any;
    node_child: any;
    updatedAt: any;
}

interface DataNode extends RcTreeDataNode {
    title: string;
    owner?: {
      current?: {
        displayName?: string;
      };
    };
    node?: {
      current?: {
        status?: number;
      };
      _id?: string;
      inRealPeriod?: boolean;
      inVisulPeriod?: boolean;
      updatedAt?: string;
    };
    children: DataNode[]
}

const countNodesExcludingFirst = (nodes: DataNode[]): number => {
    if (!nodes[0].children) return 0;

    const recursiveCount = (children: DataNode[]): number => {
        return _.sumBy(children, (child) => 1 + recursiveCount(child.children || []));
    };

    return recursiveCount(nodes[0].children);
};

const countInRealPeriodNodes = (nodes: DataNode[]): number => {
    let count = 0;
    nodes?.forEach((node) => {
        if (node.node?.inRealPeriod) {
            count++;
        }
        count += countInRealPeriodNodes(node.children);
    });
    return count;
};

const countInVisulPeriodNodes = (nodes: DataNode[]): number => {
    let count = 0;
    nodes?.forEach((node) => {
        if (node.node?.inVisulPeriod) {
            count++;
        }
        count += countInVisulPeriodNodes(node.children);
    });
    return count;
};

const WalletCalculate: React.FC = (props) => {
    const location = useLocation();
    const [filteredData, setFilteredData] = useState<DataType[]>([]);
    const [periods, setPeriods] = useState<any[]>([]);
    const [selectedPeriod, setSelectedPeriod] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [nodeId, setNodeId] = useState("");

    const [pageSize, setPageSize] = useState(20); // State for page size
    const [currentPage, setCurrentPage] = useState(1); // State for current page

    const { loading: loadingPeriods, data: dataPeriods, error: errorPeriods } = useQuery(query_periods, {
        context: { headers: getHeaders(location) },
        fetchPolicy: 'cache-first',
        nextFetchPolicy: 'network-only',
    });

    if (errorPeriods) {
        handlerError(props, errorPeriods);
    }

    useEffect(() => {
        if (!loadingPeriods && dataPeriods?.periods?.status) {
            setPeriods(dataPeriods.periods.data);
        }
    }, [dataPeriods, loadingPeriods]);

    const { loading: loadingBills, data: dataBills, error: errorBills, refetch: refetchBills } = useQuery(query_bills, {
        context: { headers: getHeaders(location) },
        fetchPolicy: 'cache-first',
        nextFetchPolicy: 'network-only',
    });

    if (errorBills) {
        handlerError(props, errorBills);
    }

    useEffect(() => {
        if (!loadingBills && dataBills?.bills?.status) {
            // setFilteredData(dataBills.bills.data);
            // if (loading) {
            //     message.success('Balance refreshed!');
            //     setLoading(false);
            // }
        }
    }, [dataBills, loadingBills]);

    const handlePeriodChange = (value: string[]) => {
        console.log("Selected periods:", value);
        setSelectedPeriod(value); // Directly store the array of selected periods
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            render: (text: string) => <Paragraph copyable>{text}</Paragraph>,
        },
        
        {
            title: 'ยอดทั้งหมดเสมือนจ่ายจริง',
            dataIndex: 'node_child',
            key: 'node_child',
            render: (children: any) => (
                <Tag color="green">{countNodesExcludingFirst(children)}</Tag>
            ),
        },
        {
            title: 'ยอดจ่ายจริงแต่ละ period',
            dataIndex: 'node_child',
            key: 'realPeriod',
            render: (children: any) => (
                <Tag color="green">{countInRealPeriodNodes(children) * 20}</Tag>
            ),
        },
        {
            title: 'ยอดเสมือนจ่ายจริงแต่ละ period',
            dataIndex: 'node_child',
            key: 'visualPeriod',
            render: (children: any) => (
                <Tag color="gray">{countInVisulPeriodNodes(children) * 20}</Tag>
            ),
        },
        {
            title: 'Last Update',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (text: any) => moment(new Date(text)).format('MMMM Do YYYY, h:mm:ss a'),
        },
        {
            title: 'Action',
            key: 'action',
            render: (record: DataType) => (
                <>
                <Button
                    type="primary"
                    icon={<FundViewOutlined />}
                    onClick={() => {
                        setNodeId(record._id);
                        setVisible(true);
                    }} />
                <Button
                    type="default"
                    style={{ marginRight: '10px' }}
                    // loading={loading}
                    icon={<ReloadOutlined />}
                    onClick={() => {
                        
                    }}
                /></>
                
            ),
        },
    ];

    return (
        <Spin spinning={loadingBills} tip="Loading..." size="large">
            <div style={{ padding: '10px' }}>
                <Select
                    mode="multiple" // Enable multi-select
                    placeholder="Select periods"
                    style={{ width: 250, marginRight: '10px' }}
                    value={selectedPeriod} // Use the selectedPeriod array directly
                    onChange={handlePeriodChange}
                >
                    {periods.map((period: any) => (
                        <Option key={period._id} value={period._id}>
                            {moment(period.start).format('MMM Do YY')} - {moment(period.end).format('MMM Do YY')}
                        </Option>
                    ))}
                </Select>
                <Button
                    type="default"
                    style={{ marginRight: '10px' }}
                    loading={loading}
                    icon={<SearchOutlined />}
                    disabled={ _.isEmpty(selectedPeriod) ? true: false }
                    onClick={() => {
                        // setLoading(true);
                        // refetchBills();

                        console.log("selectedPeriod :", selectedPeriod)
                    }}
                />
                <Button
                    type="default"
                    style={{ marginRight: '10px' }}
                    loading={downloadLoading}
                    disabled={ _.isEmpty(selectedPeriod) ? true: false }
                    icon={<DownloadOutlined />}
                    onClick={() => {
                        setDownloadLoading(true)
                    }}
                />
            </div>
            <div style={{marginTop: '10px', marginBottom: '10px'}}>
                <div>All Node: <Tag>{ filteredData.length }</Tag></div>
            </div>
            <Table 
                columns={columns} 
                dataSource={filteredData} 
                rowKey="_id" 
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: filteredData.length, // Total count of the rows
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`, // Display total count
                    showSizeChanger: true, // Allow the user to change page size
                    pageSizeOptions: ['20', '50', '100'], // Options for page sizes
                    onShowSizeChange: (current, size) => {
                      setPageSize(size); // Update page size
                    },
                    onChange: (page) => {
                      setCurrentPage(page); // Update current page
                    },
                }}
            />
            {visible && nodeId !== "" && <TreeModal node_id={nodeId} show={visible} onClose={() => setVisible(false)} />}
        </Spin>
    );
};

export default WalletCalculate;
