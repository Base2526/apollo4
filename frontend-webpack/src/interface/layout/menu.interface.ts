// Define the type for valid locale keys
type Locale = 'zh_CN' | 'en_US' | 'th_TH';

interface MenuItem {
  /** menu item code */
  code: string;
  /** menu labels */
  // label: {
  //   zh_CN: string;
  //   en_US: string;
  //   th_TH: string;
  // };
   /** menu labels */
  label: Record<Locale, string>;
  /** 图标名称
   *
   * 子子菜单不需要图标
   */
  icon?: string;
  /** 菜单路由 */
  path: string;
  /** 子菜单 */
  children?: MenuItem[];
}

/*
 code?: string;
  path?: string;
  children?: Child[];
  label: Record<Locale, string>;
*/

export type MenuChild = Omit<MenuItem, 'children'>;

export type MenuList = MenuItem[];
