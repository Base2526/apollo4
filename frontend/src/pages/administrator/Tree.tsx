import React, { useEffect, useState } from 'react';
import { UsergroupAddOutlined, UserOutlined } from '@ant-design/icons';
import { Tree, TreeProps, Spin, Button } from 'antd';
import { useQuery } from "@apollo/client";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import _ from "lodash";
import moment from "moment";
import { DataNode as RcTreeDataNode } from 'rc-tree/lib/interface'; // This is the type from rc-tree

import { querytest_fetch_node } from "@/apollo/gqlQuery";
import { getHeaders } from "@/utils";

interface DataNode extends RcTreeDataNode {
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

const TreePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState<DataNode[]>([]);
  const { profile } = useSelector((state: any) => state.user);

  const { loading: loadingNode, data: dataNode, refetch } = useQuery(
    querytest_fetch_node, {
      variables: { id: profile._id },
      context: { headers: getHeaders(location) },
      fetchPolicy: 'cache-first', 
      nextFetchPolicy: 'network-only', 
      notifyOnNetworkStatusChange: false,
    }
  );

  useEffect(() => {
    if (!loadingNode && dataNode?.test_fetch_node) {
      const fetchedData: DataNode[] = dataNode.test_fetch_node.data;
      setData(fetchedData);

      console.log("fetchedData :", fetchedData)
    }
  }, [dataNode, loadingNode]);

  useEffect(() => {
    refetch({ id: profile._id });
  }, [profile, refetch]);

  const onSelect = (selectedKeys: React.Key[], info: any) => {
    console.log('selected', selectedKeys, info);
  };

  const titleRender: TreeProps['titleRender'] = (nodeData: RcTreeDataNode) => {
    const customNodeData = nodeData as DataNode; // Type assertion
      
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
            {ownerDisplayName} | {nodeId} | {formattedDate}
          </span>
        </span>
      </div>
    );
  };

  return (
    <div>
      <Button type="primary" onClick={()=>navigate("/administrator/userlist/tree/orgchart")}>Visual Tree</Button>
      {loadingNode ? (
        <Spin tip="Loading..." />
      ) : (
        <Tree
          showIcon={true}
          showLine={true}
          defaultExpandedKeys={['0-0-0']}
          onSelect={onSelect}
          treeData={data}
          titleRender={titleRender}
        />
      )}
    </div>
  );
};

export default TreePage;
