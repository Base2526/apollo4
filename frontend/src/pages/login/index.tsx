import type { LoginParams } from '@/interface/user/login';
import React, { FC, useEffect } from 'react';

import './index.less';

import { Button, Checkbox, Form, Input } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

import { LocaleFormatter, useLocale } from '@/locales';
import { formatSearch } from '@/utils/formatSearch';
import { useDispatch, useSelector } from 'react-redux';

import { loginAsync } from '../../action/user.action';

import { setUserItem, testSetRamdom } from '../../stores/user.store';

import * as constants from "../../constants";

const initialValues: LoginParams = {
  username: 'guest',
  password: 'guest',
  // remember: true
};
// console.log("Loginform process.env :", constants?.configValues())
const LoginForm: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { formatMessage } = useLocale();
  // const { logged } = useSelector(state => state.user);

  useSelector(state=>{
    console.log("state :", state)
  })

  const onFinished = (form: LoginParams) => {

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

    console.log("form :", form)

    localStorage.setItem('t', "result.token");
    localStorage.setItem('username', form.username);
    let xxx = dispatch(
                setUserItem({
                  logged: true,
                  username: form.username,
                }),
              );

    navigate("/");
  };

  return (
    <div className="login-page">
      <Form onFinish={onFinished} className="login-page-form" initialValues={initialValues}>
        <h2>REACT ANTD ADMIN</h2>
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
