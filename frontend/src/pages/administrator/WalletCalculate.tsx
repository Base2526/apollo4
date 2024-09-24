import React, { useState, useEffect } from 'react';
import { Card, Button, Descriptions, Spin, Typography, Tag, message } from 'antd';
import moment from "moment";
import { useQuery, useMutation } from "@apollo/client";
import { useLocation, useNavigate } from "react-router-dom";
import _ from "lodash";
import { DataNode as RcTreeDataNode } from 'rc-tree/lib/interface';

import { useSelector } from 'react-redux';
import { query_bills, mutation_tree_by_node_id } from "@/apollo/gqlQuery";
import { getHeaders } from "@/utils";
import TreeModal from "@/pages/administrator/TreeModal";
import handlerError from "@/utils/handlerError";

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
      inRealPeriod?: boolean;
      inVisulPeriod?: boolean;
      updatedAt?: string;
    };
    children: DataNode[]
}

// const countNodes = (nodes: DataNode[]): number => {
//     return _.sumBy(nodes, (node) => {
//       return 1 + countNodes(node.children);
//     });
// };


// Recursive function to count nodes with inRealPeriod = true
const countInRealPeriodNodes = (nodes: DataNode[]): number => {
    let count = 0;
    nodes && nodes.forEach((node) => {
              // If the current node's inRealPeriod is true, increment the count
              if (node.node && node.node.inRealPeriod) {
                count++;
              }
              // Recursively count the children nodes
              count += countInRealPeriodNodes(node.children);
            });
  
    return count;
};

const countInVisulPeriodNodes = (nodes: DataNode[]): number => {
    let count = 0;
    nodes && nodes.forEach((node) => {
              // If the current node's inRealPeriod is true, increment the count
              if (node.node && node.node.inVisulPeriod) {
                count++;
              }
              // Recursively count the children nodes
              count += countInVisulPeriodNodes(node.children);
            });
  
    return count;
};

const countNodesExcludingFirst = (nodes: DataNode[]): number => {
    // Skip the first node and start counting from the children of the first node
    if (!nodes[0].children) return 0;
    
    const recursiveCount = (children: DataNode[]): number => {
      return _.sumBy(children, (child) => 1 + recursiveCount(child.children || []));
    };
  
    return recursiveCount(nodes[0].children);
};

const WalletCalculate: React.FC = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [filteredData, setFilteredData] = useState<DataType[]>([]);
    // const { profile } = useSelector((state: any) => state.user);

    const [loading, setLoading] = useState(false);


    const [visible, setVisible] = useState(false);
    // const [loadingRefresh, setLoadingRefresh] = useState(false); 
    const [nodeId, setNodeId] = useState("");

    // const [onTree_by_node_id] = useMutation(mutation_tree_by_node_id, {
    //     context: { headers: getHeaders(location) },
    //     update: (cache, { data: { tree_by_node_id } }) => {
    //         console.log("tree_by_node_id:", tree_by_node_id);
    //     },
    //     onCompleted: (data, clientOptions) => {
    //         let { variables: { input } } : any = clientOptions;
    //         if(input?.node_id){
    //             setLoadingItems(prev => ({ ...prev, [input?.node_id]: false }));
    //             message.success(`Balance refreshed !`)
    //         }
    //     },
    //     onError: (error, clientOptions) => {
    //         let { variables: { input } } : any = clientOptions;
    //         if(input?.node_id){
    //             setLoadingItems(prev => ({ ...prev, [input?.node_id]: false }));
    //         }
    //         handlerError(props, error)
    //     }
    // });

    const { loading: loadingBills, 
            data: dataBills, 
            error: errorBills,
            refetch: refetchBills } = useQuery(query_bills, {
                context: { headers: getHeaders(location) },
                fetchPolicy: 'cache-first', 
                nextFetchPolicy: 'network-only', 
                notifyOnNetworkStatusChange: false,
            });

    if(errorBills){
        handlerError(props, errorBills)
    }

    useEffect(() => {
        if (!loadingBills && dataBills?.bills?.status) {
            setFilteredData(dataBills.bills.data);

            console.log("dataBills.bills.data :", dataBills.bills.data)

            if(loading){
                message.success('Balance refreshed all!')
                setLoading(false)
            }
            
        }
    }, [dataBills, loadingBills]);

    return (
        <Spin spinning={loadingBills} tip="Loading..." size="large">
            <div style={{padding:"10px"}}>
                <Button 
                    type="default" 
                    style={{ marginRight: '10px' }}
                    loading={loading}
                    onClick={() => {
                        setLoading(true);
                        refetchBills();
                    }} >
                    Refresh All
                </Button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {filteredData.map((item) => (
                    <Card key={item._id} style={{ width: 400 }}>
                        <Descriptions column={1} bordered>
                            <Descriptions.Item label="ID"><Paragraph copyable>{item._id}</Paragraph></Descriptions.Item>
                            <Descriptions.Item label="Last update">
                                { moment(new Date(item.updatedAt)).format('MMMM Do YYYY, h:mm:ss a') }
                            </Descriptions.Item>
                            <Descriptions.Item label="Node children">
                                <Tag color={'green'}>
                                    { countNodesExcludingFirst(item.node_child) } 
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Period">
                                <Tag color={'gray'}>
                                    21st (00:00) to 27th (23:59)
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="ยอดทั้งหมดเสมือนจ่ายจริง">
                                <Tag color={'gray'}>
                                    { countNodesExcludingFirst(item.node_child) * 20 } 
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="ยอดเสมือนจ่ายจริงแต่ละ period">
                                <Tag color={'gray'}>
                                    { countInVisulPeriodNodes(item.node_child) * 20 }
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="ยอดจ่ายจริงแต่ละ period">
                                <Tag color={'green'}>
                                    { countInRealPeriodNodes(item.node_child) * 20 }
                                </Tag>
                            </Descriptions.Item>
                            {/* node_child */}
                            <Descriptions.Item>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Button
                                        type="primary"
                                        style={{marginBottom: 10}}
                                        onClick={() =>{
                                            setNodeId(item._id)
                                            setVisible(true)
                                        }}>
                                        View Tree
                                    </Button>
                                    {/* <Button 
                                        type="default" 
                                        style={{ marginRight: '10px' }}
                                        loading={loadingItems[item._id]} 
                                        onClick={() =>{
                                            setLoadingItems(prev => ({ ...prev, [item._id]: true }));
                                            onTree_by_node_id({ variables: { input: { node_id: item._id }  } });
                                            
                                            //
                                        }}>
                                        Refresh
                                    </Button> */}
                                </div>
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
