import React, { FC, useState, useRef } from 'react';
import { Card, Descriptions, Upload, Button, Input, message, UploadProps } from 'antd';
import { UploadOutlined, LoadingOutlined, PlusOutlined, CopyOutlined, DownloadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';

import { mutationProfile } from "@/apollo/gqlQuery";
import { getHeaders } from "@/utils";
import { updateProfile } from '@/stores/user.store';
import "@/pages/profile/index.less";
import handlerError from "@/utils/handlerError"

// type FileType = Parameters<typeof Upload.beforeUpload>[0];
type FileType = Parameters<NonNullable<UploadProps['beforeUpload']>>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const ProfilePage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const canvasRef = useRef(null);
  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState(false);
  const { profile } = useSelector((state: any) => state.user);

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

      handlerError({}, error)
    }
  });

  // const handleFileChange: UploadProps['onChange'] = (info: UploadChangeParam) => {
  //   if (info.file.status === 'uploading') return;
  //   if (info.file.status === 'done') {
  //     getBase64(info.file.originFileObj as FileType, (url) => {
  //       setImageUrl(url);
  //     });
  //   }
  // };

  const handleFileChange: UploadProps['onChange'] = (info) => {
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
    if (navigator.clipboard) {
      // Use the Clipboard API if available
      navigator.clipboard.writeText(text)
        .then(() => {
          message.success('Copied to clipboard!');
        })
        .catch((error) => {
          console.error('Failed to copy text to clipboard:', error);
          message.error('Failed to copy text to clipboard.');
        });
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          message.success('Copied to clipboard!');
        } else {
          throw new Error('Failed to copy text');
        }
      } catch (error) {
        console.error('Failed to copy text to clipboard:', error);
        message.error('Failed to copy text to clipboard.');
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  const downloadQRCode = () => {
    const svg = canvasRef.current;
    if (!svg) return;

    // Convert SVG to a data URL
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);

    // Create a canvas to convert SVG to PNG
    const scale = 4; // Scale factor for high resolution
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if(!ctx){
      console.error('Failed to get canvas context');
      return;
    } 
    const img = new Image();

    img.onload = () => {
      // Set canvas dimensions based on the image size and scale factor
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      // Draw the image onto the canvas with scaling
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Convert canvas to PNG data URL
      const pngData = canvas.toDataURL('image/png');

      // Create a link element
      const link = document.createElement('a');
      link.href = pngData;
      link.download = 'insurance.png'; // File name for download

      // Trigger the download
      link.click();

      // Clean up
      URL.revokeObjectURL(url);
    };

    img.src = url;

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
                navigate('/administrator/wallet')
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
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default ProfilePage;
