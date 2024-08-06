import { FC } from 'react';
import type { RouteObject } from 'react-router';

import { lazy } from 'react';
import { Navigate } from 'react-router';
import { useRoutes } from 'react-router-dom';


import InsurancePage from '@/pages/insurance/insurancePage';
import SelectInsurancePage from '@/pages/insurance/selectInsurancePage'
import ListInsurancePage from "@/pages/insurance/listInsurancePage"
import Dashboard from '@/pages/dashboard';
import LayoutPage from '@/pages/layout';
import LoginPage from '@/pages/login';

import ProfilePage from "@/pages/profile"
import SettingsPage from "@/pages/settings"
import DetailnsurancePage from "@/pages/insurance/detailnsurancePage"
import AgentPage from "@/pages/agent/agent"

import WrapperRouteComponent from './config';

const NotFound = lazy(() => import(/* webpackChunkName: "404'"*/ '@/pages/404'));
const Documentation = lazy(() => import(/* webpackChunkName: "404'"*/ '@/pages/doucumentation'));
const Guide = lazy(() => import(/* webpackChunkName: "guide'"*/ '@/pages/guide'));
const RoutePermission = lazy(() => import(/* webpackChunkName: "route-permission"*/ '@/pages/permission/route'));
const FormPage = lazy(() => import(/* webpackChunkName: "form'"*/ '@/pages/components/form'));
const TablePage = lazy(() => import(/* webpackChunkName: "table'"*/ '@/pages/components/table'));
const SearchPage = lazy(() => import(/* webpackChunkName: "search'"*/ '@/pages/components/search'));
const TabsPage = lazy(() => import(/* webpackChunkName: "tabs'"*/ '@/pages/components/tabs'));
const AsidePage = lazy(() => import(/* webpackChunkName: "aside'"*/ '@/pages/components/aside'));
const RadioCardsPage = lazy(() => import(/* webpackChunkName: "radio-cards'"*/ '@/pages/components/radio-cards'));
const BusinessBasicPage = lazy(() => import(/* webpackChunkName: "basic-page" */ '@/pages/business/basic'));
const BusinessWithSearchPage = lazy(() => import(/* webpackChunkName: "with-search" */ '@/pages/business/with-search'));
const BusinessWithAsidePage = lazy(() => import(/* webpackChunkName: "with-aside" */ '@/pages/business/with-aside'));
const BusinessWithRadioCardsPage = lazy(
  () => import(/* webpackChunkName: "with-aside" */ '@/pages/business/with-radio-cards'),
);
const BusinessWithTabsPage = lazy(() => import(/* webpackChunkName: "with-tabs" */ '@/pages/business/with-tabs'));

const routeList: RouteObject[] = [
  {
    path: '/login',
    element: <WrapperRouteComponent requireAuth={false} element={<LoginPage />} titleId="title.login" />,
  },
  {
    // path: '/',
    // element: <WrapperRouteComponent element={<LayoutPage />} titleId="" />,
    element: <LayoutPage />,
    children: [
      {
        path: '/',
        element: <WrapperRouteComponent requireAuth={true} element={<Dashboard />} titleId="title.dashboard" />,
      },
      // 
      {
        path: 'listInsurance',
        element: <WrapperRouteComponent requireAuth={true} element={<ListInsurancePage />} titleId="title.insurance" />,
      },
      {
        path: 'selectInsur',
        element: <WrapperRouteComponent requireAuth={true} element={<SelectInsurancePage />} titleId="title.insurance" />,
      },
      {
        path: 'insurance',
        element: <WrapperRouteComponent requireAuth={true} element={<InsurancePage />} titleId="title.insurance" />,
      },
      // 
      {
        path: 'detailnsurance',
        element: <WrapperRouteComponent requireAuth={true} element={<DetailnsurancePage />} titleId="title.insurance" />,
      },

      // 
      {
        path: 'agent',
        element: <WrapperRouteComponent requireAuth={true} element={<AgentPage />} titleId="title.insurance" />,
      },
      {
        path: 'profile',
        element: <WrapperRouteComponent requireAuth={true} element={<ProfilePage />} titleId="title.profile" />,
      },
      {
        path: 'documentation',
        element: <WrapperRouteComponent requireAuth={true} element={<Documentation />} titleId="title.documentation" />,
      },
      {
        path: 'guide',
        element: <WrapperRouteComponent requireAuth={true} element={<Guide />} titleId="title.guide" />,
      },
      {
        path: 'permission/route',
        element: <WrapperRouteComponent requireAuth={true} element={<RoutePermission />} titleId="title.permission.route" auth />,
      },
      { 
        path: 'component/form',
        element: <WrapperRouteComponent requireAuth={true} element={<FormPage />} titleId="title.account" />,
      },
      {
        path: 'component/table',
        element: <WrapperRouteComponent requireAuth={true} element={<TablePage />} titleId="title.account" />,
      },
      {
        path: 'component/search',
        element: <WrapperRouteComponent requireAuth={true} element={<SearchPage />} titleId="title.account" />,
      },
      {
        path: 'component/tabs',
        element: <WrapperRouteComponent requireAuth={true} element={<TabsPage />} titleId="title.account" />,
      },
      {
        path: 'component/aside',
        element: <WrapperRouteComponent requireAuth={true} element={<AsidePage />} titleId="title.account" />,
      },
      {
        path: 'component/radio-cards',
        element: <WrapperRouteComponent requireAuth={true} element={<RadioCardsPage />} titleId="title.account" />,
      },
      {
        path: 'business/basic',
        element: <WrapperRouteComponent requireAuth={true} element={<BusinessBasicPage />} titleId="title.account" />,
      },
      {
        path: 'business/with-search',
        element: <WrapperRouteComponent requireAuth={true} element={<BusinessWithSearchPage />} titleId="title.account" />,
      },
      {
        path: 'business/with-aside',
        element: <WrapperRouteComponent requireAuth={true} element={<BusinessWithAsidePage />} titleId="title.account" />,
      },
      {
        path: 'business/with-radio-cards',
        element: <WrapperRouteComponent requireAuth={true} element={<BusinessWithRadioCardsPage />} titleId="title.account" />,
      },
      {
        path: 'business/with-tabs',
        element: <WrapperRouteComponent requireAuth={true} element={<BusinessWithTabsPage />} titleId="title.account" />,
      },
      {
        path: 'settings',
        element: <WrapperRouteComponent requireAuth={true} element={<SettingsPage />} titleId="title.settings" />,
      },
      {
        path: '*',
        element: <WrapperRouteComponent element={<NotFound />} titleId="title.notFount" />,
      },
    ],
  },
];

const RenderRouter: FC = () => {
  const element = useRoutes(routeList);

  return element;
};

export default RenderRouter;
