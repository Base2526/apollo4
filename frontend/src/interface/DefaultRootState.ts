import type { UserState } from '@/interface/user/user';
export interface DefaultRootState  {
    user: UserState;
    global: any;
    tagsView: any;
}