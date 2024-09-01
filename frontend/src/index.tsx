import './styles/index.less';
import './mock';


// import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client'; // Import createRoot
import { Provider } from "react-redux";
import { ApolloProvider } from '@apollo/client';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App';
import { store, persistor } from './stores';

import client from './apollo/ConfigureApolloClient';
// import { getCookie } from './utils'

const container = document.getElementById('root'); // Get the root element
const root = createRoot(container!); // Create a root

root.render(<Provider store={store}>
              <PersistGate loading={<p>Loading...</p>} persistor={persistor}>
                <ApolloProvider client={client}>
                  <App />
                </ApolloProvider>
              </PersistGate>
            </Provider>); // Render the App component