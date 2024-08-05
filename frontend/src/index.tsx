import './styles/index.less';
import './mock';

// new 
// import ReactDOM from 'react-dom';
// import { StrictMode } from "react";
// import { ApolloProvider } from "@apollo/client";
// import { Provider } from "react-redux";
// import { BrowserRouter as Router } from "react-router-dom";
// import { PersistGate } from "redux-persist/integration/react";

// import { client } from "./apollo/Apollo";
// import App from "./App";
// import { persistor, store } from "./redux/Redux";
// import Store from "./redux/Store";
// new 

import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { ApolloProvider } from '@apollo/client';
import App from './App';
import store from './stores';

import client from './apollo/ConfigureApolloClient';


ReactDOM.render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Provider>

  // <Provider store={store}>
  //   <PersistGate loading={null} persistor={persistor}>
  //     <StrictMode>
  //       <ApolloProvider client={client}>
  //         <Router>
  //           {/* <Store> */}
  //             <App />
  //           {/* </Store> */}
  //         </Router>
  //       </ApolloProvider>
  //     </StrictMode>
  //   </PersistGate>
  // </Provider>
  ,
  document.getElementById('root'),
);
