import React, { useState, useEffect } from 'react';
import { Button, Modal, Card, Tree } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';
import { useNavigate } from 'react-router-dom';

const Other: React.FC = () => {
  const navigate = useNavigate();
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

  const modalView = () =>{
    return  <Modal title=".env" visible={isModalVisible} onCancel={handleClose} footer={null}>
              <Card>
                <Tree
                  showLine
                  switcherIcon={<DownOutlined />}
                  treeData={treeData}
                  defaultExpandAll
                />
              </Card>
            </Modal>
  }

  return (
    <div>
      { modalView() }
      <Button type="primary" onClick={showModal}>
        Show .env
      </Button>

      <Button 
        type="primary" 
        style={{ marginRight: '10px' }}
        onClick={()=>{
          navigate('/administrator/calcuteplanback')
        }}>คำนวณผลประโยชน์แผนหลัง</Button>

      <Button 
        type="primary" 
        style={{ marginRight: '10px' }}
        onClick={()=>{
          navigate('/administrator/recheck')
        }}>Recheck ยอดรวมทั้งหมด</Button>
    </div>
  );
};

export default Other;
