import React, { useEffect, useState } from 'react';
import { UsergroupAddOutlined, UserOutlined } from '@ant-design/icons';
import { Tree, TreeProps, Spin, Button } from 'antd';
import { useQuery } from "@apollo/client";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import _ from "lodash";
import moment from "moment";
import { DataNode as RcTreeDataNode } from 'rc-tree/lib/interface'; // This is the type from rc-tree

import { query_test_fetch_node } from "@/apollo/gqlQuery";
import { getHeaders } from "@/utils";
import handlerError from "@/utils/handlerError";

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
}

const TreePage: React.FC = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState<DataNode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]); // State to manage expanded nodes
  const { profile } = useSelector((state: any) => state.user);

  const { loading: loadingNode, data: dataNode, error: errorNode, refetch } = useQuery(
    query_test_fetch_node, {
      variables: { id: profile._id },
      context: { headers: getHeaders(location) },
      fetchPolicy: 'cache-first', 
      nextFetchPolicy: 'network-only', 
      notifyOnNetworkStatusChange: false,
    }
  );

  if(errorNode){
    handlerError(props, errorNode)
  }

  useEffect(() => {
    if (!loadingNode && dataNode?.test_fetch_node) {
      const fetchedData: DataNode[] = dataNode.test_fetch_node.data;
      setData(fetchedData);

      // Automatically expand the root nodes initially
      const rootKeys = fetchedData.map(node => node.key);
      setExpandedKeys(rootKeys);

      console.log("fetchedData :", fetchedData);
    }
  }, [dataNode, loadingNode]);

  useEffect(() => {
    refetch({ id: profile._id });
  }, [profile, refetch]);

  const onSelect = (selectedKeys: React.Key[], info: any) => {
    console.log('selected', selectedKeys, info);
  };

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue); // Update the expanded keys state
  };

  const expandAll = () => {
    const allKeys = getAllKeys(data); // Get all keys of the tree nodes
    setExpandedKeys(allKeys);
  };

  const collapseAll = () => {
    setExpandedKeys([]); // Collapse all nodes by setting an empty array
  };

  const getAllKeys = (nodes: DataNode[]): React.Key[] => {
    let keys: React.Key[] = [];
    nodes.forEach((node) => {
      keys.push(node.key);
      if (node.children) {
        keys = keys.concat(getAllKeys(node.children as DataNode[]));
      }
    });
    return keys;
  };

  const titleRender: TreeProps['titleRender'] = (nodeData: RcTreeDataNode) => {
    const customNodeData = nodeData as DataNode; // Type assertion
      
    // console.log("customNodeData :", customNodeData);
    const title  = customNodeData.title;
    const ownerDisplayName = customNodeData.owner?.current?.displayName || 'Unnamed';
    const nodeStatus = customNodeData.node?.current?.status === 1 ? 'green' : 'red';
    const nodeId = customNodeData.node?._id;
    const formattedDate = customNodeData.node?.updatedAt
      ? moment(new Date(customNodeData.node.updatedAt)).format('MMMM Do YYYY, h:mm:ss a')
      : '';
  
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {customNodeData?.children?.length ? <UsergroupAddOutlined /> : <UserOutlined />}
        <span style={{ marginLeft: 8 }}>
          <span style={{ color: nodeStatus }}>
          {ownerDisplayName} | {nodeId} | {formattedDate} | {title}
          </span>
        </span>
      </div>
    );
  };

  return (
    <div>
      <Button type="primary" onClick={() => navigate("/administrator/userlist/tree/orgchart")}>Visual Tree</Button>
      <Button onClick={expandAll} style={{ margin: '0 8px' }}>Expand All</Button>
      <Button onClick={collapseAll}>Collapse All</Button>

      {loadingNode ? (
        <Spin tip="Loading..." />
      ) : (
        <Tree
          showIcon={true}
          showLine={true}
          expandedKeys={expandedKeys}
          onExpand={onExpand}
          onSelect={onSelect}
          treeData={data}
          titleRender={titleRender}
        />
      )}
    </div>
  );
};

export default TreePage;