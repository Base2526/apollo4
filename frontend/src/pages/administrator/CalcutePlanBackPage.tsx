import React, { useState, useEffect } from 'react';
import { Select, Button, message, Tree, TreeProps, } from 'antd';
import { useQuery, useMutation } from "@apollo/client";
import _ from "lodash";
import moment from "moment";
import { DataNode as RcTreeDataNode } from 'rc-tree/lib/interface'; 
import {  UsergroupAddOutlined, 
  UserOutlined, 
  ReloadOutlined, 
  NodeExpandOutlined, 
  NodeCollapseOutlined } from '@ant-design/icons';

import { query_members, mutation_calcute_plan_back } from "@/apollo/gqlQuery";
import { getHeaders } from "@/utils";

import handlerError from '@/utils/handlerError';

const { Option } = Select;

interface MonthRange {
  month: string;
  startDate: Date;
  endDate: Date;
}

const getMonthsInRange = (startYear: number, endYear: number): MonthRange[] => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const dateRanges: MonthRange[] = [];
  for (let year = startYear; year <= endYear; year++) {
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);
      dateRanges.push({
        month: `${months[month]} ${year}`,
        startDate,
        endDate,
      });
    }
  }
  return dateRanges;
};

interface DataNode extends RcTreeDataNode {
  title: string;
  level: number
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
  children: [];
}

const countNodes = (nodes: DataNode[]): number => {
  return _.sumBy(nodes, (node) => {
    return 1 + countNodes(node.children);
  });
};

interface LockAccount {
  lock: boolean;
  date: string;
}

interface OwnerCurrent {
  lockAccount: LockAccount;
  parentId: string;
  packages: number;
  roles: number[];
  isActive: number;
  position: string;
  positionId: string;
  positionIds: [
    {
      version: number,
      positionId: string,
      updatedAt: string
    }
  ];
  username: string;
  idCard: string;
  email: string;
  tel: string;
  password: string;
  displayName: string;
  lastAccess: string;
}

interface Owner {
  current: OwnerCurrent;
  _id: string;
  history: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface NodeCurrent {
  parentNodeId: string;
  isParent: boolean;
  status: number;
  suggester: string | null;
  node_children: any[];
  updatedAt: string | null;
  ownerId: string;
  number: number;
}

interface Node {
  current: NodeCurrent;
  _id: string;
  history: any[];
  __v: number;
  createdAt: string;
  updatedAt: string;
}

interface Child {
  title: string;
  key: string;
  node: Node;
  ownerId: string;
  owner: Owner;
  level: number;
  children: Child[] | null;
}

interface TreeNode {
  title: string;
  key: string;
  node: Node;
  ownerId: string;
  owner: Owner;
  level: number;
  children: Child[] | null;
}


const flattenTreeUnique = (
  nodes: TreeNode[]
): { key: string; ownerId: string }[] => {
  const result: { key: string; ownerId: string }[] = [];
  const nameSet = new Set<string>(); // To track unique names

  const traverse = (nodes: TreeNode[]) => {
    nodes.forEach((node) => {
      if (!nameSet.has(node.ownerId)) {
        nameSet.add(node.ownerId);
        result.push({ key: node.key, ownerId: node.ownerId });
      }
      if (node.children) {
        traverse(node.children);
      }
    });
  };

  traverse(nodes);
  return result;
};


const CalcutePlanBackPage: React.FC = (props) => {
  const [startYear, setStartYear] = useState<number>(2024);
  const [endYear, setEndYear] = useState<number>(2027);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [monthRanges, setMonthRanges] = useState<MonthRange[]>(getMonthsInRange(2024, 2027));
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<any[]>();

  const [data, setData] = useState<DataNode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  const [onCalcutePlanBack] = useMutation(mutation_calcute_plan_back, {
    context: { headers: getHeaders(location) },
    update: (cache, { data: { calcute_plan_back } }) => {
      console.log("calcute_plan_back :", calcute_plan_back);

      let { status, data} = calcute_plan_back;
      if(status){
        // setData(data)
        // const result = flattenTreeUnique(data);

        console.log("data :", data)
        // console.log("output 2 :", JSON.stringify(result, null, 2))
      }

      setLoading(false)
    },
    onCompleted(data) {
      // console.log("calcute_plan_back onCompleted :", data);
      // let { status } = data.profile
      // if(status){
      //   message.success('Update profile success!');
      // }

      setLoading(false);
    },
    onError(error) {
      console.log("calcute_plan_back onError :", error);

      setLoading(false);
      handlerError(props, error)
    }
  });

  const { loading: loadingMembers, 
    data: dataMembers, 
    error: errorMembers  } =  useQuery( query_members, 
                                        {
                                          context: { headers: getHeaders(location) },
                                          fetchPolicy: 'cache-first', 
                                          nextFetchPolicy: 'network-only', 
                                          notifyOnNetworkStatusChange: false,
                                        });

  useEffect(() => {
    if(!loadingMembers){
      if(!_.isEmpty(dataMembers?.members)){
        setUsers([])
        if(dataMembers.members.status){
          console.log("dataMembers.members.data :", dataMembers.members.data)
          _.map(dataMembers.members.data, (e, key)=>{
            setUsers((prevItems) => Array.isArray(prevItems) ? [...prevItems, e] : [e]);
          })
        }
      }
    }
  }, [dataMembers, loadingMembers])

  const handleYearChange = (yearType: 'start' | 'end', value: number) => {
    if (yearType === 'start') setStartYear(value);
    else setEndYear(value);

    const updatedRanges = getMonthsInRange(
      yearType === 'start' ? value : startYear,
      yearType === 'end' ? value : endYear
    );
    setMonthRanges(updatedRanges);
  };

  const handleSubmit = () => {
    if (!selectedMonth) {
      message.warning('Please select a month.');
      return;
    }

    const selectedRange = monthRanges.find((range) => range.month === selectedMonth);
    if (selectedRange) {
      const { startDate, endDate } = selectedRange;
      
      // Display or use the start and end dates as needed
      console.log(`Selected start date: ${startDate}`);
      console.log(`Selected end date: ${endDate}`);

      setLoading(true)
      onCalcutePlanBack({ variables: { input: { startDate, endDate,  userId: selectedUser } } });
    
    }
    // message.success(`Selected month: ${selectedMonth}, Year range: ${startYear}-${endYear}, User: ${selectedUser}`);
  };

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
          {ownerDisplayName} | {nodeId} { /* | {formattedDate} | {title} */ } | { customNodeData.level }
          </span>
        </span>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Select 
        placeholder="Select month" 
        style={{ width: 200 }} 
        onChange={(value) => setSelectedMonth(value)}
      >
        {monthRanges.map((range) => (
          <Option key={range.month} value={range.month}>
            {range.month}
          </Option>
        ))}
      </Select>

      { 
      users && 
      <Select 
        placeholder="Select User" 
        style={{ width: 200 }} 
        onChange={(value) => setSelectedUser(value)}
      >
        {users.sort((a, b) =>a.current.displayName.localeCompare(b.current.displayName) ).map((user) => (
          <Option key={user._id} value={user._id}>
            {user?.current?.displayName}
          </Option>
        ))}
      </Select>
      }
      
      <Button 
        type="primary" 
        style={{ width: 200 }} 
        disabled={!selectedMonth || !selectedUser} 
        onClick={handleSubmit}
        loading={loading}>
        คำนวณรายได้
      </Button>

      <Tree
        showIcon={true}
        showLine={true}
        expandedKeys={expandedKeys}
        onExpand={onExpand}
        onSelect={onSelect}
        treeData={data}
        titleRender={titleRender}
      />
    </div>
  );
};

export default CalcutePlanBackPage;