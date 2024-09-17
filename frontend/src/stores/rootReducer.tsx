import { combineReducers } from '@reduxjs/toolkit';

import globalReducer from '@/stores/global.store';
import tagsViewReducer from '@/action/tags-view.store';
import userReducer from './user.store';

const rootReducer = combineReducers({
  user: userReducer,
  tagsView: tagsViewReducer,
  global: globalReducer,
});

export default rootReducer;
