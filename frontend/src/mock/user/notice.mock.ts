import type { Notice } from '@/interface/layout/notice.interface';

import { intercepter, mock } from '@/mock/config';

const mockNoticeList: Notice<'all'>[] = [
  {
    id: '000000001',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
    title: 'title-notification @1',
    datetime: '2017-08-09',
    type: 'notification',
  },
  {
    id: '000000002',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
    title: 'title-notification @2',
    datetime: '2017-08-08',
    type: 'notification',
  },
  {
    id: '000000003',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png',
    title: 'title-notification @3',
    datetime: '2017-08-07',
    read: true,
    type: 'notification',
  },
  {
    id: '000000004',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
    title: 'title-notification @4',
    datetime: '2017-08-07',
    type: 'notification',
  },
  {
    id: '000000005',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
    title: 'title-notification @5',
    datetime: '2017-08-07',
    type: 'notification',
  },
  {
    id: '000000006',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
    title: 'title-message @1',
    description: 'description-message @1',
    datetime: '2017-08-07',
    type: 'message',
    clickClose: true,
  },
  {
    id: '000000007',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
    title: 'title-message @2',
    description: 'description-message @2',
    datetime: '2017-08-07',
    type: 'message',
    clickClose: true,
  },
  {
    id: '000000008',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
    title: 'title-message @3',
    description: 'description-message @3',
    datetime: '2017-08-07',
    type: 'message',
    clickClose: true,
  },
  {
    id: '000000009',
    title: 'title-event @1',
    description: 'description-event @1',
    extra: 'extra-event @1',
    status: 'todo',
    type: 'event',
  },
  {
    id: '000000010',
    title: 'title-event @2',
    description: 'description-event @2',
    extra: 'extra-event @2',
    status: 'urgent',
    type: 'event',
  },
  {
    id: '000000011',
    title: 'title-event @3',
    description: 'description-event @3',
    extra: 'extra-event @3',
    status: 'doing',
    type: 'event',
  },
  {
    id: '000000012',
    title: 'title-event @4',
    description: 'description-event @4',
    extra: 'extra-event @4',
    status: 'processing',
    type: 'event',
  },
];

mock.mock('/user/notice', 'get', intercepter(mockNoticeList));
