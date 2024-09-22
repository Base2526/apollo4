import React, { useState, useEffect } from 'react';
import { Modal, Tree, Spin, Button, message } from 'antd';
import { ExpandAltOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import { useQuery } from "@apollo/client";
import { DataNode as RcTreeDataNode } from 'rc-tree/lib/interface';
import _ from "lodash"

import { query_test_fetch_tree_by_node_id } from "@/apollo/gqlQuery";
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
  children: DataNode[]
}

interface TreeModalProps {
  node_id: string;
  show: boolean;
  onClose: () => void;
}

const countNodes = (nodes: DataNode[]): number => {
  return _.sumBy(nodes, (node) => {
    return 1 + countNodes(node.children);
  });
};

const TreeModal: React.FC<TreeModalProps> = (props) => {
  const { node_id, show, onClose } = props;

  const [visible, setVisible] = useState(show);
  const [data, setData] = useState<DataNode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  const [isAllExpanded, setAllExpanded] = useState(false);

  const { 
    loading: loadingTrees, 
    data: dataTrees, 
    error: errorTrees,
    refetch: refetchTrees 
  } = useQuery(query_test_fetch_tree_by_node_id, {
    context: { headers: getHeaders(location) },
    fetchPolicy: 'cache-first', 
    nextFetchPolicy: 'network-only', 
    notifyOnNetworkStatusChange: false,
  });

  if (errorTrees) {
    handlerError({}, errorTrees);
  }

  useEffect(() => {
    refetchTrees({ node_id });
  }, [node_id]);

  useEffect(() => {
    if (!loadingTrees && dataTrees?.test_fetch_tree_by_node_id?.status) {
      const fetchedData: DataNode[] = dataTrees.test_fetch_tree_by_node_id.data;
      setData(fetchedData);

      console.log("TreeModal :", fetchedData, countNodes(fetchedData))
    }
  }, [dataTrees, loadingTrees]);

  const handleOk = () => {
    onClose();
  };

  const handleCancel = () => {
    onClose();
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

  const handleExpandAll = () => {
    const allKeys = getAllKeys(data); // Get all keys of the tree nodes
    const keys = data.map(node => node.key); // Adjust if your nodes have a different key structure
    setExpandedKeys(allKeys);

    setAllExpanded(true);
  };

  const handleCollapseAll = () => {
    setAllExpanded(false);
    setExpandedKeys([]);
  };

  return (
    <Modal title={`Tree Structure (${ countNodes(data) })`} visible={visible} onOk={handleOk} onCancel={handleCancel}>
      {
        countNodes(data) > 5 
        && <div style={{ marginBottom: 16 }}>
          <Button 
            onClick={isAllExpanded ? handleCollapseAll : handleExpandAll} 
            style={{ marginRight: 8 }}
            icon={isAllExpanded ? <FullscreenExitOutlined /> : <ExpandAltOutlined />}>
          </Button>
        </div>
      }
      
      <Spin spinning={loadingTrees}>
        <Tree 
          showIcon={true}
          showLine={true}
          treeData={data}
          expandedKeys={expandedKeys} // Use the state to control expanded nodes
          onExpand={setExpandedKeys} // Update state when nodes are expanded/collapsed
        />
      </Spin>
    </Modal>
  );
};

export default TreeModal;