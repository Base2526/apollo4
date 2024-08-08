import React, { FC, useState } from 'react';
import { Card, Descriptions, Upload, Button, Select, Switch, DatePicker, Row, Col, message, Image, GetProp, UploadProps} from 'antd';
import moment from 'moment';
import { UploadOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { RcFile, UploadChangeParam } from 'antd/es/upload/interface';
import { useQuery, useMutation } from "@apollo/client";
import { useDispatch, useSelector } from 'react-redux';

import "./index.less"

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

import { mutationProfile } from "../../apollo/gqlQuery"
import { getHeaders, isValidUrl } from "../../utils"
import { updateProfile} from '../../stores/user.store';

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const ProfilePage: FC = () => {
  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState(false);
  const { profile } = useSelector(state => state.user);

  console.log("profile:", profile)
  const user = {
    name: profile?.current?.displayName,
    email: profile?.current?.email,
    phone: '123-456-7890',
    address: '123 Main St, Anytown, USA',
    avatar: 'https://www.example.com/avatar.jpg', // Replace with your avatar URL
  };
  // 


  const [onMutationProfile, resultProfile] = useMutation(mutationProfile, {
    context: { headers: getHeaders(location) },
    update: (cache, {data: {profile}}) => {
      console.log("update :", profile)

      const { status, data } = profile;
      if (status) {
        dispatch(updateProfile({ profile: data }))
      }
    },
    onCompleted(data) {
        console.log("onCompleted :", data)
    },
    onError(error){
        console.log("onError :", error)
    }
  });

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


  /*
  return isValidUrl(avatar) 
                        ? <Image  width={100} src={avatar} /> 
                        : <Image  width={100} src={"http://localhost:4000/" + avatar} /> 
  */
  return (
    <div style={{ padding: '3px' }}>
        <Card>
            <div style={{ display: 'flex', alignItems: 'center', padding: "10px" }}>
                {/* <Avatar size={100} src={user.avatar} /> */}
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
                    { 
                      profile?.current?.avatar?.url 
                      ? <img src={"http://localhost:4000/" + profile?.current?.avatar?.url} alt="avatar" style={{width: "100px", height: "100px"}} /> 
                      : uploadButton
                    }
                </Upload>
                <div style={{ marginLeft: '20px' }}>
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                </div>
            </div>
            <Descriptions title="User Information" bordered style={{ marginTop: '20px' }}>
                <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>
                <Descriptions.Item label="Address">{user.address}</Descriptions.Item>
            </Descriptions>
        </Card>
    </div>
  );
};

export default ProfilePage;
