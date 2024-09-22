import React, { useState, useEffect } from 'react';
import { Card, Button, Descriptions, Spin, Typography, Tag, message } from 'antd';
import moment from "moment";
import { useQuery } from "@apollo/client";
import { useLocation, useNavigate } from "react-router-dom";
import _ from "lodash";
import { DataNode as RcTreeDataNode } from 'rc-tree/lib/interface';

import { useSelector } from 'react-redux';
import { query_bills } from "@/apollo/gqlQuery";
import { getHeaders } from "@/utils";
import TreeModal from "@/pages/administrator/TreeModal";
const { Paragraph } = Typography;

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
      updatedAt?: string;
    };
    children: DataNode[]
}

const countNodes = (nodes: DataNode[]): number => {
    return _.sumBy(nodes, (node) => {
      return 1 + countNodes(node.children);
    });
};

const WalletCalculate: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [filteredData, setFilteredData] = useState<DataType[]>([]);
    // const { profile } = useSelector((state: any) => state.user);

    const [visible, setVisible] = useState(false);
    // const [loadingRefresh, setLoadingRefresh] = useState(false); 
    const [nodeId, setNodeId] = useState("");

    const { loading: loadingBills, 
            data: dataBills, 
            error: errorBills,
            refetch: refetchBills } = useQuery(query_bills, {
                context: { headers: getHeaders(location) },
                fetchPolicy: 'cache-first', 
                nextFetchPolicy: 'network-only', 
                notifyOnNetworkStatusChange: false,
            });

    useEffect(() => {
        if (!loadingBills && dataBills?.bills?.status) {
            setFilteredData(dataBills.bills.data);

            console.log("dataBills.bills.data :", dataBills.bills.data)
        }
    }, [dataBills, loadingBills]);

    return (
        <Spin spinning={loadingBills} tip="Loading..." size="large">
            <div style={{padding:"10px"}}>
                <Button 
                    type="default" 
                    style={{ marginRight: '10px' }}
                    onClick={() => message.success('Balance refreshed all!')} >
                    Refresh All
                </Button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {filteredData.map((item) => (
                    <Card key={item._id} style={{ width: 300 }}>
                        <Descriptions column={1} bordered>
                            <Descriptions.Item label="ID"><Paragraph copyable>{item._id}</Paragraph></Descriptions.Item>
                            <Descriptions.Item label="Last update">
                                {moment(new Date(item.updatedAt)).format('MMMM Do YYYY, h:mm:ss a')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Node children">
                                <Tag color={'green'}>
                                    {countNodes(item.node_child)}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Amount">
                                <Tag color={'green'}>
                                    100
                                </Tag>
                            </Descriptions.Item>
                            {/* node_child */}
                            <Descriptions.Item>
                                <Button
                                    type="primary"
                                    onClick={() =>{
                                        setNodeId(item._id)
                                        setVisible(true)
                                    }}>
                                    View Tree
                                </Button>
                                <Button 
                                    type="default" 
                                    style={{ marginRight: '10px' }}
                                    onClick={() =>{

                                        // message.success('Balance refreshed!')
                                    }}>
                                    Refresh
                                </Button>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                ))}
            </div>
            {visible && nodeId !== "" && <TreeModal node_id={nodeId} show={visible} onClose={() => setVisible(false)} />}
        </Spin>
    );
};

export default WalletCalculate;
