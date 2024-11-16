import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Select, message, Space, Avatar } from 'antd';
import { useQuery, useMutation } from "@apollo/client";
import { useLocation } from 'react-router-dom';
import _ from "lodash";
import { EditOutlined, UserOutlined } from '@ant-design/icons';

import { mutation_profile, query_positions, query_member, mutation_profile_update_position } from "@/apollo/gqlQuery";
import { getHeaders, getPositionId } from "@/utils";
import handlerError from '@/utils/handlerError';

interface positionInterface {
  _id: string;
  level: number;
  name: string;
  percent: number;
  budget: number;
}

interface FormValues {
  displayName: string;
  email: string;
  positionId?: string;
}

const defaultValues = {
  displayName: "",
  email: "",
  positionId: ""
};

const { REACT_APP_HOST_GRAPHAL }  = process.env
const User: React.FC = (props) => {
  const [form] = Form.useForm();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  let { mode, _id } = location.state || { mode: searchParams.get('mode'), _id: searchParams.get('v') };

  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState<positionInterface[]>([]);
  const [image, setImage] = useState<File | any>();

  const [ onProfile ] = useMutation(mutation_profile, {
    context: { headers: getHeaders(location) },
    update: (cache, { data: { profile } }) => {
      console.log("update :", profile);
    },
    onCompleted(data) {
      console.log("onCompleted :", data);
      let { status } = data.profile
      if(status){
        message.success('Update profile success!');
      }

      setLoading(false);
    },
    onError(error) {
      console.log("onError :", error);

      setLoading(false);
      handlerError(props, error)
    }
  });

  const [ onProfileUpdatePosition ] = useMutation(mutation_profile_update_position, {
    context: { headers: getHeaders(location) },
    update: (cache, { data: { profile_update_position } }) => {
      console.log("profile_update_position :", profile_update_position);
    },
    onCompleted(data) {
      console.log("onCompleted :", data);
      let { status } = data.profile_update_position
      if(status){
        message.success('Update profile_update_position success!');
      }

      setLoading(false);
    },
    onError(error) {
      console.log("onError :", error);

      setLoading(false);
      handlerError(props, error)
    }
  });

  const { loading: loadingPositions, data: dataPositions } = useQuery(query_positions, {
    context: { headers: getHeaders(location) },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'network-only'
  });

  useEffect(() => {
    if (!loadingPositions && !_.isEmpty(dataPositions?.positions)) {
      const { status, data } = dataPositions.positions;
      if (status) {
        // Sort the data by level in ascending order before setting it in state
        const sortedPositions = [...data].sort((a: positionInterface, b: positionInterface) => a.level - b.level);
        setPositions(sortedPositions);
      }
    }
  }, [dataPositions, loadingPositions]);

  const { loading: loadingMember, data: dataMember, refetch: refetchMember } = useQuery(query_member, {
    context: { headers: getHeaders(location) },
    fetchPolicy: 'no-cache',
    nextFetchPolicy: 'network-only',
    skip: _.isEmpty(_id) || mode === 'added'
  });

  useEffect(() => {
    if (_id) {
      refetchMember({ id: _id });
    }
  }, [_id, refetchMember]);

  useEffect(() => {
    if (!loadingMember && !_.isEmpty(dataMember?.member)) {
      const { status, data } = dataMember.member;
      if (status) {
        // console.log("dataMember.member :", data)
        form.setFieldsValue({
          displayName: data.current.displayName,
          email: data.current.email,
          positionId: getPositionId(data.current.positionIds) 
        });

        data.current.avatar ? setImage(data.current.avatar) : ""
      }
    }
  }, [dataMember, loadingMember]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return; 
    const file = e.target.files?.[0]; // Access the first file (if any)
    if (file) {
      setImage(file)
    }
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const onFinish = (input: FormValues) => {
    console.log("onFinish :", input);

    if (mode === 'added') {
      setLoading(true);
      onProfile({ variables: { input: { ...input, mode, image } } });
    } else {
      setLoading(true);
      if(image instanceof File){
        onProfile({ variables: { input: { ...input, _id, mode, image } } });
      }else{
        onProfile({ variables: { input: { ...input, _id, mode } } });
      }
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={defaultValues}>
      <Space style={{ position: "relative", width: 100, height: 100 }}>
        {/* Image */}
        {
          <Avatar 
            className="user-avator" 
            shape="square"
            size={100} 
            icon={<UserOutlined />}
            src={ image instanceof File? URL.createObjectURL(image) : `http://${REACT_APP_HOST_GRAPHAL}/${ image?.url }` } />
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

      <Form.Item
        label="ชื่อ"
        name="displayName"
        rules={[{ required: true, message: 'กรุณากรอกชื่อ' }]}>
        <Input />
      </Form.Item>
      
      <Form.Item
        label="อีเมลล์"
        name="email"
        rules={[{ required: true, message: 'กรุณากรอกอีเมลล์' }]}>
        <Input disabled={true} />
      </Form.Item>

      <Form.Item
        label="ตำแหน่ง"
        name="positionId"
        rules={[{ required: true, message: 'กรุณาเลือกตำแหน่ง' }]}>
        <Select 
          loading={loadingPositions} 
          placeholder="เลือกตำแหน่ง"
          onChange={(positionId: string)=>{
            // 
            console.log(`เลือกตำแหน่ง : ${ positionId }`)

            setLoading(true);
            onProfileUpdatePosition({ variables: { input: { _id, positionId } } });
          }}>
          {positions.map((position) => (
            <Select.Option key={position._id} value={position._id}>
              { position.level + 1} : {position.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {mode === 'edited' ? "แก้ไข" : "บันทึก"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default User;