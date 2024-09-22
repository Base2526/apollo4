import React, { FC } from 'react';
import type { RouteObject } from 'react-router';
import { lazy } from 'react';
// import { Navigate } from 'react-router';
import { useRoutes } from 'react-router-dom';

import InsurancePage from '@/pages/insurance/insurancePage';
import SelectInsurancePage from '@/pages/insurance/selectInsurancePage'
import ListCtpPage from "@/pages/insurance/ListCtp"
import Dashboard from '@/pages/dashboard';
import LayoutPage from '@/pages/layout';
import LoginPage from '@/pages/login';
import RegisterPage from '@/pages/register';

import ProfilePage from "@/pages/profile"
import SettingsPage from "@/pages/settings"
import DetailnsurancePage from "@/pages/insurance/detailnsurancePage"
import AgentPage from "@/pages/agent/agent"
import ListAgentPage from "@/pages/settings/ListAgent"
import ListEndDosNoticPage from "@/pages/insurance/ListEndDosNotic"
import ListAgentCreditPage from "@/pages/insurance/ListAgentCredit"
import PendingListCTPPage from "@/pages/insurance/PendingListCTP"
import ListPolicyCtpPage from "@/pages/insurance/ListPolicyCtp"
import PolicyCTPListExpirePage from "@/pages/insurance/PolicyCTPListExpire"
import ShowAgentSalePage from "@/pages/insurance/ShowAgentSale"

import ReportCtpListPage from "@/pages/report/ReportCtpList"
import ReportCtpListByInsPage from "@/pages/report/ReportCtpListByIns"
import AdministratorPage from "@/pages/administrator"
import UserListPage from "@/pages/administrator/UserList"
import UserPage from "@/pages/administrator/User"
import FakerPage from "@/pages/administrator/Faker"
import FileListPage from "@/pages/administrator/FileList"
import DblogPage  from "@/pages/administrator/Dblog";
import ImportPage from "@/pages/administrator/Import";
import TreePage from "@/pages/administrator/Tree";
import OtherPage from "@/pages/administrator/Other";

import HomePage from "@/pages/home";
import CartPage from "@/pages/cart";
import OrderPage from "@/pages/administrator/order"
import OrderFormPage from "@/pages/administrator/order/OrderForm"

import ProductListPage from "@/pages/administrator/product";
import ProductPage from "@/pages/administrator/product/ProductForm";
import ViewProductPage from "@/pages/administrator/product/ViewProduct";

import OrgChartPage from "@/pages/administrator/orgchart"

import BillListPage from "@/pages/administrator/BillList"
import BillPage from "@/pages/administrator/Bill"

import WalletPage from "@/pages/administrator/Wallet"
import WalletCalculatePage  from "@/pages/administrator/WalletCalculate"
import WalletHistoryPage from "@/pages/administrator/WalletHistoryList"

import PurchasePage from "@/pages/cart/Purchase"

import CalTreePage from "@/pages/administrator/CalTree"
import CalTreeHistoryListPage from "@/pages/administrator/CalTreeHistoryList"

import NoticeListPage from "@/pages/administrator/NoticeList"

import WrapperRouteComponent from '@/routes/config';

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
    // element: <LayoutPage />,
    children: [{
      path: '/login',
      element: <WrapperRouteComponent requireAuth={false} element={<LoginPage />} titleId="title.login" />,
    },{
      path: '/register/:id',
      element: <WrapperRouteComponent requireAuth={false} element={<RegisterPage />} titleId="title.register" />,
    }
    ]
  },
  {
    // path: '/',
    // element: <WrapperRouteComponent element={<LayoutPage />} titleId="" />,
    element: <LayoutPage />,
    children: [
      // {
      //   path: '/',
      //   element: <WrapperRouteComponent requireAuth={true} element={<Dashboard />} titleId="title.dashboard" />,
      // },
      {
        path: '/',
        element: <WrapperRouteComponent requireAuth={true} element={<HomePage />} titleId="title.dashboard" />,
      },
      {
        path: 'view',
        element: <WrapperRouteComponent requireAuth={true} element={<ViewProductPage />} titleId="title.insurance" />,
      },
      {
        path: 'cart',
        element: <WrapperRouteComponent requireAuth={true} element={<CartPage />} titleId="title.dashboard" />,
      },
      {
        path: 'purchases',
        element: <WrapperRouteComponent requireAuth={true} element={<PurchasePage />} titleId="title.dashboard" />,
        
      },
      {
        path: 'purchases/:key',
        element: <WrapperRouteComponent requireAuth={true} element={<PurchasePage />} titleId="title.dashboard" />,
        
      },
      {
        path: 'purchases/:key/view',
        element: <WrapperRouteComponent requireAuth={true} element={<OrderFormPage />} titleId="title.insurance" />,
      },
      {
        path: 'insurance',
        element: <WrapperRouteComponent requireAuth={true} element={<InsurancePage />} titleId="title.insurance" />,
      },
      {
        path: 'insurance/listenddosnotic',
        element: <WrapperRouteComponent requireAuth={true} element={<ListEndDosNoticPage />} titleId="title.insurance" />,
      },
      {
        path: 'insurance/listagentcredit',
        element: <WrapperRouteComponent requireAuth={true} element={<ListAgentCreditPage />} titleId="title.insurance" />,
      },
      {
        path: 'insurance/selectInsur',
        element: <WrapperRouteComponent requireAuth={true} element={<SelectInsurancePage />} titleId="title.insurance" />,
      },

      {
        // path: 'insurance/listInsurance',
        path: 'insurance/listctp',
        element: <WrapperRouteComponent requireAuth={true} element={<ListCtpPage />} titleId="title.insurance" />,
      },

      {
        path: 'insurance/pendinglist_ctp',
        element: <WrapperRouteComponent requireAuth={true} element={<PendingListCTPPage />} titleId="title.insurance" />,
      },
      {
        path: 'insurance/listpolicyctp',
        element: <WrapperRouteComponent requireAuth={true} element={<ListPolicyCtpPage />} titleId="title.insurance" />,
      },
      {
        path: 'insurance/policyctplistexpire',
        element: <WrapperRouteComponent requireAuth={true} element={<PolicyCTPListExpirePage />} titleId="title.insurance" />,
      },
      {
        path: 'insurance/showagentsale',
        element: <WrapperRouteComponent requireAuth={true} element={<ShowAgentSalePage />} titleId="title.insurance" />,
      },
     
      {
        path: 'detailnsurance',
        element: <WrapperRouteComponent requireAuth={true} element={<DetailnsurancePage />} titleId="title.insurance" />,
      },
    
      {
        path: 'report/reportctplist',
        element: <WrapperRouteComponent requireAuth={true} element={<ReportCtpListPage />} titleId="title.insurance" />,
      },
      {
        path: 'report/reportctplistbyins',
        element: <WrapperRouteComponent requireAuth={true} element={<ReportCtpListByInsPage />} titleId="title.insurance" />,
      },
      {
        path: 'administrator',
        element: <WrapperRouteComponent requireAuth={true} isAdmin={true} element={<AdministratorPage />} titleId="title.insurance" />,
      },
      {
        path: 'administrator/dblog',
        element: <WrapperRouteComponent requireAuth={true} isAdmin={true} element={<DblogPage />} titleId="title.insurance" />,
      },
      {
        path: 'administrator/other',
        element: <WrapperRouteComponent requireAuth={true} isAdmin={true} element={<OtherPage />} titleId="title.insurance" />,
      },
      {
        path: 'administrator/filelist',
        element: <WrapperRouteComponent requireAuth={true} isAdmin={true} element={<FileListPage />} titleId="title.insurance" />,
      },
      {
        path: 'administrator/userlist',
        element: <WrapperRouteComponent requireAuth={true} isAdmin={true} element={<UserListPage />} titleId="title.insurance" />,
      },
      {
        path: 'administrator/userlist/user',
        element: <WrapperRouteComponent requireAuth={true} isAdmin={true} element={<UserPage />} titleId="title.insurance" />,
      },

      {
        path: 'administrator/orders',
        element: <WrapperRouteComponent requireAuth={true} isAdmin={true} element={<OrderPage />} titleId="title.insurance" />,
      },
      {
        path: 'administrator/orders/edit',
        element: <WrapperRouteComponent requireAuth={true} isAdmin={true} element={<OrderFormPage />} titleId="title.insurance" />,
      },
      {
        path: 'administrator/products',
        element: <WrapperRouteComponent requireAuth={true} isAdmin={true} element={<ProductListPage />} titleId="title.insurance" />,
      },
      {
        path: 'administrator/products/new',
        element: <WrapperRouteComponent requireAuth={true} isAdmin={true} element={<ProductPage />} titleId="title.insurance" />,
      },
      {
        path: 'administrator/products/edit',
        element: <WrapperRouteComponent requireAuth={true} isAdmin={true} element={<ProductPage />} titleId="title.insurance" />,
      },
      {
        path: 'administrator/products/view',
        element: <WrapperRouteComponent requireAuth={true} isAdmin={true} element={<ViewProductPage />} titleId="title.insurance" />,
      },

      {
        path: 'administrator/billlist',
        element: <WrapperRouteComponent requireAuth={true}  element={<BillListPage />} titleId="title.billlist" />,
      },
      {
        path: 'administrator/billlist/bill',
        element: <WrapperRouteComponent requireAuth={true} element={<BillPage />} titleId="title.bill" />,
      },
      {
        path: 'administrator/wallet',
        element: <WrapperRouteComponent requireAuth={true} element={<WalletPage />} titleId="title.bill" />,
      },
      {
        path: 'administrator/wallet/calculate',
        element: <WrapperRouteComponent requireAuth={true}  element={<WalletCalculatePage />} titleId="title.billlist" />,
      },
      {
        path: 'administrator/wallet/history',
        element: <WrapperRouteComponent requireAuth={true}  element={<WalletHistoryPage />} titleId="title.billlist" />,
      },
      {
        path: 'administrator/caltree',
        element: <WrapperRouteComponent requireAuth={true} element={<CalTreePage />} titleId="title.caltree" />,
      },
      {
        path: 'administrator/caltree/caltreehistorylist',
        element: <WrapperRouteComponent requireAuth={true}  element={<CalTreeHistoryListPage />} titleId="title.caltreehistorylist" />,
      },
      {
        path: 'administrator/noticelist',
        element: <WrapperRouteComponent requireAuth={true} element={<NoticeListPage />} titleId="title.noticelist" />,
      },
      {
        path: 'administrator/userlist/user',
        element: <WrapperRouteComponent requireAuth={true} isAdmin={true} element={<UserPage />} titleId="title.insurance" />,
      },
      {
        path: 'administrator/userlist/tree',
        element: <WrapperRouteComponent requireAuth={true} element={<TreePage />} titleId="title.insurance" />,
      },
      // 
      {
        path: 'administrator/userlist/tree/orgchart',
        element: <WrapperRouteComponent requireAuth={true} element={<OrgChartPage />} titleId="title.insurance" />,
      },
      {
        path: 'administrator/faker',
        element: <WrapperRouteComponent requireAuth={true} isAdmin={true} element={<FakerPage />} titleId="title.insurance" />,
      },
      {
        path: 'administrator/import',
        element: <WrapperRouteComponent requireAuth={true} isAdmin={true} element={<ImportPage />} titleId="title.insurance" />,
      },
      {
        path: 'settings/listagent',
        element: <WrapperRouteComponent requireAuth={true} isAdmin={true} element={<ListAgentPage />} titleId="title.insurance" />,
      },
      {
        path: 'settings/listagent/agent',
        element: <WrapperRouteComponent requireAuth={true} isAdmin={true} element={<AgentPage />} titleId="title.insurance" />,
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
        element: <WrapperRouteComponent requireAuth={true} element={<RoutePermission />} titleId="title.permission.route" />,
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
        element: <WrapperRouteComponent requireAuth={true} isAdmin={true} element={<SettingsPage />} titleId="title.settings" />,
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
