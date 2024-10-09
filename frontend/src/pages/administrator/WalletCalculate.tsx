import React, { useState, useEffect } from 'react';
import { Table, Button, Spin, Tag, Select, message, Typography } from 'antd';
import {    ReloadOutlined, 
            FundViewOutlined, 
            DownloadOutlined, 
            SearchOutlined, 
            CaretDownOutlined, 
            CaretUpOutlined 
        } from '@ant-design/icons';
import moment from "moment";
import { useQuery, useMutation } from "@apollo/client";
import { useLocation } from "react-router-dom";
import { DataNode as RcTreeDataNode } from 'rc-tree/lib/interface';
import _ from "lodash";
import { query_periods, mutation_bills, mutation_bills_xml2js } from "@/apollo/gqlQuery";
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

interface NodeChildType {
    node: any;
    children: any[]
}

interface BillsType {
    _id: string;
    node_child: any[];
}

interface GroupDataNode {
    period: {
        _id: string;
        start: string;
        end: string;
        createdAt: string;
    };
    bills: BillsType[];
}

const countAllNodesExcludingFirst = (bills: BillsType[]): number => {
    console.log("countAllNodesExcludingFirst :", bills);

    // If there are no bills or the first bill has no children
    if (!bills || bills.length === 0 || !bills[0].node_child[0].children) {
        return 0;
    }

    // Function to recursively count children nodes
    const recursiveCount = (children: any[]): number => {
        // Base case: If there are no children, return 0
        if (!children || children.length === 0) return 0;

        // Count the current children and recurse into their children
        return children.reduce((count, child) => {
            // Count the child and recursively count its children
            return count + 1 + recursiveCount(child.children || []);
        }, 0);
    };

    // Start counting from the first bill's children, excluding the first node
    return recursiveCount(bills.flatMap(bill => bill.node_child.map(nc => nc.children).flat()));
};

const countNodesExcludingFirst = (nodes: DataNode[]): number => {
    if (!nodes[0].children) return 0;

    const recursiveCount = (children: DataNode[]): number => {
        return _.sumBy(children, (child) => 1 + recursiveCount(child.children || []));
    };

    return recursiveCount(nodes[0].children);
};

const countAllInVisulPeriodNodes = (bills: BillsType[]): number => {
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

    // Start by counting all nodes in each `node_child` array
    return bills.reduce((totalCount, bill) => {
        let { _id, node_child } = bill
        
        const nodeCount = countInVisulPeriodNodes(node_child);

        console.log("countInRealPeriod @1 :", _id, nodeCount )
        return totalCount + nodeCount;
    }, 0);
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


const countAllInRealPeriodNodes = (bills: BillsType[]): number => {
    const countInRealPeriodNodes = (nodes: DataNode[]): number => {
        // console.log("@ countInRealPeriodNodes :", nodes)
        let count = 0;
        nodes?.forEach((node) => {
            if (node.node?.inRealPeriod) {
                count++;
            }
            count += countInRealPeriodNodes(node.children);
        });
        return count;
    };

    // Start by counting all nodes in each `node_child` array
    return bills.reduce((totalCount, bill) => {
        let { _id, node_child } = bill
        
        const nodeCount = countInRealPeriodNodes(node_child);

        console.log("countInRealPeriod @1 :", _id, nodeCount )
        return totalCount + nodeCount;
    }, 0);
};

const countInRealPeriodNodes = (nodes: DataNode[]): number => {
    // console.log("@ countInRealPeriodNodes :", nodes)
    let count = 0;
    nodes?.forEach((node) => {
        if (node.node?.inRealPeriod) {
            count++;
        }
        count += countInRealPeriodNodes(node.children);
    });
    return count;
};

const getFormattedDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
  
    // Format: YYYY-MM-DD_HH-MM-SS
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
};

const WalletCalculate: React.FC = (props) => {
    const location = useLocation();
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [periods, setPeriods] = useState<any[]>([]);
    const [selectedPeriod, setSelectedPeriod] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [billsLoading, setBillsLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [nodeId, setNodeId] = useState("");
    const [pageSize, setPageSize] = useState(20); // State for page size
    const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
    const [currentPageMap, setCurrentPageMap] = useState<{ [key: string]: number }>({});
    const [groupPageSizes, setGroupPageSizes] = useState<{ [key: string]: number }>({}); // Store pageSize for each group


    const [onBillsXml2js] = useMutation(mutation_bills_xml2js, {
        context: { headers: getHeaders(location) },
        update: (cache, { data: { bills_xml2js } }) => {
            console.log("bills_xml2js:", bills_xml2js);

            let { status, data } = bills_xml2js
            if(status){
                const blob = new Blob([data], { type: 'application/xml' });
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `bills_${getFormattedDateTime()}.xml`; // Filename
                link.click();
            }
        },
        onCompleted: (data) => {
          setDownloadLoading(false);
        },
        onError: (error) => {
          setDownloadLoading(false); 
          handlerError(props, error);
        }
    });

    const [onBills] = useMutation(mutation_bills, {
        context: { headers: getHeaders(location) },
        update: (cache, { data: { bills } }) => {
            console.log("bills:", bills);

            let { status, data } = bills
            if(status){
                setFilteredData(data)
            }
        },
        onCompleted: (data) => {
            setBillsLoading(false)
        },
        onError: (error) => {
            setBillsLoading(false)
            handlerError(props, error);
        }
    });

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

    // const { loading: loadingBills, data: dataBills, error: errorBills, refetch: refetchBills } = useQuery(query_bills, {
    //     context: { headers: getHeaders(location) },
    //     fetchPolicy: 'cache-first',
    //     nextFetchPolicy: 'network-only',
    // });

    // if (errorBills) {
    //     handlerError(props, errorBills);
    // }

    // useEffect(() => {
    //     if (!loadingBills && dataBills?.bills?.status) {
    //         // setFilteredData(dataBills.bills.data);
    //         // if (loading) {
    //         //     message.success('Balance refreshed!');
    //         //     setLoading(false);
    //         // }
    //     }
    // }, [dataBills, loadingBills]);

    const handlePeriodChange = (value: string[]) => {
        console.log("Selected periods:", value);
        setSelectedPeriod(value); // Directly store the array of selected periods
    };

    const columns = [
        {
            title: 'Node ID',
            dataIndex: '_id',
            key: '_id',
            render: (text: string) => <Paragraph copyable>{text}</Paragraph>,
        },
        {
            title: 'ยอดทั้งหมด เสมือนจ่ายจริง',
            dataIndex: 'node_child',
            key: 'node_child',
            render: (children: DataNode[]) => {
                let nodesExcludingFirst = countNodesExcludingFirst(children)
                return <Tag color="gray"> { nodesExcludingFirst } x 20 = { nodesExcludingFirst * 20 } </Tag>
            },
        },
        {
            title: 'ยอดเสมือนจ่ายจริง',
            // dataIndex: 'node_child',
            key: 'visualPeriod',
            render: (value: any) => {
                let { _id, node_child } = value
                let inVisulPeriodNodes = countInVisulPeriodNodes(node_child)
                console.log("ยอดเสมือนจ่ายจริง :", _id, inVisulPeriodNodes)
                return <Tag color="gray"> { inVisulPeriodNodes } x 20 = { inVisulPeriodNodes * 20} </Tag>
            },
        },
        {
            title: 'ยอดจ่ายจริง',
            dataIndex: 'node_child',
            key: 'realPeriod',
            render: (children: DataNode[]) => {
                let inRealPeriodNodes = countInRealPeriodNodes(children)
                return <Tag color="green"> { inRealPeriodNodes } x 20 = { inRealPeriodNodes * 20} </Tag>
            },
        },
        // {
        //     title: 'Last Update',
        //     dataIndex: 'updatedAt',
        //     key: 'updatedAt',
        //     render: (text: any) => moment(new Date(text)).format('MMMM Do YYYY, h:mm:ss a'),
        // },
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
                {/* <Button
                    type="default"
                    style={{ marginRight: '10px' }}
                    // loading={loading}
                    icon={<ReloadOutlined />}
                    onClick={() => {
                        
                    }}
                /> */}
                </>
                
            ),
        },
    ];

    // Handle expand/collapse for groups
    const toggleGroupExpand = (group: string) => {
        if (expandedGroups.includes(group)) {
            setExpandedGroups(expandedGroups.filter((g) => g !== group));
        } else {
            setExpandedGroups([...expandedGroups, group]);
        }
    };

    const handlePageSizeChange = (groupId: string, size: number) => {
        setGroupPageSizes((prevSizes) => ({
            ...prevSizes,
            [groupId]: size, // Update the page size for the specific group
        }));
    };

    return (
        <div>
            <div style={{ padding: '10px' }}>
                <Select
                    mode="multiple" // Enable multi-select
                    placeholder="Select periods"
                    style={{ width: 250, marginRight: '10px' }}
                    value={selectedPeriod} // Use the selectedPeriod array directly
                    onChange={handlePeriodChange}>
                    {periods.map((period: any) => (
                        <Option key={period._id} value={period._id}>
                            {moment(period.start).format('MMM Do YY')} - {moment(period.end).format('MMM Do YY')}
                        </Option>
                    ))}
                </Select>
                <Button
                    type="default"
                    style={{ marginRight: '10px' }}
                    loading={billsLoading}
                    icon={<SearchOutlined />}
                    disabled={ _.isEmpty(selectedPeriod) ? true: false }
                    onClick={() => {
                        // setLoading(true);
                        // refetchBills();

                        setBillsLoading(true)
                        onBills({ variables: { input: { periods: selectedPeriod } } });

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

                        onBillsXml2js({ variables: { input: { periods: selectedPeriod } } });
                    }}
                />
            </div>
            <div style={{marginTop: '10px', marginBottom: '10px'}}>
                <div>All Period: <Tag>{ filteredData.length }</Tag></div>
            </div>
            <>
                {filteredData.map((groupData) => (
                    <div key={groupData.period._id} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #f0f0f0', borderRadius: '5px' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <h3 style={{ margin: 0, paddingBottom: '10px' }}>
                        {`Period: ${moment(new Date(groupData.period.start)).format('MMMM Do YYYY')} - ${moment(new Date(groupData.period.end)).format('MMMM Do YYYY')} (${groupData.bills.length} node )`}
                        </h3>
                        
                        <div style={{ color: '#1890ff' }}>ยอดทั้งหมด เสมือนจ่ายจริง: { countAllNodesExcludingFirst(groupData.bills) } x 20 = { new Intl.NumberFormat('th-TH').format(countAllNodesExcludingFirst(groupData.bills) * 20) }</div>
                        <div style={{ color: '#1890ff' }}>ยอดเสมือนจ่ายจริง: { countAllInVisulPeriodNodes(groupData.bills) } x 20 = { new Intl.NumberFormat('th-TH').format(countAllInVisulPeriodNodes(groupData.bills) * 20) } </div>
                        <div style={{ color: '#1890ff' }}>ยอดจ่ายจริง: { countAllInRealPeriodNodes(groupData.bills) } x 20 = { new Intl.NumberFormat('th-TH').format(countAllInRealPeriodNodes(groupData.bills) * 20) }</div>
                        <Button
                            type="primary"
                            style={{ paddingTop: '10px' }}
                            icon={!expandedGroups.includes(groupData.period._id) ? <CaretDownOutlined /> : <CaretUpOutlined />}
                            onClick={() => toggleGroupExpand(groupData.period._id)}>
                            {/* {!expandedGroups.includes(groupData.period._id) ? 'Expand' : 'Collapse'} */}
                        </Button>
                    </div>
                    {expandedGroups.includes(groupData.period._id) && (
                        <Table
                            columns={columns}
                            dataSource={groupData.bills}
                            pagination={{
                                pageSize: groupPageSizes[groupData.period._id] || 20,
                                current: currentPageMap[groupData.period._id] || 1,
                                total: groupData.bills.length,
                                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                                showSizeChanger: true,
                                pageSizeOptions: ['20', '50', '100'],
                                onShowSizeChange: (current, size) => {
                                    // setPageSize(size);
                                    handlePageSizeChange(groupData.period._id, size)
                                },
                                onChange: (page) => {
                                    setCurrentPageMap((prev) => ({ ...prev, [groupData.period._id]: page }));
                                },
                            }}
                            rowKey="_id"/>
                    )}
                    </div>
                ))}
            </>
            {visible && nodeId !== "" && <TreeModal node_id={nodeId} show={visible} onClose={() => setVisible(false)} />}
        </div>
    );

};

export default WalletCalculate;
