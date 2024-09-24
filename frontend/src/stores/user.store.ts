import type { Role } from '@/interface/user/login';
import type { Locale, UserState } from '@/interface/user/user';
import type { PayloadAction } from '@reduxjs/toolkit';
import _ from "lodash"
import { createSlice } from '@reduxjs/toolkit';

import { getGlobalState } from '@/utils/getGloabal';

import { ProductItem } from "@/interface/user/user"

const initialState: UserState = {
  ...getGlobalState(),
  noticeCount: 0,
  locale: (localStorage.getItem('locale')! || 'en_US') as Locale,
  newUser: JSON.parse(localStorage.getItem('newUser')!) ?? true,
  logged: localStorage.getItem('t') ? true : false,
  menuList: [],
  username: localStorage.getItem('username') || '',
  role: (localStorage.getItem('username') || '') as Role,

  ramdom: 0,

  profile:{},

  carts:[]
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserItem(state, action: PayloadAction<Partial<UserState>>) {
      const { username } = action.payload;

      if (username !== state.username) {
        localStorage.setItem('username', action.payload.username || '');
      }

      Object.assign(state, action.payload);
    },
    testSetRamdom(state, action: PayloadAction<Partial<UserState>> ){
      console.log("testSetRamdom :",state, action.payload)

      Object.assign(state, action.payload);
    },
    updateProfile(state, action: PayloadAction<Partial<UserState>> ){
      console.log("updateProfile :",state, action.payload)

      Object.assign(state, { ...action.payload, logged: true });
    },
    // for cart
    addCart: (state, action: PayloadAction<ProductItem>) => {
      // state.cart.push(action.payload);
      let item =_.cloneDeep(action.payload); // _.cloneDeep(item)
      // Check if item already exists in the cart
      if (!state.carts.some(existingItem => existingItem._id === item._id)) {
        item = _.set(item, 'current.quantities', 1);
        state.carts.push(item);
      }
    },
    removeCart: (state, action: PayloadAction<string>) => {
      state.carts = state.carts.filter(item => item._id !== action.payload);
    },
    clearAllCart: (state) => {
      state.carts = [];
    },
    // for cart

    updateCartQuantities: (state, action: PayloadAction<{ id: string; quantities: number }>) => {
      let {id, quantities} = action.payload
      state.carts = _.map( state.carts, item =>
                        item._id === id
                          ? { ...item, current: { ...item.current, quantities } }
                          : item
                      );
    },
  },
});

export const { setUserItem, testSetRamdom, updateProfile, addCart, removeCart, clearAllCart, updateCartQuantities } = userSlice.actions;

export default userSlice.reducer;
