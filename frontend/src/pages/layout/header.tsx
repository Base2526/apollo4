import "@/pages/layout/index.less"

import React, { FC } from 'react';
import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, SettingOutlined, ToolOutlined } from '@ant-design/icons';
import { Dropdown, Layout, theme as antTheme, Tooltip } from 'antd';
import { createElement, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import  Avator from '@/assets/header/avator.jpeg';
import { ReactComponent as EnUsSvg } from '@/assets/header/en_US.svg';
import { ReactComponent as MoonSvg } from '@/assets/header/moon.svg';
import { ReactComponent as SunSvg } from '@/assets/header/sun.svg';
import { ReactComponent as ThThSvg } from '@/assets/header/th_TH.svg';

import { useLocale } from '@/locales';
import { setGlobalState } from '@/stores/global.store';
import InsuranceLogo from "@/assets/logo/InsuranceLogo"
import { logoutAsync } from '@/action/user.action';

import CartComponent from "@/pages/layout/cart";
import HeaderNoticeComponent from '@/pages/layout/notice';
import LanguageSwitcher from "@/pages/layout/LanguageSwitcher"

import * as utils from "@/utils"
import * as Constants from "@/constants"
import  { DefaultRootState } from '@/interface/DefaultRootState';

const { Header } = Layout;

interface HeaderProps {
  collapsed: boolean;
  toggle: () => void;
}

type Action = 'userInfo' | 'userSetting' | 'logout';

const HeaderComponent: FC<HeaderProps> = ({ collapsed, toggle }) => {
  const { logged, locale, device, profile } = useSelector((state: DefaultRootState) => state.user);
  const { theme } = useSelector((state: DefaultRootState) => state.global);
  const navigate = useNavigate();
  const token = antTheme.useToken();
  const dispatch = useDispatch();
  const { formatMessage } = useLocale();

  const { t, i18n } = useTranslation();

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
    // dispatch(setUserItem({ locale: key }));
    // localStorage.setItem('locale', key);

    i18n.changeLanguage(key);
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
          <CartComponent />
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
                {
                  key: 'th_TH',
                  icon: <ThThSvg style={{ width: '25px', height: '25px' }}/>,
                  disabled: i18n.language === 'th_TH',
                  label: 'ภาษาไทย',
                },
                {
                  key: 'en_US',
                  icon: <EnUsSvg style={{ width: '25px', height: '25px' }}/>,
                  disabled: i18n.language === 'en_US',
                  label: 'English',
                },
              ],
            }}
          >
            <span>
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
                                {t('account')}
                              </span>
                            ),
                          },
                          {
                            key: '2',
                            icon: <SettingOutlined />,
                            label: (
                              <span onClick={() => navigate('/settings')}>
                                {t('settings')}
                              </span>
                            ),
                          },
                          {
                            key: '3',
                            icon: <ToolOutlined />,
                            label: (
                              <span onClick={() => navigate('/administrator')}>
                                {t('administrator')}
                              </span>
                            ),
                          },
                          {
                            key: '4',
                            icon: <LogoutOutlined />,
                            label: (
                              <span onClick={() => onActionClick('logout')}>
                                {t('logout')}
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
                                {t('account')}
                              </span>
                            ),
                          },
                          {
                            key: '4',
                            icon: <LogoutOutlined />,
                            label: (
                              <span onClick={() => onActionClick('logout')}>
                                {t('logout')}
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
