import type { FC } from 'react';
import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, SettingOutlined, ToolOutlined } from '@ant-design/icons';
import { Dropdown, Layout, theme as antTheme, Tooltip } from 'antd';
import { createElement, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Avator from '@/assets/header/avator.jpeg';
import { ReactComponent as EnUsSvg } from '@/assets/header/en_US.svg';
import { ReactComponent as LanguageSvg } from '@/assets/header/language.svg';
import { ReactComponent as MoonSvg } from '@/assets/header/moon.svg';
import { ReactComponent as SunSvg } from '@/assets/header/sun.svg';
import { ReactComponent as ZhCnSvg } from '@/assets/header/zh_CN.svg';
import { ReactComponent as ThThSvg } from '@/assets/header/th_TH.svg';
import { LocaleFormatter, useLocale } from '@/locales';
import { setGlobalState } from '@/stores/global.store';
import { setUserItem } from '@/stores/user.store';
import InsuranceLogo from "@/assets/logo/InsuranceLogo"
import { logoutAsync } from '../../action/user.action';
import HeaderNoticeComponent from './notice';
import LanguageSwitcher from "./LanguageSwitcher"

import "./index.less"

import * as utils from "../../utils"
import * as Constants from "../../constants"

const { Header } = Layout;

interface HeaderProps {
  collapsed: boolean;
  toggle: () => void;
}

type Action = 'userInfo' | 'userSetting' | 'logout';

const HeaderComponent: FC<HeaderProps> = ({ collapsed, toggle }) => {
  const { logged, locale, device, profile } = useSelector(state => state.user);
  const { theme } = useSelector(state => state.global);
  const navigate = useNavigate();
  const token = antTheme.useToken();
  const dispatch = useDispatch();
  const { formatMessage } = useLocale();

  // useEffect(()=>{
  //   console.log("utils.checkRole(profile) :", utils.checkRole(profile), import.meta.env.VITE_USER_ROLES)
  // }, [])

  const onActionClick = async (action: Action) => {
    switch (action) {
      case 'userInfo':
        return;
      case 'userSetting':
        return;
      case 'logout':
        const res = Boolean(await dispatch(logoutAsync()));
        res && navigate('/login');
        return;
    }
  };

  const toLogin = () => {
    navigate('/login');
  };

  const selectLocale = ({ key }: { key: any }) => {
    dispatch(setUserItem({ locale: key }));
    localStorage.setItem('locale', key);
  };

  const onChangeTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';

    localStorage.setItem('theme', newTheme);
    dispatch(
      setGlobalState({
        theme: newTheme,
      }),
    );
  };

  return (
    <Header className="layout-page-header bg-2" style={{ backgroundColor: token.token.colorBgContainer }}>
      {device !== 'MOBILE' && (
        <div className="logo" style={{ width: collapsed ? 80 : 200 }} onClick={()=>navigate('/')}>
          <InsuranceLogo color= { theme === 'dark' ? "#FFFFFF" : "#333333" } />
        </div>
      )}
      <div className="layout-page-header-main">
        <div onClick={toggle} style={{ color: '#afafaf' }}>
          <span id="sidebar-trigger">{collapsed ? <MenuUnfoldOutlined style={{ color: theme === 'dark' ? "#FFFFFF" : "#333333", fontSize: '24px' }} /> : <MenuFoldOutlined style={{ color: theme === 'dark' ? "#FFFFFF" : "#333333", fontSize: '24px' }}/>}</span>
        </div>
        <div className="actions">
          <Tooltip
            title={formatMessage({
              id: theme === 'dark' ? 'gloabal.tips.theme.lightTooltip' : 'gloabal.tips.theme.darkTooltip',
            })}
          >
            <span>
              {createElement(theme === 'dark' ? SunSvg : MoonSvg, {
                onClick: onChangeTheme,
                style: { color: theme === 'dark' ? '#FFFFFF': '#333333', fontSize: '24px' },
              })}
            </span>
          </Tooltip>
          <HeaderNoticeComponent />
          <Dropdown
            menu={{
              onClick: info => selectLocale(info),
              items: [
                // {
                //   key: 'zh_CN',
                //   icon: <ThThSvg />,
                //   disabled: locale === 'zh_CN',
                //   label: 'ภาษาไทย',
                // },
                {
                  key: 'th_TH',
                  icon: <ThThSvg />,
                  disabled: locale === 'th_TH',
                  label: 'ภาษาไทย',
                },
                {
                  key: 'en_US',
                  icon: <EnUsSvg />,
                  disabled: locale === 'en_US',
                  label: 'English',
                },
              ],
            }}
          >
            <span>
              {/* <LanguageSvg id="language-change" /> */}
              <LanguageSwitcher />
            </span>
          </Dropdown>

          {logged ? (
            <Dropdown
              menu={{
                items:  utils.checkRole(profile) === Constants.ADMINISTRATOR 
                        ? [
                          {
                            key: '1',
                            icon: <UserOutlined />,
                            label: (
                              <span onClick={() => navigate('/profile')}>
                                <LocaleFormatter id="header.avator.account" />
                              </span>
                            ),
                          },
                          {
                            key: '2',
                            icon: <SettingOutlined />,
                            label: (
                              <span onClick={() => navigate('/settings')}>
                                <LocaleFormatter id="header.avator.settings" />
                              </span>
                            ),
                          },
                          {
                            key: '3',
                            icon: <ToolOutlined />,
                            label: (
                              <span onClick={() => navigate('/administrator')}>
                                <LocaleFormatter id="header.avator.administrator" />
                              </span>
                            ),
                          },
                          {
                            key: '4',
                            icon: <LogoutOutlined />,
                            label: (
                              <span onClick={() => onActionClick('logout')}>
                                <LocaleFormatter id="header.avator.logout" />
                              </span>
                            ),
                          },
                          ]
                        : [
                          {
                            key: '1',
                            icon: <UserOutlined />,
                            label: (
                              <span onClick={() => navigate('/profile')}>
                                <LocaleFormatter id="header.avator.account" />
                              </span>
                            ),
                          },
                          // {
                          //   key: '2',
                          //   icon: <SettingOutlined />,
                          //   label: (
                          //     <span onClick={() => navigate('/settings')}>
                          //       <LocaleFormatter id="header.avator.settings" />
                          //     </span>
                          //   ),
                          // },
                          // {
                          //   key: '3',
                          //   icon: <ToolOutlined />,
                          //   label: (
                          //     <span onClick={() => navigate('/administrator')}>
                          //       <LocaleFormatter id="header.avator.administrator" />
                          //     </span>
                          //   ),
                          // },
                          {
                            key: '4',
                            icon: <LogoutOutlined />,
                            label: (
                              <span onClick={() => onActionClick('logout')}>
                                <LocaleFormatter id="header.avator.logout" />
                              </span>
                            ),
                          },
                          ]
                ,
              }}
            >
              <span className="user-action">
                <img src={Avator} className="user-avator" alt="avator" />
              </span>
            </Dropdown>
          ) : (
            <span style={{ cursor: 'pointer' }} onClick={toLogin}>
              {formatMessage({ id: 'gloabal.tips.login' })}
            </span>
          )}
        </div>
      </div>
    </Header>
  );
};

export default HeaderComponent;
