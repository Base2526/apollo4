import type { Role } from '@/interface/user/login';
import type { Device } from '@/interface/layout/index.interface';
import type { MenuChild } from '@/interface/layout/menu.interface';

export type Locale = 'zh_CN' | 'en_US' | 'th_TH';

/*
interface profileType{
  _id?: string;
  current?: {
    displayName: string
  };
  history?: [];
}
*/

interface Avatar {
  url?: string;
  filename?: string;
  mimetype?: string;
  encoding?: string;
}

interface LockAccount {
  lock: boolean;
  date: Date;
}

export interface PositionInterface {
  _id: string;
  level: number;
  name: string;
  percent: number;
  budget: number;
}

interface Current {
  parentId?: string ;  // Assuming Schema.Types.ObjectId is string
  username?: string;
  password?: string;
  email?: string;
  tel?: string;
  displayName?: string;
  idCard?: string;
  address?: string;
  packages?: 1 | 2 | 3;
  roles?: number[];  // AUTHENTICATED, ADMINISTRATOR enum values would be numbers
  isActive?: 0 | 1;
  avatar?: Avatar;
  position?: string;
  positionId?: string;
  address_delivery?: {
    name: string;
    phone: string;
    address: string;
  }
  lockAccount?: LockAccount;
  lastAccess?: Date;
}

export interface ProfileType {
  _id?: string;
  current?: Current;
  history?: History[]; // Assuming `historySchema` has been defined elsewhere as `History`
}

export interface ProductImageType{
  userId: string;
  url: string;
  filename: string;
  mimetype: string;
  encoding: string;
}

export interface ProductCurrentItem{
  ownerId: string;
  name: string;
  price: string;
  price_sell: string;
  detail: string;
  quantity: number;
  price_front: number;
  product_type: number[];
  option_front: number[];
  package_front: number[];
  option_back: number[];
  package_back: number[];
  plan: number[];
  packages: number[];
  price_discount_bm: number;
  price_discount_bs: number;
  price_discount_from_children: number;
  price_discount_from_office: number;
  all_sale: number;
  price_delivery: number;
  images: ProductImageType[];
  quantities: number;
  vat: number;
}
export interface ProductItem {
  _isDEV: boolean;
  _id: string;
  current: ProductCurrentItem;
  owner:any;
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
  profile: ProfileType;

  /* for cart */
  carts: ProductItem[];

  cart_plan_front: ProductItem[],  // Array to hold items for the front cart
  cart_plan_back: ProductItem[]    // Array to hold items for the back cart
}

export interface OrderOwner {
  _id: string;
  current: {
    displayName: string;
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
  editer: ProfileType;
  history: any[];
  ownerId: string;
  productDetails: OrderProductDetail[];
  productIds: string[];
  updatedAt: string;
  _id: string;
}

