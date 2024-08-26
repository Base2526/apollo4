import React, { FC, useState } from 'react';
import { Card, Descriptions, Upload, Button, Input, message } from 'antd';
import { UploadOutlined, LoadingOutlined, PlusOutlined, CopyOutlined, DownloadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from "@apollo/client";
import QRCode from 'react-qr-code';

import { mutationProfile } from "../../apollo/gqlQuery";
import { getHeaders } from "../../utils";
import { updateProfile } from '../../stores/user.store';
import "./index.less";

type FileType = Parameters<typeof Upload.beforeUpload>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const ProfilePage: FC = () => {
  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState(false);
  const { profile } = useSelector((state: any) => state.user);

  console.log("ProfilePage :", profile)
  const user = {
    name: profile?.current?.displayName,
    email: profile?.current?.email,
    phone: '123-456-7890',
    address: '123 Main St, Anytown, USA',
    avatar: 'https://www.example.com/avatar.jpg'
  };

  const [onMutationProfile] = useMutation(mutationProfile, {
    context: { headers: getHeaders(location) },
    update: (cache, { data: { profile } }) => {
      if (profile.status) {
        dispatch(updateProfile({ profile: profile.data }));
      }
    },
    onError(error) {
      console.error("onError:", error);
    }
  });

  const handleFileChange: UploadProps['onChange'] = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') return;
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj as FileType, (url) => {
        setImageUrl(url);
      });
    }
  };

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) message.error('You can only upload JPG/PNG file!');
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) message.error('Image must smaller than 2MB!');
    return isJpgOrPng && isLt2M;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('Copied to clipboard!');
  };

  const downloadQRCode = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'qrcode.png';
      link.click();
    }
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
        <div style={{ display: 'flex', alignItems: 'center', padding: "10px" }}>
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            customRequest={(options) => onMutationProfile({ variables: { input: { file: options.file } } })}
            beforeUpload={beforeUpload}
            onChange={handleFileChange}
          >
            {profile?.current?.avatar?.url ? (
              <img src={"http://localhost:4000/" + profile?.current?.avatar?.url} alt="avatar" style={{ width: "100px", height: "100px" }} />
            ) : (
              uploadButton
            )}
          </Upload>
          <div style={{ marginLeft: '20px' }}>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        </div>
        <Descriptions title="User Information" bordered column={1} style={{ marginTop: '20px' }}>
          <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>
          <Descriptions.Item label="Address">{user.address}</Descriptions.Item>
          <Descriptions.Item label="QR URL">
            <Input.Group compact>
              <Input style={{ width: 'calc(100% - 32px)' }} value={"http://167.99.75.91/register/" + profile._id} readOnly />
              <Button icon={<CopyOutlined />} onClick={() => copyToClipboard("http://167.99.75.91/register/" + profile._id)} />
            </Input.Group>
          </Descriptions.Item>
          <Descriptions.Item label="Photo QR">
            <div className="qr-container">
              <QRCode value={`http://167.99.75.91/register/${encodeURIComponent(profile._id)}`} size={100} />
              <Button
                icon={<DownloadOutlined />}
                onClick={downloadQRCode}
                className="download-button"
              />
            </div>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default ProfilePage;