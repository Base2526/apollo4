import 'dayjs/locale/zh-cn';

import React from 'react';
import { ConfigProvider, Spin, theme as antdTheme } from 'antd';
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';
import thTH from 'antd/es/locale/th_TH';
import dayjs from 'dayjs';
import { FC, Suspense, useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useApolloClient, useSubscription } from "@apollo/client";
import { HistoryRouter, history } from '@/routes/history';
import _ from "lodash"
import { useTranslation } from 'react-i18next';

import  { DefaultRootState } from '@/interface/DefaultRootState';

import { localeConfig } from './locales';
import RenderRouter from './routes';
import { setGlobalState } from './stores/global.store';
import { healthCheck, userConnected } from "./apollo/gqlQuery"

const App: FC = () => {
  const { locale } = useSelector((state : DefaultRootState) => state.user);
  const { theme, loading } = useSelector((state : DefaultRootState) => state.global);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { data: useData, loading: useLoading, error: useError } = useSubscription(userConnected);

  // Handle error here
  if (useError) {
    _.map(useError?.graphQLErrors, (e)=>{
      console.error('Subscription error:',  e?.extensions, e?.extensions?.code);
    })
  }

  const setTheme = (dark = true) => {
    dispatch(
      setGlobalState({
        theme: dark ? 'dark' : 'light',
      }),
    );
  };

  function matchMode(e: MediaQueryListEvent) {
    setTheme(e.matches);
  }

  /** initial theme */
  useEffect(() => {
    console.log("process.env :", process.env);

    setTheme(theme === 'dark');

    // watch system theme change
    if (!localStorage.getItem('theme')) {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      mql.addEventListener('change', matchMode);
    }
  }, []);

  // set the locale for the user
  // more languages options can be added here
  useEffect(() => {
    if (locale === 'en_US') {
      dayjs.locale('en');
    } else if (locale === 'zh_CN') {
      dayjs.locale('zh-cn');
    } else if (locale === 'th_TH') {
      dayjs.locale('th-th');
    }
  }, [locale]);

  /**
   * handler function that passes locale
   * information to ConfigProvider for
   * setting language across text components
   */
  const getAntdLocale = () => {
    if (locale === 'en_US') {
      return enUS;
    } else if (locale === 'zh_CN') {
      return zhCN;
    }else if (locale === 'th_TH') {
      return thTH;
    }
  };

  return (
    <ConfigProvider
      locale={getAntdLocale()}
      componentSize="middle"
      theme={{
        token: { colorPrimary: '#13c2c2' },
        algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      }}
    >
      <IntlProvider locale={locale.split('_')[0]} messages={localeConfig[locale]}>
        <HistoryRouter history={history}>
          <Suspense fallback={null}>
            <Spin
              spinning={loading}
              className="app-loading-wrapper"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.44)' : 'rgba(255, 255, 255, 0.44)',
              }}
              tip={t('loading')}
            ></Spin>
            <RenderRouter />
          </Suspense>
        </HistoryRouter>
      </IntlProvider>
    </ConfigProvider>
  );
};

export default App;
