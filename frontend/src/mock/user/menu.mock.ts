import type { MenuList } from '@/interface/layout/menu.interface';
import { intercepter, mock } from '../config';

const mockMenuList: MenuList = [
  {
    code: 'insurance',
    label: {
      zh_CN: 'พ.ร.บ',
      en_US: 'พ.ร.บ',
      th_TH: 'พ.ร.บ',
    },
    icon: 'insurance',
    path: '/insurance',
    children: [
      {
        code: 'listenddosnotic',
        label: {
          zh_CN: 'สลักหลัง',
          en_US: 'สลักหลัง',
          th_TH: 'สลักหลัง',
        },
        path: '/insurance/listenddosnotic',
      },
      // {
      //   code: '',
      //   label: {
      //     zh_CN: 'วงเงินเครดิต',
      //     en_US: 'วงเงินเครดิต',
      //     th_TH: 'วงเงินเครดิต',
      //   },
      //   path: '/',
      // },
      {
        code: 'listagentcredit',
        label: {
          zh_CN: 'วงเงินคงเหลือ',
          en_US: 'วงเงินคงเหลือ',
          th_TH: 'วงเงินคงเหลือ',
        },
        path: '/insurance/listagentcredit',
      },
      // {
      //   code: '',
      //   label: {
      //     zh_CN: 'ประวัติวงเงินเครดิต',
      //     en_US: 'ประวัติวงเงินเครดิต',
      //     th_TH: 'ประวัติวงเงินเครดิต',
      //   },
      //   path: '/',
      // },
      {
        code: 'selectInsur',
        label: {
          zh_CN: 'ออกกรมธรรม์ใหม่',
          en_US: 'ออกกรมธรรม์ใหม่',
          th_TH: 'ออกกรมธรรม์ใหม่',
        },
        path: '/insurance/selectInsur',
      },
      {
        code: 'listctp',
        label: {
          zh_CN: 'กรมธรรม์ประจำวัน',
          en_US: 'กรมธรรม์ประจำวัน',
          th_TH: 'กรมธรรม์ประจำวัน',
        },
        path: 'insurance/listctp',
      },
      {
        code: 'pendinglist_ctp',
        label: {
          zh_CN: 'พรบ.รอดำเนินการ',
          en_US: 'พรบ.รอดำเนินการ',
          th_TH: 'พรบ.รอดำเนินการ',
        },
        path: '/insurance/pendinglist_ctp',
      },
      {
        code: 'listpolicyctp',
        label: {
          zh_CN: 'ทะเบียนกรมธรรม์พรบ.',
          en_US: 'ทะเบียนกรมธรรม์พรบ.',
          th_TH: 'ทะเบียนกรมธรรม์พรบ.',
        },
        path: '/insurance/listpolicyctp',
      },
      {
        code: 'policyctplistexpire',
        label: {
          zh_CN: 'กรมธรรม์หมดอายุ/ต่ออายุ',
          en_US: 'กรมธรรม์หมดอายุ/ต่ออายุ',
          th_TH: 'กรมธรรม์หมดอายุ/ต่ออายุ',
        },
        path: '/insurance/policyctplistexpire',
      },
      {
        code: 'showagentsale',
        label: {
          zh_CN: 'สรุปการขายประจำวัน',
          en_US: 'สรุปการขายประจำวัน',
          th_TH: 'สรุปการขายประจำวัน',
        },
        path: '/insurance/showagentsale',
      },
      // {
      //   code: '',
      //   label: {
      //     zh_CN: 'สรุปการขายประจำวันทีม',
      //     en_US: 'สรุปการขายประจำวันทีม',
      //     th_TH: 'สรุปการขายประจำวันทีม',
      //   },
      //   path: '/',
      // },
      // {
      //   code: '',
      //   label: {
      //     zh_CN: 'รายงานขายประจำวัน',
      //     en_US: 'รายงานขายประจำวัน',
      //     th_TH: 'รายงานขายประจำวัน',
      //   },
      //   path: '/',
      // },
      // {
      //   code: '',
      //   label: {
      //     zh_CN: 'ตัดชำระพรบ.',
      //     en_US: 'ตัดชำระพรบ.',
      //     th_TH: 'ตัดชำระพรบ.',
      //   },
      //   path: '/',
      // },
      // {
      //   code: '',
      //   label: {
      //     zh_CN: 'ยอดขายแต่ละบริษัท',
      //     en_US: 'ยอดขายแต่ละบริษัท',
      //     th_TH: 'ยอดขายแต่ละบริษัท',
      //   },
      //   path: '/',
      // },
      // {
      //   code: '',
      //   label: {
      //     zh_CN: 'ยอดขายแยกบริษัท',
      //     en_US: 'ยอดขายแยกบริษัท',
      //     th_TH: 'ยอดขายแยกบริษัท',
      //   },
      //   path: '/',
      // },
    ],
  },
  {
    code: 'report',
    label: {
      zh_CN: 'รายงาน',
      en_US: 'รายงาน',
      th_TH: 'รายงาน',
    },
    icon: 'report',
    path: '/report',
    children: [
      {
        code: 'reportctplist',
        label: {
          zh_CN: 'รายงานพรบ. ประจำวัน',
          en_US: 'รายงานพรบ. ประจำวัน',
          th_TH: 'รายงานพรบ. ประจำวัน',
        },
        path: '/report/reportctplist',
      },
      {
        code: 'reportctplistbyins',
        label: {
          zh_CN: 'รายงานพรบ.(แยกบริษัท)',
          en_US: 'รายงานพรบ.(แยกบริษัท)',
          th_TH: 'รายงานพรบ.(แยกบริษัท)',
        },
        path: '/report/reportctplistbyins',
      },
    ],
  }
];

mock.mock('/user/menu', 'get', intercepter(mockMenuList));
