import type { LoginParams } from '@/interface/user/login';
import React, { FC, useEffect } from 'react';

import './index.less';

import { Button, Checkbox, Form, Input } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { LocaleFormatter, useLocale } from '@/locales';
import { formatSearch } from '@/utils/formatSearch';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from "@apollo/client";
// import { useDeviceData } from "react-device-detect";
import _ from 'lodash'; // Import lodash if you're using it

import { loginAsync } from '../../action/user.action';

import { setUserItem, testSetRamdom, updateProfile} from '../../stores/user.store';

import * as constants from "../../constants";

import { mutationLogin } from "../../apollo/gqlQuery"
import { setCookie, getHeaders } from "../../utils"

const initialValues: LoginParams = {
  username: 'glen',
  password: 'glen',
  // remember: true
};

// Define the types for your mutation response
interface LoginData {
  login: {
      status: boolean;
      data: any; // Define a more specific type based on your data structure
      sessionId: string;
      executionTime: string;
  };
}

interface User {
  name?: string; // Optional property
}

// console.log("Loginform process.env :", constants?.configValues())
const LoginForm: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // const deviceData = useDeviceData(typeof window !== 'undefined' ? window.navigator.userAgent : '');

  const { formatMessage } = useLocale();
  // const { logged } = useSelector(state => state.user);

  // console.log("_.isEmpty(user) ", _.isEmpty(""))

  // const user: User | undefined = undefined; // Example value, could be from props or state

  // // Safely check if user object is defined and if it is empty
  // const isUserEmpty = user ? _.isEmpty(user) : true;

  useSelector(state=>{
    console.log("state :", state)
  })

  const [onLogin, resultLogin] = useMutation<LoginData>(mutationLogin, {
      context: { headers: getHeaders(location) },
      onCompleted: async (data: LoginData) => {
        console.log("onCompleted :", data);
        const { status, data: profile, sessionId } = data.login;
        if (status) {
          // localStorage.setItem('usida', sessionId);
          // setCookie('usida', sessionId);
          // updateProfile(userData);

          setCookie('usida', sessionId);
          dispatch(updateProfile({ profile }))

          navigate("/");
        }
      },
      onError: (err: Error) => {
        console.log("onError :", err);
      },
  });

  if (resultLogin.called && !resultLogin.loading) {
      console.log("resultLogin :", resultLogin);
  }

  const onFinished = (input: LoginParams) => {

    /*
    const min = 1;
    const max = 100;
    const rand = min + Math.random() * (max - min);
    dispatch(testSetRamdom({ramdom: rand}))
    */
    // const res = dispatch(await loginAsync(form));
    // if (!!res) {
    //   const search = formatSearch(location.search);
    //   const from = search.from || { pathname: '/' };
    //   navigate(from);
    // }
    // console.log("input :", input)
    // localStorage.setItem('t', "result.token");
    // localStorage.setItem('username', form.username);
    // let xxx = dispatch(
    //             setUserItem({
    //               logged: true,
    //               username: form.username,
    //             }),
    //           );
    // navigate("/");

    onLogin({ variables: { input } })
  };

  return (
    <div className="login-page">
      <Form onFinish={onFinished} className="login-page-form" initialValues={initialValues}>
        <h2>LOGIN</h2>
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: formatMessage({
                id: 'gloabal.tips.enterUsernameMessage',
              }),
            },
          ]}
        >
          <Input
            placeholder={formatMessage({
              id: 'gloabal.tips.username',
            })}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: formatMessage({
                id: 'gloabal.tips.enterPasswordMessage',
              }),
            },
          ]}
        >
          <Input
            type="password"
            placeholder={formatMessage({
              id: 'gloabal.tips.password',
            })}
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
