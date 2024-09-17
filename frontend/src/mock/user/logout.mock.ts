import { intercepter, mock } from '@/mock/config';

mock.mock('/user/logout', 'post', intercepter(null));
