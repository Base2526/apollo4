import React, { FC, useState, useRef, useEffect } from 'react';
import { Card, Descriptions, Typography, Button, Input, message, Tag, Image as ImagesAntd, Space, Avatar, Spin } from 'antd';
import { CopyOutlined, DownloadOutlined, EditOutlined, UserOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';

import { mutationProfile, mutation_address_delivery } from "@/apollo/gqlQuery";
import { getHeaders } from "@/utils";
import { updateProfile, deleteAddressDelivery } from '@/stores/user.store';
import "@/pages/profile/index.less";
import handlerError from "@/utils/handlerError"
import { DefaultRootState } from "@/interface/DefaultRootState"
import * as utils from "@/utils"
import * as Constants from "@/constants"

const { Paragraph, Text } = Typography;

const { REACT_APP_HOST_GRAPHAL }  = process.env

const ProfilePage: FC = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const canvasRef = useRef(null);
  const { profile } = useSelector((state: DefaultRootState) => state.user);
  const [loadingUpdateProfile, setLoadingUpdateProfile] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  console.log("ProfilePage :", profile)

  const [onUpdateProfile] = useMutation(mutationProfile, {
    context: { headers: getHeaders(location) },
    update: (cache, { data: { profile } }) => {
      if (profile.status) {
        dispatch(updateProfile({ profile: profile.data }));

        setLoadingUpdateProfile(false)
        message.success('Update profile success!');
      }
    },
    onError(error) {
      console.error("onError:", error);

      handlerError({}, error)
    }
  });

  const [onAddressDelivery] = useMutation(mutation_address_delivery, {
    context: { headers: getHeaders(location) },
    update: (cache, { data: { address_delivery } }, params: any) => {
      let { status } = address_delivery
      if(status){
        let { input } = params?.variables;
        dispatch(deleteAddressDelivery());

        // setLoading(false); // Reset loading state after success
        message.success('ลบที่อยู่ เรียบร้อย!');
        // setIsModalVisible();
      }
      
    },
    onError: (error) => {
      // setLoading(false); // Reset loading state on error
      handlerError(props, error);
      // setIsModalVisible();
    },
  });

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

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return; 

    const file = e.target.files?.[0]; // Access the first file (if any)
    if (file) {
      // setSelectedFile(file); // Set the selected file
      setLoadingUpdateProfile(true)
      onUpdateProfile({ variables: { input: { file } } })
    }
  };

  const __ViewPackage = (__package: number) =>{
    switch(__package){
      case 1: return 1;
      case 2: return 8;
      case 3: return 56;
    }
  }

  return (
    <div style={{ padding: '3px' }}>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', padding: "10px" }}>
          <Space style={{ position: "relative", width: 100, height: 100 }}>
            {/* Loading spinner */}
            {loadingUpdateProfile && (
              <Spin
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1,
                }}
              />
            )
            }
            {/* Image */}
            {
              profile?.current?.avatar?.url 
              ? <ImagesAntd 
                  src={`http://${REACT_APP_HOST_GRAPHAL}/` + profile?.current?.avatar?.url}
                  alt="avatar"
                  width={100}
                  style={{ borderRadius: 10, opacity: loadingUpdateProfile ? 0.5 : 1, border: "1px solid #333" }}
                />
              : <Avatar 
                  className="user-avator" 
                  shape="square"
                  size={100} 
                  icon={<UserOutlined />} />
            }
            {/* Edit button */}
            <div
              className="edit"
              style={{
                position: "absolute",
                top: 0,
                right: 3,
                padding: "2px",
              }}
            >
              <input
                type="file"
                id="contained-button-file"
                ref={inputRef}
                style={{ display: "none" }}
                multiple={false}
                accept="image/*"
                onChange={onFileChange}
              />
              <Button icon={<EditOutlined />} type="link" onClick={handleClick} />
            </div>
          </Space>

          <div style={{ marginLeft: '20px' }}>
            <h2>{profile?.current?.displayName}</h2>
            <p>{profile?.current?.email}</p>
          </div>
        </div>
        <Descriptions title="User Information" bordered column={1} style={{ marginTop: '20px' }}>
          <Descriptions.Item label="เบอร์โทรศัพท์"><Paragraph className='ant-typography-tel' copyable>{profile?.current?.tel}</Paragraph></Descriptions.Item>
          <Descriptions.Item label="ตำแหน่ง"><Tag color="#2db7f5">{profile?.current?.position}</Tag></Descriptions.Item>
          <Descriptions.Item label="Package"><Tag color="#2db7f5">{__ViewPackage(profile?.current?.packages || 0)}</Tag></Descriptions.Item>
        
          {/* CloseOutlined 
          
          */}
          <Descriptions.Item label="ที่อยู่จัดส่ง">{ 
                                              profile?.current?.address_delivery !== undefined 
                                              ? <>
                                                  <div style={{ display:'flex' ,flexDirection: "row"}}>
                                                    <Text>ชื่อ : </Text>
                                                    <Paragraph className='ant-typography-tel' copyable>{ profile?.current?.address_delivery.name }</Paragraph>
                                                  </div>
                                                  <div style={{ display:'flex' ,flexDirection: "row"}}>
                                                    <Text>เบอร์โทรศัพท์ : </Text>
                                                    <Paragraph className='ant-typography-tel' copyable>{ profile?.current?.address_delivery.phone}</Paragraph>
                                                  </div>
                                                  <div style={{ display:'flex' ,flexDirection: "row"}}>
                                                    <Text>ที่อยู่ : </Text>
                                                    <Paragraph className='ant-typography-tel' copyable>{ profile?.current?.address_delivery.address}</Paragraph>
                                                  </div>
                                                  <Button 
                                                    style={{padding: 0}}
                                                    icon={<DeleteOutlined />} 
                                                    type="link" 
                                                    danger
                                                    onClick={()=>{
                                                      let input = { mode: "deleted" }
                                                      onAddressDelivery({ variables: { input } });
                                                    }} >ลบ</Button>
                                                </> 
                                              : <></>  
                                            }</Descriptions.Item>
          <Descriptions.Item label="QR URL">
            <Input.Group compact>
              <Input style={{ width: 'calc(100% - 32px)' }} value={"http://bestmallu.com/register/" + profile._id} readOnly />
              <Button icon={<CopyOutlined />} onClick={() => copyToClipboard("http://bestmallu.com/register/" + profile._id)} />
            </Input.Group>
          </Descriptions.Item>
          <Descriptions.Item label="Photo QR">
            <div className="qr-container">
              {
                profile?._id !== undefined
                ? <QRCode 
                    ref={canvasRef}
                    value={`http://bestmallu.com/register/${encodeURIComponent(profile?._id)}`} 
                    size={100} 
                    viewBox={`0 0 256 256`}/>
                : <></>
              } 
              <Button
                icon={<DownloadOutlined />}
                onClick={downloadQRCode}
                className="download-button"/>
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
          {/* <Descriptions.Item label="Bills">
            <Button 
              type="primary" 
              style={{ marginRight: '10px' }}
              onClick={()=>{
                navigate('/administrator/billlist')
              }}>Show Bills</Button>
          </Descriptions.Item> */}

{/* 
          {
            utils.checkRole(profile) === Constants.ADMINISTRATOR 
            ?  */}
            <Descriptions.Item label="Tree">
                <Button 
                  type="primary" 
                  style={{ marginRight: '10px' }}
                  onClick={()=>{
                    navigate('/administrator/userlist/tree')
                  }}>Show Tree</Button>
              </Descriptions.Item>
            {/* : <></>
          } */}
         


          <Descriptions.Item label="Purchases">
            <Button 
              type="primary" 
              style={{ marginRight: '10px' }}
              onClick={()=>{
                navigate('/purchases/1')
              }}>Purchases</Button>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default ProfilePage;
