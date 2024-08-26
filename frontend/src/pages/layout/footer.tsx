

import type { FC } from 'react';

import './index.less';

import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import { Dropdown, Layout, theme as antTheme, Tooltip } from 'antd';
import { createElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Avator from '@/assets/header/avator.jpeg';
import { ReactComponent as EnUsSvg } from '@/assets/header/en_US.svg';
import { ReactComponent as LanguageSvg } from '@/assets/header/language.svg';
import { ReactComponent as MoonSvg } from '@/assets/header/moon.svg';
import { ReactComponent as SunSvg } from '@/assets/header/sun.svg';
import { ReactComponent as ZhCnSvg } from '@/assets/header/zh_CN.svg';
import AntdSvg from '@/assets/logo/antd.svg';
import ReactSvg from '@/assets/logo/react.svg';
import { LocaleFormatter, useLocale } from '@/locales';
import { setGlobalState } from '@/stores/global.store';
import { setUserItem } from '@/stores/user.store';

import { logoutAsync } from '../../action/user.action';
import HeaderNoticeComponent from './notice';

const { Footer } = Layout;

// interface HeaderProps {
//   collapsed: boolean;
//   toggle: () => void;
// }

// type Action = 'userInfo' | 'userSetting' | 'logout';

const FooterComponent: FC /*<HeaderProps> */ = () => {
  
  return (
    <Footer className="footer">
        <div className="footer-content">
            <p>&copy; {new Date().getFullYear()} INSURANCE</p>
            {/* <ul className="footer-links">
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/privacy">Privacy Policy</a></li>
            </ul> */}
        </div>
    </Footer>
  );
};

export default FooterComponent;
