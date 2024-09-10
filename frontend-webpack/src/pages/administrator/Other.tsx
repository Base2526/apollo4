import React, { useState, useEffect } from 'react';
import { Button, Modal, Card, Tree } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';

const Other: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  const generateTreeData = (obj: any, parentKey = ''): DataNode[] => {
    return Object.keys(obj).map((key, index) => {
      const currentKey = parentKey ? `${parentKey}-${index}` : `${index}`;
      const item = obj[key];
      
      if (typeof item === 'object' && !Array.isArray(item)) {
        return {
          title: key,
          key: currentKey,
          children: generateTreeData(item, currentKey),
        };
      } else {
        return {
          title: `${key}: ${JSON.stringify(item)}`,
          key: currentKey,
          isLeaf: true,
        };
      }
    });
  };

  const treeData = generateTreeData(process.env);

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Show .env
      </Button>
      <Modal title=".env" visible={isModalVisible} onCancel={handleClose} footer={null}>
        <Card>
          <Tree
            showLine
            switcherIcon={<DownOutlined />}
            treeData={treeData}
            defaultExpandAll
          />
        </Card>
      </Modal>
    </div>
  );
};

export default Other;
