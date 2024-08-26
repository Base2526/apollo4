// store.ts
import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import { encrypt, decrypt } from './encryption'; // Import your encryption functions
import rootReducer from './rootReducer'; // Your root reducer

// Configure Redux Persist
const persistConfig = {
                        key: 'root',
                        storage,
                        transforms: [{
                                      in: (state: any) => import.meta.env.DEV ? JSON.stringify(state) : encrypt(JSON.stringify(state)), // Encrypt the state before persisting
                                      out: (state: string) => import.meta.env.DEV ? JSON.parse(state) : JSON.parse(decrypt(state)), // Decrypt the state when rehydrating
                                    }]
                      };
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);

export { store, persistor };

// Add this line if AppStore is a type
export type AppStore = ReturnType<typeof store.getState>;