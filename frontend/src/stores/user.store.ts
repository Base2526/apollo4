import type { Role } from '@/interface/user/login';
import type { Locale, UserState } from '@/interface/user/user';
import type { PayloadAction } from '@reduxjs/toolkit';
import _ from "lodash"
import { createSlice } from '@reduxjs/toolkit';
import { getGlobalState } from '@/utils/getGloabal';
import { ProductItem, Current } from "@/interface/user/user"

import { setCookie }  from "@/utils"

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

  profile:{
    current: {
      positionIds: [{
        version: 0,
        positionId: '',
        updatedAt: ''
      }]
    },
    usida: ''
  },
  usida: '',

  carts:[],

  cart_plan_front: [],  // Array to hold items for the front cart
  cart_plan_back: []    // Array to hold items for the back cart
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
    login(state, action: PayloadAction<Partial<UserState>> ){
      console.log("login :",state, action.payload, action.payload.profile?.usida)

      Object.assign(state, { ...action.payload, logged: true, usida: action.payload.profile?.usida });
    },
    updateProfile(state, action: PayloadAction<Partial<UserState>> ){
      console.log("updateProfile :",state, action.payload)

      Object.assign(state, { ...action.payload });
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
    updateAddressDelivery: (state, action: PayloadAction<{ addressDelivery: { name: string; phone: string; address: string; } }>) => {
      state.profile = {
        ...state.profile,
        current: {
          ...state.profile.current,
          address_delivery: action.payload.addressDelivery, // assigning to address_delivery if it is the correct property name
        },
      };
    },
    deleteAddressDelivery: (state) => {
      state.profile = {
        ...state.profile,
        current: {
          ...state.profile.current,
          address_delivery: undefined, // assigning to address_delivery if it is the correct property name
        },
      };
    },

    logout: (state) => {
      // Reset the state to initialState by returning it directly
      setCookie('usida', '');
      

      return initialState;
    },

    //  add Cart plan front actions
    add_cart_plan_front: (state, action: PayloadAction<ProductItem>) => {
      let item = _.cloneDeep(action.payload);
      if (!state.cart_plan_front.some(existingItem => existingItem._id === item._id)) {
        item = _.set(item, 'current.quantities', 1);
        state.cart_plan_front.push(item);
      }
    },
    clearAllCart_plan_front: (state) => {
      state.cart_plan_front = [];
    },
    removeCart_plan_front: (state, action: PayloadAction<string>) => {
      state.cart_plan_front = state.cart_plan_front.filter(item => item._id !== action.payload);
    },

    // Cart plan back actions
    add_cart_plan_back: (state, action: PayloadAction<ProductItem>) => {
      let item = _.cloneDeep(action.payload);
      if (!state.cart_plan_back.some(existingItem => existingItem._id === item._id)) {
        item = _.set(item, 'current.quantities', 1);
        state.cart_plan_back.push(item);
      }
    },
    // Update quantities in cart_plan_front
    updateQuantities_front: (state, action: PayloadAction<{ id: string; quantities: number }>) => {
      const { id, quantities } = action.payload;
      state.cart_plan_front = state.cart_plan_front.map(item =>
        item._id === id ? { ...item, current: { ...item.current, quantities } } : item
      );
    },

    // Update quantities in cart_plan_back
    updateQuantities_back: (state, action: PayloadAction<{ id: string; quantities: number }>) => {
      const { id, quantities } = action.payload;
      state.cart_plan_back = state.cart_plan_back.map(item =>
        item._id === id ? { ...item, current: { ...item.current, quantities } } : item
      );
    },

    clearAllCart_plan_back: (state) => {
      state.cart_plan_back = [];
    },
    removeCart_plan_back: (state, action: PayloadAction<string>) => {
      state.cart_plan_back = state.cart_plan_back.filter(item => item._id !== action.payload);
    },
  },
});

export const {  setUserItem, 
                testSetRamdom, 
                updateProfile, 
                login,
                addCart, 
                removeCart, 
                clearAllCart, 

                add_cart_plan_front,
                clearAllCart_plan_front,
                removeCart_plan_front,
                updateQuantities_front,

                add_cart_plan_back,
                clearAllCart_plan_back,
                removeCart_plan_back,
                updateQuantities_back,

                updateCartQuantities, 
                updateAddressDelivery,
                deleteAddressDelivery, 
                logout } = userSlice.actions;

export default userSlice.reducer;
