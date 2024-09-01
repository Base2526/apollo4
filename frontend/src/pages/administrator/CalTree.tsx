// src/UserForm.tsx
import React, { useState, useEffect } from 'react';
import {  Input, Upload, Button, Select,  
          message, GetProp, UploadProps,
          Card, Descriptions } from 'antd';
import moment from 'moment';
import { UploadOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { RcFile, UploadChangeParam } from 'antd/es/upload/interface';
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from 'react-router-dom';

import { mutation_calculate_tree } from "../../apollo/gqlQuery"
import { getHeaders } from "../../utils"

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const { Option } = Select;

interface UserTypes {
  username: string;
  password: string;
  email: string;
  displayName: string;
  roles: number[];
  isActive: number; // 0: FALSE, 1: TRUE
  avatar?: {
    url: string;
    filename: string;
    mimetype: string;
    encoding: string;
  };
  lockAccount: {
    lock: boolean;
    date: Date;
  };
  lastAccess: Date;
}

const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const CalTree: React.FC = () => {
  const navigate = useNavigate();
  

  const [user, setUser] = useState<UserTypes>({
      username: '',
      password: '',
      email: '',
      displayName: '',
      roles: [0], // Default role
      isActive: 0,
      lockAccount: {
      lock: false,
      date: new Date(),
      },
      lastAccess: new Date(),
  });

  const [mode, setMode] = useState<'view' | 'edit'>('view'); // Set default mode to view
  const [avatar, setAvatar] = useState<File | null>(null); // State for uploaded avatar

  const [imageUrl, setImageUrl] = useState<string>("https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/698.jpg");
  const [loading, setLoading] = useState(false);

  const [onMutationCalTree, resultCalTree] = useMutation(mutation_calculate_tree, {
      context: { headers: getHeaders(location) },
      update: (cache, {data: {calculate_tree}}) => {
        console.log("calculate_tree :", calculate_tree);

        message.success('RUN successfully!');
        setLoading(false);
      },
      onError(error){
        console.log("onError :", error);

        setLoading(false);
      }
  });

  
  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

//   const handleFileChange = (info: UploadChangeParam<RcFile>) => {
//     if (info.file.status === 'done') {
//       setUser({
//         ...user,
//         avatar: {
//           url: info.file.response.url, // Assume the server returns a URL
//           filename: info.file.name,
//           mimetype: info.file.type,
//           encoding: info.file.encoding,
//         },
//       });
//     }
//   };
  const handleFileChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
    //   setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, (url) => {
        // setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSelectChange = (value: number[]) => {
    setUser({ ...user, roles: value });
  };

  const handleSwitchChange = (checked: boolean) => {
    setUser({ ...user, lockAccount: { ...user.lockAccount, lock: checked } });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(user);
    // Here you would usually send the user data to your backend
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  
  return (
    <div style={{ padding: '3px' }}>
    <Card>
      <Descriptions title="Cal Tree Information" bordered column={1} style={{ marginTop: '10px' }}>
        <Descriptions.Item label="Manual Run">
          <Button 
            type="primary" 
            style={{ marginRight: '10px' }}
            loading={loading}
            onClick={()=>{ 
              setLoading(true);
              onMutationCalTree();
            }}>RUN</Button>
        </Descriptions.Item>
        <Descriptions.Item label="History(Execution)">
          <Button 
            type="primary" 
            style={{ marginRight: '10px' }}
            onClick={()=>{
              navigate('/administrator/caltree/caltreehistorylist')
            }}>Show History</Button>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  </div>
  );
};

export default CalTree;