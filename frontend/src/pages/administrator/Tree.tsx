import React, { useEffect, useState } from 'react';
import { CarryOutOutlined, FormOutlined, UsergroupAddOutlined, UserOutlined } from '@ant-design/icons';
import { Tree, TreeProps, Spin } from 'antd';
import type { TreeDataNode } from 'antd';
import { useQuery } from "@apollo/client";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import _ from "lodash";
import moment from "moment";

// import { TreeProps } from 'antd'; // Assuming you're using antd's Tree component
import { DataNode as RcTreeDataNode } from 'rc-tree/lib/interface'; // This is the type from rc-tree


import { querytest_fetch_node } from "../../apollo/gqlQuery";
import { getHeaders } from "../../utils";

const treeData: TreeDataNode[] = [
  {
    title: <span style={{ color: 'blue' }}>parent 1</span>,
    key: '0-0',
    icon: <span style={{ color: 'red' }}><CarryOutOutlined /></span>,
    children: [
      {
        title: <span style={{ color: 'green' }}>parent 1-0</span>,
        key: '0-0-0',
        icon: <span style={{ color: 'purple' }}><CarryOutOutlined /></span>,
        children: [
          { 
            title: <span style={{ color: 'orange' }}>leaf</span>, 
            key: '0-0-0-0', 
            icon: <span style={{ color: 'yellow' }}><CarryOutOutlined /></span> 
          },
          {
            title: (
              <>
                <div style={{ color: 'brown' }}>multiple line title</div>
                <div style={{ color: 'pink' }}>multiple line title</div>
              </>
            ),
            key: '0-0-0-1',
            icon: <span style={{ color: 'cyan' }}><CarryOutOutlined /></span>,
          },
          { 
            title: <span style={{ color: 'teal' }}>leaf</span>, 
            key: '0-0-0-2', 
            icon: <span style={{ color: 'magenta' }}><CarryOutOutlined /></span> 
          },
        ],
      },
      {
        title: <span style={{ color: 'gray' }}>parent 1-1</span>,
        key: '0-0-1',
        icon: <span style={{ color: 'lime' }}><CarryOutOutlined /></span>,
        children: [{ 
          title: <span style={{ color: 'maroon' }}>leaf</span>, 
          key: '0-0-1-0', 
          icon: <span style={{ color: 'navy' }}><CarryOutOutlined /></span> 
        }],
      },
      {
        title: <span style={{ color: 'olive' }}>parent 1-2</span>,
        key: '0-0-2',
        icon: <span style={{ color: 'coral' }}><CarryOutOutlined /></span>,
        children: [
          { 
            title: <span style={{ color: 'violet' }}>leaf</span>, 
            key: '0-0-2-0', 
            icon: <span style={{ color: 'gold' }}><CarryOutOutlined /></span> 
          },
          {
            title: <span style={{ color: 'indigo' }}>leaf</span>,
            key: '0-0-2-1',
            icon: <span style={{ color: 'chocolate' }}><CarryOutOutlined /></span>,
            switcherIcon: <span style={{ color: 'crimson' }}><FormOutlined /></span>,
          },
        ],
      },
    ],
  },
  {
    title: <span style={{ color: 'black' }}>parent 2</span>,
    key: '0-1',
    icon: <span style={{ color: 'silver' }}><CarryOutOutlined /></span>,
    children: [
      {
        title: <span style={{ color: 'darkred' }}>parent 2-0</span>,
        key: '0-1-0',
        icon: <span style={{ color: 'darkblue' }}><CarryOutOutlined /></span>,
        children: [
          { 
            title: <span style={{ color: 'darkgreen' }}>leaf</span>, 
            key: '0-1-0-0', 
            icon: <span style={{ color: 'darkorange' }}><CarryOutOutlined /></span> 
          },
          { 
            title: <span style={{ color: 'darkpurple' }}>leaf</span>, 
            key: '0-1-0-1', 
            icon: <span style={{ color: 'darkcyan' }}><CarryOutOutlined /></span> 
          },
        ],
      },
    ],
  },
];

// Ensure your custom DataNode is compatible with RcTreeDataNode
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

interface TreeNode {
  title: string;
  key: string;
  icon?: React.ReactNode;
  children?: TreeNode[];
}

const TreePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState<TreeDataNode[]>([]);
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
      const fetchedData: TreeDataNode[] = dataNode.test_fetch_node.data;
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

  // const titleRender: TreeProps['titleRender'] = (nodeData: DataNode) => {
  //   console.log("nodeData :", nodeData)
  //   // <UserOutlined />
  //   let { owner } = nodeData
  //   return  <div style={{ display: 'flex', alignItems: 'center' }}>
  //             {/* {nodeData?.children?.length > 0 ? <UsergroupAddOutlined /> :<UserOutlined />} */}
  //             {nodeData?.children?.length ? <UsergroupAddOutlined /> : <UserOutlined />}
  //             <span style={{ marginLeft: 8 }}>
  //             {/* {owner?.current?.displayName || 'Unnamed'} */}
  //             {/* {nodeData.title} */}
  //             <span style={{ color: nodeData?.node.current.status === 1 ? 'green' : 'red' }}>{nodeData?.owner?.current?.displayName || 'Unnamed'} | {nodeData?.node?._id} |  {moment(new Date(nodeData?.node.updatedAt)).format('MMMM Do YYYY, h:mm:ss a')}</span>
  //             </span>
  //           </div>
  // }

  const titleRender: TreeProps['titleRender'] = (nodeData: RcTreeDataNode) => {
    const customNodeData = nodeData as DataNode; // Type assertion
    
    console.log("customNodeData :", customNodeData);
  
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
    
  // 

  return (
    <div>
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
