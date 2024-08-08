import type { MenuList } from '@/interface/layout/menu.interface';

import { CreditCardOutlined, PayCircleOutlined, PropertySafetyOutlined as PaypalOutlined } from '@ant-design/icons';


import { intercepter, mock } from '../config';

const mockMenuList: MenuList = [
  {
    code: 'home',
    label: {
      zh_CN: 'หน้าหลัก',
      en_US: 'หน้าหลัก',
    },
    icon: 'home',
    path: '/',
  },
  {
    code: 'insurance',
    label: {
      zh_CN: 'พ.ร.บ',
      en_US: 'พ.ร.บ',
    },
    icon: 'insurance',
    path: '/insurance',
    children: [
      {
        code: 'listenddosnotic',
        label: {
          zh_CN: 'สลักหลัง',
          en_US: 'สลักหลัง',
        },
        path: '/insurance/listenddosnotic',
      },
      {
        code: '',
        label: {
          zh_CN: 'วงเงินเครดิต',
          en_US: 'วงเงินเครดิต',
        },
        path: '/',
      },
      {
        code: 'listagentcredit',
        label: {
          zh_CN: 'วงเงินคงเหลือ',
          en_US: 'วงเงินคงเหลือ',
        },
        path: '/insurance/listagentcredit',
      },
      {
        code: '',
        label: {
          zh_CN: 'ประวัติวงเงินเครดิต',
          en_US: 'ประวัติวงเงินเครดิต',
        },
        path: '/',
      },
      {
        code: 'selectInsur',
        label: {
          zh_CN: 'ออกกรมธรรม์ใหม่',
          en_US: 'ออกกรมธรรม์ใหม่',
        },
        path: '/insurance/selectInsur',
      },
      {
        code: 'listInsurance',
        label: {
          zh_CN: 'กรมธรรม์ประจำวัน',
          en_US: 'กรมธรรม์ประจำวัน',
        },
        path: '/insurance/listInsurance',
      },
      {
        code: 'pendinglist_ctp',
        label: {
          zh_CN: 'พรบ.รอดำเนินการ',
          en_US: 'พรบ.รอดำเนินการ',
        },
        path: '/insurance/pendinglist_ctp',
      },
      {
        code: 'listpolicyctp',
        label: {
          zh_CN: 'ทะเบียนกรมธรรม์พรบ.',
          en_US: 'ทะเบียนกรมธรรม์พรบ.',
        },
        path: '/insurance/listpolicyctp',
      },
      {
        code: 'policyctplistexpire',
        label: {
          zh_CN: 'กรมธรรม์หมดอายุ/ต่ออายุ',
          en_US: 'กรมธรรม์หมดอายุ/ต่ออายุ',
        },
        path: '/insurance/policyctplistexpire',
      },
      {
        code: 'showagentsale',
        label: {
          zh_CN: 'สรุปการขายประจำวัน',
          en_US: 'สรุปการขายประจำวัน',
        },
        path: '/insurance/showagentsale',
      },
      {
        code: '',
        label: {
          zh_CN: 'สรุปการขายประจำวันทีม',
          en_US: 'สรุปการขายประจำวันทีม',
        },
        path: '/',
      },
      {
        code: '',
        label: {
          zh_CN: 'รายงานขายประจำวัน',
          en_US: 'รายงานขายประจำวัน',
        },
        path: '/',
      },
      {
        code: '',
        label: {
          zh_CN: 'ตัดชำระพรบ.',
          en_US: 'ตัดชำระพรบ.',
        },
        path: '/',
      },
      {
        code: '',
        label: {
          zh_CN: 'ยอดขายแต่ละบริษัท',
          en_US: 'ยอดขายแต่ละบริษัท',
        },
        path: '/',
      },
      {
        code: '',
        label: {
          zh_CN: 'ยอดขายแยกบริษัท',
          en_US: 'ยอดขายแยกบริษัท',
        },
        path: '/',
      },
    ],
  },
  // {
  //   code: 'main-data',
  //   label: {
  //     zh_CN: 'ข้อมูลหลัก',
  //     en_US: 'ข้อมูลหลัก',
  //   },
  //   icon: 'main-data',
  //   path: '/',
  //   children: [
  //     {
  //       code: 'routePermission',
  //       label: {
  //         zh_CN: 'ตัวแทน',
  //         en_US: 'ตัวแทน',
  //       },
  //       path: '/',
  //     },
  //     {
  //       code: 'notFound',
  //       label: {
  //         zh_CN: 'โครงสร้างตัวแทน',
  //         en_US: 'โครงสร้างตัวแทน',
  //       },
  //       path: '/',
  //     },
  //     {
  //       code: '',
  //       label: {
  //         zh_CN: 'คำนำหน้า',
  //         en_US: 'คำนำหน้า',
  //       },
  //       path: '/',
  //     },
  //     {
  //       code: '',
  //       label: {
  //         zh_CN: 'จังหวัด/อำเภอ/ตำบล',
  //         en_US: 'จังหวัด/อำเภอ/ตำบล',
  //       },
  //       path: '/',
  //     },
  //     {
  //       code: '',
  //       label: {
  //         zh_CN: 'รายการรถ',
  //         en_US: 'รายการรถ',
  //       },
  //       path: '/',
  //     },
  //     {
  //       code: '',
  //       label: {
  //         zh_CN: 'รายการรุ่นรถ',
  //         en_US: 'รายการรุ่นรถ',
  //       },
  //       path: '/',
  //     },
  //     {
  //       code: '',
  //       label: {
  //         zh_CN: 'รายการรหัสรถ',
  //         en_US: 'รายการรหัสรถ',
  //       },
  //       path: '/',
  //     },
  //     {
  //       code: '',
  //       label: {
  //         zh_CN: 'รายการสีรถ',
  //         en_US: 'รายการสีรถ',
  //       },
  //       path: '/',
  //     },
  //     {
  //       code: '',
  //       label: {
  //         zh_CN: 'Package รถยนต์',
  //         en_US: 'Package รถยนต์',
  //       },
  //       path: '/',
  //     },
  //     {
  //       code: '',
  //       label: {
  //         zh_CN: 'กลุ่มรถตามค่าคอมมิชชั่น',
  //         en_US: 'กลุ่มรถตามค่าคอมมิชชั่น',
  //       },
  //       path: '/',
  //     },
  //     {
  //       code: '',
  //       label: {
  //         zh_CN: 'ตารางผลประโยชน์',
  //         en_US: 'ตารางผลประโยชน์',
  //       },
  //       path: '/',
  //     },
  //     {
  //       code: '',
  //       label: {
  //         zh_CN: 'วงเงินสด',
  //         en_US: 'วงเงินสด',
  //       },
  //       path: '/',
  //     },
  //     {
  //       code: '',
  //       label: {
  //         zh_CN: 'ประวัติรายการเคลื่อนไหว',
  //         en_US: 'ประวัติรายการเคลื่อนไหว',
  //       },
  //       path: '/',
  //     },
  //     {
  //       code: '',
  //       label: {
  //         zh_CN: 'นำเข้าข้อมูล',
  //         en_US: 'นำเข้าข้อมูล',
  //       },
  //       path: '/',
  //     },
  //   ],
  // },
  {
    code: 'report',
    label: {
      zh_CN: 'รายงาน',
      en_US: 'รายงาน',
    },
    icon: 'report',
    path: '/report',
    children: [
      {
        code: 'reportctplist',
        label: {
          zh_CN: 'รายงานพรบ. ประจำวัน',
          en_US: 'รายงานพรบ. ประจำวัน',
        },
        path: '/report/reportctplist',
      },
      {
        code: 'reportctplistbyins',
        label: {
          zh_CN: 'รายงานพรบ.(แยกบริษัท)',
          en_US: 'รายงานพรบ.(แยกบริษัท)',
        },
        path: '/report/reportctplistbyins',
      },
    ],
  },
  /*
  {
    code: 'component',
    label: {
      zh_CN: '组件',
      en_US: 'Component',
    },
    icon: 'permission',
    path: '/component',
    children: [
      {
        code: 'componentForm',
        label: {
          zh_CN: '表单',
          en_US: 'Form',
        },
        path: '/component/form',
      },
      {
        code: 'componentTable',
        label: {
          zh_CN: '表格',
          en_US: 'Table',
        },
        path: '/component/table',
      },
      {
        code: 'componentSearch',
        label: {
          zh_CN: '查询',
          en_US: 'Search',
        },
        path: '/component/search',
      },
      {
        code: 'componentAside',
        label: {
          zh_CN: '侧边栏',
          en_US: 'Aside',
        },
        path: '/component/aside',
      },
      {
        code: 'componentTabs',
        label: {
          zh_CN: '选项卡',
          en_US: 'Tabs',
        },
        path: '/component/tabs',
      },
      {
        code: 'componentRadioCards',
        label: {
          zh_CN: '单选卡片',
          en_US: 'Radio Cards',
        },
        path: '/component/radio-cards',
      },
    ],
  },

  {
    code: 'business',
    label: {
      zh_CN: '业务',
      en_US: 'Business',
    },
    icon: 'permission',
    path: '/business',
    children: [
      {
        code: 'basic',
        label: {
          zh_CN: '基本',
          en_US: 'Basic',
        },
        path: '/business/basic',
      },
      {
        code: 'withSearch',
        label: {
          zh_CN: '带查询',
          en_US: 'WithSearch',
        },
        path: '/business/with-search',
      },
      {
        code: 'withAside',
        label: {
          zh_CN: '带侧边栏',
          en_US: 'WithAside',
        },
        path: '/business/with-aside',
      },
      {
        code: 'withRadioCard',
        label: {
          zh_CN: '带单选卡片',
          en_US: 'With Nav Tabs',
        },
        path: '/business/with-radio-cards',
      },
      {
        code: 'withTabs',
        label: {
          zh_CN: '带选项卡',
          en_US: 'With Tabs',
        },
        path: '/business/with-tabs',
      },
    ],
  },
  */
];

mock.mock('/user/menu', 'get', intercepter(mockMenuList));
