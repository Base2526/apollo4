import type { Role } from '@/interface/user/login';
import type { Device } from '@/interface/layout/index.interface';
import type { MenuChild } from '@/interface/layout/menu.interface';

export type Locale = 'zh_CN' | 'en_US' | 'th_TH';

interface profileType{
  _id?: string;
  current?: object;
  history?: [];
}

interface imageType{
  userId: string;
  url: string;
  filename: string;
  mimetype: string;
  encoding: string;
}

export interface ProductItem {
  _isDEV: boolean;
  _id: string;
  current: {
    ownerId: string;
    name: string;
    detail: string;
    plan: number[];
    price: string;
    packages: number[];
    images: imageType[];
  }
  history: [];
  createdAt: string;
  updatedAt: string;
}

export interface UserState {
  username: string;

  /** menu list for init tagsView */
  menuList: MenuChild[];

  /** login status */
  logged: boolean;

  role: Role;

  /** user's device */
  device: Device;

  /** menu collapsed status */
  collapsed: boolean;

  /** notification count */
  noticeCount: number;

  /** user's language */
  locale: Locale;

  /** Is first time to view the site ? */
  newUser: boolean;

  /* for test */
  ramdom: number;

  /* for profile */
  profile: profileType;

  /* for cart */
  carts: ProductItem[];
}
