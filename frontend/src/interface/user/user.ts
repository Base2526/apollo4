import type { Role } from '@/interface/user/login';
import type { Device } from '@/interface/layout/index.interface';
import type { MenuChild } from '@/interface/layout/menu.interface';

export type Locale = 'zh_CN' | 'en_US' | 'th_TH';

interface profileType{
  _id?: string;
  current?: {
    displayName: string
  };
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
    quantity: number;
    quantities?: number;
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

export interface OrderOwner {
  _id: string;
  current: {
    productId: string[];  // Array of product IDs
    ownerId: string;      // Owner ID
    status: number;       // Status (number type)
  };
  history: any[];        // Array for history, type can be more specific if known
  createdAt: string;    // ISO 8601 date string
  updatedAt: string;    // ISO 8601 date string
  // Add other properties if present in the `creator` object
}

interface OrderIds{
  productId: string;
  quantities: number;
}

export interface OrderProductDetail {
    _id: string;
    current: {
      name: string;
      price: number;
    }
}

export interface OrderItem {
  createdAt: string;
  owner: OrderOwner;
  current: {
    productIds: OrderIds[];
    ownerId: string;
    status: number;
    editer?: string;
    message?: string;
    attachFile?: any[];
  };
  editer: profileType;
  history: any[];
  ownerId: string;
  productDetails: OrderProductDetail[];
  productIds: string[];
  updatedAt: string;
  _id: string;
}

