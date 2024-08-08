// src/UserForm.tsx
import React, { useState, useEffect } from 'react';
import { Form, Input, Upload, Button, Select, Switch, DatePicker, Row, Col, message, Image, GetProp, UploadProps} from 'antd';
import moment from 'moment';
import { UploadOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { RcFile, UploadChangeParam } from 'antd/es/upload/interface';
import { useQuery, useMutation } from "@apollo/client";

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

const User: React.FC = () => {
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
    <Form onSubmitCapture={handleSubmit} layout="vertical">
        <Form.Item label="Avatar">
            {/* {user.avatar ? (
              <Image
                width={100}
                src={user.avatar.url}
                preview={false}
              />
            ) : (
              <div>No avatar uploaded</div>
            )} */}
            {/* {mode === 'edit' && (  
            //   <Upload
            //     name="avatar"
            //     action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload" // Replace with your upload URL
            //     showUploadList={false}
            //     onChange={handleFileChange}
            //   >
            //     <Button icon={<UploadOutlined />}>Upload Avatar</Button>
            //   </Upload> 
            */} 
                <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    // action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    customRequest={customRequest}
                    beforeUpload={beforeUpload}
                    onChange={handleFileChange}
                >
                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload>
            {/* )} */}
          </Form.Item>
      <Form.Item label="Username" required>
        <Input
          name="username"
          value={user.username}
          onChange={handleChange}
          disabled={mode === 'view'}
        />
      </Form.Item>
      <Form.Item label="Password" required>
        <Input.Password
          name="password"
          value={user.password}
          onChange={handleChange}
          disabled={mode === 'view'}
        />
      </Form.Item>
      <Form.Item label="Email" required>
        <Input
          name="email"
          value={user.email}
          onChange={handleChange}
          disabled={mode === 'view'}
        />
      </Form.Item>
      <Form.Item label="Display Name" required>
        <Input
          name="displayName"
          value={user.displayName}
          onChange={handleChange}
          disabled={mode === 'view'}
        />
      </Form.Item>
      <Form.Item label="Roles" required>
        <Select
          mode="multiple"
          value={user.roles}
          onChange={handleSelectChange}
          disabled={mode === 'view'}
        >
          <Option value={0}>Authenticated</Option>
          <Option value={1}>Administrator</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Is Active">
        <Switch
          checked={user.isActive === 1}
          onChange={(checked) => setUser({ ...user, isActive: checked ? 1 : 0 })}
          disabled={mode === 'view'}
        />
      </Form.Item>
      <Form.Item label="Lock Account">
        <Switch
          checked={user.lockAccount.lock}
          onChange={handleSwitchChange}
          disabled={mode === 'view'}
        />
      </Form.Item>
      <Form.Item label="Last Access Date">
        <DatePicker
          value={user.lastAccess ? moment(user.lastAccess) : null}
          onChange={(date) => setUser({ ...user, lastAccess: date?.toDate() || new Date() })}
          disabled={mode === 'view'}
        />
      </Form.Item>
      <Row gutter={16}>
        <Col>
          {mode === 'view' ? (
            <Button type="primary" onClick={() => setMode('edit')}>
              Edit
            </Button>
          ) : (
            <>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button onClick={() => setMode('view')} style={{ marginLeft: '8px' }}>
                Cancel
              </Button>
            </>
          )}
        </Col>
      </Row>
    </Form>
  );
};

export default User;