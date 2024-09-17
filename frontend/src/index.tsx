import '@/styles/index.less';
import '@/mock';

import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import { Provider } from "react-redux";
import { ApolloProvider } from '@apollo/client';
import { PersistGate } from 'redux-persist/integration/react';
import { I18nextProvider } from 'react-i18next';

import App from '@/App';
import { store, persistor } from '@/stores';
import client from '@/apollo/ConfigureApolloClient';
import i18n from "@/i18n"

const container = document.getElementById('root'); // Get the root element

if (container) {
  const root = createRoot(container!); // Create a root
  root.render(<Provider store={store}>
    <I18nextProvider i18n={i18n}>
      <PersistGate loading={<p>Loading...</p>} persistor={persistor}>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </PersistGate>
    </I18nextProvider>
  </Provider>); // Render the App component
} else {
  console.error('Root element not found');
}
