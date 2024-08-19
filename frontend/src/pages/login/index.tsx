import React, { FC } from 'react';
import type { LoginParams } from '@/interface/user/login';
import './index.less';
import { Button, Checkbox, Form, Input } from 'antd';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { LocaleFormatter, useLocale } from '@/locales';
import { useDispatch } from 'react-redux';
import { useMutation } from "@apollo/client";
import { updateProfile } from '../../stores/user.store';
import { mutationLogin } from "../../apollo/gqlQuery";
import { setCookie, getHeaders } from "../../utils";

const initialValues: LoginParams = {
  username: '',
  password: '',
};

interface LoginData {
  login: {
    status: boolean;
    data: any;
    sessionId: string;
    executionTime: string;
  };
}

const LoginForm: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { formatMessage } = useLocale();

  const [onLogin, resultLogin] = useMutation<LoginData>(mutationLogin, {
    context: { headers: getHeaders(location) },
    onCompleted: async (data: LoginData) => {
      const { status, data: profile, sessionId } = data.login;
      if (status) {
        setCookie('usida', sessionId);
        dispatch(updateProfile({ profile }));
        navigate("/");
      }
    },
    onError: (err: Error) => {
      console.error("onError :", err);
    },
  });

  const onFinished = (input: LoginParams) => {
    onLogin({ variables: { input } });
  };

  return (
    <div className="login-page">
      <Form onFinish={onFinished} className="login-page-form" initialValues={initialValues}>
        <h2>LOGIN</h2>
        <Form.Item
          name="username"
          rules={[
            { required: true, message: formatMessage({ id: 'gloabal.tips.enterUsernameMessage' }) },
          ]}
        >
          <Input
            placeholder={formatMessage({ id: 'gloabal.tips.username' })}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: formatMessage({ id: 'gloabal.tips.enterPasswordMessage' }) },
          ]}
        >
          <Input
            type="password"
            placeholder={formatMessage({ id: 'gloabal.tips.password' })}
          />
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>
            <LocaleFormatter id="gloabal.tips.rememberUser" />
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary" className="login-page-form_button">
            <LocaleFormatter id="gloabal.tips.login" />
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
