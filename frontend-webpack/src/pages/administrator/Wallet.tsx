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

import { mutationProfile } from "../../apollo/gqlQuery"
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

const Wallet: React.FC = () => {
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

  const [onMutationProfile, resultProfile] = useMutation(mutationProfile, {
      context: { headers: getHeaders(location) },
      update: (cache, {data: {profile}}) => {
          console.log("update :", profile)
      },
      onCompleted(data) {
          console.log("onCompleted :", data)
      },
      onError(error){
          console.log("onError :", error)
      }
  });

  useEffect(()=>{
    setMode("edit")
  }, [])
  

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

  const customRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    onMutationProfile({ variables: { input: { file } } })
  };
  
  return (
    <div style={{ padding: '3px' }}>
    <Card>
      <Descriptions title="Wallet Information" bordered column={1} style={{ marginTop: '10px' }}>
        <Descriptions.Item label="Balance">{'0.00'} Baht</Descriptions.Item>
        <Descriptions.Item label="History(Transactions)">
          <Button 
            type="primary" 
            style={{ marginRight: '10px' }}
            onClick={()=>{
              navigate('/administrator/wallet/history')
            }}>Show History</Button>
        </Descriptions.Item>
        {/* <Descriptions.Item label="QR URL">
          <Input.Group compact>
            <Input style={{ width: 'calc(100% - 32px)' }} value={"http://167.99.75.91/register/" + profile._id} readOnly />
            <Button icon={<CopyOutlined />} onClick={() => copyToClipboard("http://167.99.75.91/register/" + profile._id)} />
          </Input.Group>
        </Descriptions.Item>
        <Descriptions.Item label="Photo QR">
          <div className="qr-container">
              <QRCode 
                ref={canvasRef}
                value={`http://167.99.75.91/register/${encodeURIComponent(profile._id)}`} 
                size={100} 
                viewBox={`0 0 256 256`}/>
            <Button
              icon={<DownloadOutlined />}
              onClick={downloadQRCode}
              className="download-button"
            />
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Wallet">
          <Button 
            type="primary" 
            style={{ marginRight: '10px' }}
            onClick={()=>{
              // navigate('/administrator/billlist')
            }}>Show Wallet</Button>
        </Descriptions.Item>
        <Descriptions.Item label="Bills">
          <Button 
            type="primary" 
            style={{ marginRight: '10px' }}
            onClick={()=>{
              navigate('/administrator/billlist')
            }}>Show Bills</Button>
        </Descriptions.Item>
        <Descriptions.Item label="Tree">
          <Button 
            type="primary" 
            style={{ marginRight: '10px' }}
            onClick={()=>{
              navigate('/administrator/userlist/tree')
            }}>Show Tree</Button>
        </Descriptions.Item> */}
      </Descriptions>
    </Card>
  </div>
  );
};

export default Wallet;