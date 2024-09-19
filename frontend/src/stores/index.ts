import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import { encrypt, decrypt } from './encryption'; // Import your encryption functions
import rootReducer from './rootReducer'; // Your root reducer

// Define the root state type
export type RootState = ReturnType<typeof rootReducer>;

// console.log("process.env :", process.env)
const { mode } = process.env;

// Configure Redux Persist
const persistConfig = {
  key: 'root',
  storage,
  transforms: [
    {
      in: (state: any) => mode !== 'development' ?  encrypt(JSON.stringify(state)) : JSON.stringify(state), // Encrypt the state before persisting
      out: (state: string) => mode !== 'development' ? JSON.parse(decrypt(state)) : JSON.parse(state), // Decrypt the state when rehydrating
      // in: (state: any) => JSON.stringify(state) , // Encrypt the state before persisting
      // out: (state: string) => JSON.parse(state) , // Decrypt the state when rehydrating
    }
  ]
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);

export { store, persistor };

// Export the state type
export type AppStore = typeof store;