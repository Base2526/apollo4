import type { RootState } from '@/stores'; // Import the RootState type
import type { Dispatch } from '@reduxjs/toolkit';

type ThunkAction<T = any> = (dispatch: Dispatch, state: () => RootState) => Promise<T>;

export const createAsyncAction = <T = any, R = any>(cb: (arg: T) => ThunkAction<R>) => {
  return cb;
};

