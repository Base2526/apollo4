// import React from "react";
// import ReactDOM from "react-dom";
// import { BrowserRouter } from 'react-router-dom';

// import { HelmetProvider } from 'react-helmet-async';

// import App from "./App";

import { ApolloProvider } from "@apollo/client";
import { StrictMode } from "react";
import ReactDOM from "react-dom";
import ReactGA4 from "react-ga4";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { CssVarsProvider } from "@mui/joy/styles";

import { HelmetProvider } from 'react-helmet-async';

import { client } from "./apollo/Apollo";
import App from "./App";
import { persistor, store } from "./redux/Redux";
import Store from "./redux/Store";

let { REACT_APP_NODE_ENV, REACT_APP_GOOGLE_ANALYTICS4 } = process.env
 
// replace console.* for disable log on production
if (REACT_APP_NODE_ENV === 'production') {
  console.log = () => {}
  console.error = () => {}
  console.debug = () => {}
}

console.log("process.env :", process.env)

const rootElement = document.getElementById("root");
ReactDOM.render(
  // <React.StrictMode>
  //   <BrowserRouter>
  //       <App />
  //   </BrowserRouter>
  // </React.StrictMode>

  <HelmetProvider>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <StrictMode>
        <ApolloProvider client={client}>
          <Router>
            <Store>
              <App />
            </Store>
          </Router>
        </ApolloProvider>
      </StrictMode>
    </PersistGate>
  </Provider>
  </HelmetProvider>
  ,
  rootElement
);