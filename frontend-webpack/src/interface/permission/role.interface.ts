export type RoleStatus = 'enabled' | 'disabled';
export interface Role {
  name: {
    zh_CN: string;
    en_US: string;
    th_TH: string;
  };
  code: string;
  id: number;
  status: RoleStatus;
}

export type GetRoleResult = Role[];
