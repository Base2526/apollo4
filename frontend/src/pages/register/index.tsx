import "./index.less";

import React, { FC, useEffect, useState } from 'react';
import { Card, Layout, Form, Input, Button, message, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from "@apollo/client";
import { useLocation, useNavigate, useParams} from 'react-router-dom';
import { mutationRegister } from "@/apollo/gqlQuery";
import { getHeaders } from "@/utils";
import handlerError from "@/utils/handlerError"

const userNameRegex = /^[a-zA-Z0-9]+$/;
const idCardRegex = /^\d{13}$/;
const phoneNumberRegex = /^[0-9]{10}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const initialValues = {
  parentId: '', // Hidden field value
  username: '',
  idCard: '',
  email: '',
  tel: '',
  password: '',
  confirmPassword: '',
  packages: 1
};

const RegisterPage: FC = (props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // const { theme } = useSelector(state => state.global);
  const [form] = Form.useForm();

  const { id } = useParams();

  useEffect(()=>{
    console.log("RegisterPage :", id)
    form.setFieldsValue({ parentId: id });
  }, [id])

  const [onMutationRegister] = useMutation(mutationRegister, {
    context: { headers: getHeaders(location) },
    update: (cache, { data: { register } }) => {
      console.log(register);
      message.success('Register successfully!');
      setLoading(false);

      navigate(`/login${'?from=' + encodeURIComponent(location.pathname)}`, { replace: true })
    },
    onError(error) {
      // console.error(error);
      // message.error('An error occurred while updating the profile.');

      setLoading(false);

      handlerError({}, error)
    }
  });

  const handleSubmit = async (input: any) => {
    console.log("handlerSubmit :", input);
    
    setLoading(true);
    onMutationRegister({ variables: { input } });
  };

  return (
    <Layout className="layout-page">
    <div className="register-page">
      <Form
        form={form}
        initialValues={initialValues}
        onFinish={handleSubmit}
        layout="vertical"
        className="register-page-form"
      >
        <h2>REGISTER</h2>
        <Form.Item
          name="parentId"
          initialValue={initialValues.parentId}
          style={{ display: 'none' }}
        >
          <Input type="hidden" />
        </Form.Item>

        <Form.Item
          name="username"
          label="Username"
          rules={[
            { required: true, message: 'Please input your username!' },
            { pattern: userNameRegex, message: "Only allows letters (both uppercase and lowercase) and numbers" }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="idCard"
          label="ID Card"
          rules={[
            { required: true, message: 'Please input your ID card!' },
            { pattern: idCardRegex, message: 'ID card number must be 13 digits!' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="tel"
          label="Telephone"
          rules={[
            { required: true, message: 'Please input your telephone number!' },
            { pattern: phoneNumberRegex, message: 'Phone number must be 10 digits!' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please input your password!' },
            {
              pattern: passwordRegex,
              message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          rules={[
            { required: true, message: 'Please confirm your password!' },
            {
              pattern: passwordRegex,
              message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('The two passwords that you entered do not match!');
              },
            })
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="packages"
          label="Packages"
          rules={[{ required: true, message: 'Please select a packages!' }]}
        >
          <Select defaultValue={1} style={{ width: 120 }}>
            <Select.Option value={1}>1</Select.Option>
            <Select.Option value={2}>8</Select.Option>
            <Select.Option value={3}>57</Select.Option>
            {/* <Select.Option value={4}>343</Select.Option>
            <Select.Option value={5}>2,401</Select.Option>
            <Select.Option value={6}>16,807</Select.Option> */}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
    </Layout>
  );
};

export default RegisterPage;