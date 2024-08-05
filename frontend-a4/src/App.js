import React, { useEffect } from "react";
import { Routes, Route, Outlet, Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import _ from "lodash"
import { useApolloClient, useSubscription } from "@apollo/client";
import UAParser from 'ua-parser-js';
import { ToastContainer } from 'react-toastify';

import HomePage   from "./mlm/HomePage"
import FakerPage  from "./faker/FakerPage"
import LoginPage  from "./mlm/LoginPage"
import MlmPage    from "./mlm/MlmPage"
import ShowsPage  from "./mlm/ShowsPage"
import DblogPage  from "./mlm/DblogPage"
import UsersPage  from "./mlm/UsersPage"
import UserPage   from "./mlm/UserPage"

import FilePage  from "./mlm/FilePage"
import FilesPage  from "./mlm/FilesPage"
import BreadcsComp from "./components/BreadcsComp";

import { update_profile as updateProfile, logout } from "./redux/actions/auth";
import { checkRole, getHeaders, handlerErrorApollo, showToast } from "./util";
import * as Constants from "./constants"


import { healthCheck, userConnected } from "./apollo/gqlQuery"

const ProtectedAuthenticatedRoute = ({ user, redirectPath = '/' }) => {
  switch(checkRole(user)){
    case Constants.AUTHENTICATED:
      return <Outlet />;
    default:
      return <Navigate to={redirectPath} replace />;
  }
};

const ProtectedAdministratorRoute = ({ user, redirectPath = '/' }) => {
  switch(checkRole(user)){
    case Constants.AMDINISTRATOR:
      return <Outlet />;
    default:
      return <Navigate to={redirectPath} replace />;
  }
};

const NoMatch = () => {
    return (
      <div>
        <h2>Nothing to see here!</h2>
        <p>
          <Link to="/">Go to the home page</Link>
        </p>
      </div>
    );
};
  
const Layout = (props) => {
  const navigate = useNavigate();
  const { user, logout, refetchHealthCheck } = props
  console.log("Layout : ", props)
  return (
    <div>
      <ToastContainer />
      <nav>
        <ul>
          <li>
            <Link to="/">หน้าหลัก</Link>
            <button onClick={()=>refetchHealthCheck()}>refetchHealthCheck</button>
          </li>
          {
            !_.isEmpty(user)
            ?  checkRole(user) === Constants.AMDINISTRATOR
              ? <div>
                  <div>
                    <h4>Display name :{ user?.current?.displayName } ({ user?.current?.roles?.toString() })</h4>
                  </div>
                  <div>
                    <h4>Emai :{ user?.current?.email }</h4>
                  </div>
                  <div>
                    <button onClick={()=>{ navigate('/faker') }}>Faker</button>
                    <button onClick={()=>{ navigate('/users') }}>Users</button>
                    <button onClick={()=>{ navigate('/files') }}>Files</button>
                    <button onClick={()=>{ navigate('/dblog') }}>Dblog</button>
                  </div>
                  <div>
                    <button onClick={()=>{ logout(); navigate(0); }}>Logout</button>
                  </div>
                </div>
              : <div>
                  <button onClick={()=>{ navigate('/file') }}>Add File</button>
                  <button onClick={()=>{ navigate('/mlm') }}>เพิ่ม Tree</button>
                  <button onClick={()=>{ navigate('/shows') }}>แสดง Tree</button>
                  <div>
                    <h4>Display name :{ user?.current?.displayName } ({ user?.current?.roles?.toString() })</h4>
                  </div>
                  <div>
                    <h4>Emai :{ user?.current?.email }</h4>
                  </div>
                  <div>
                    <button onClick={()=>{ logout(); navigate(0); }}>Logout</button>
                  </div>
                </div>
            : <button onClick={()=>{ navigate('/login') }}>Login first</button>
          }
        </ul>
      </nav>
      <hr />
      <BreadcsComp  {...props}/>
      <Outlet />
    </div>
  );
};

const App = (props) => {
  const client = useApolloClient();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = props
  const parser = new UAParser();
  const result = parser.getResult();

  useSubscription(userConnected);

  const refetchHealthCheck = async () => {
    try {
      let el =  await client.query({ query: healthCheck, context: { headers: getHeaders(location) },  fetchPolicy: 'network-only' });
      console.log("el : ", el)
    } catch (error) {
      console.log("error :", error)
      handlerErrorApollo( props, error )

      navigate(0)
    } finally {
    }
  };

  useEffect(() => {
    refetchHealthCheck(); // Initial fetch
    const intervalId = setInterval(() => {
      refetchHealthCheck();
    }, 60000); // Fetch data every 1 minute

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout {...props} refetchHealthCheck={()=>refetchHealthCheck()}  />}>
        <Route index element={<HomePage {...props} />} />
        <Route path="login" element={<LoginPage {...props} onRefresh={()=>{ navigate(0); showToast("info", "เข้าสู่ระบบ") }} />} />
        <Route element={<ProtectedAuthenticatedRoute user={user} />}>
          <Route path="mlm" element={<MlmPage {...props}/>} />
          <Route path="shows" element={<ShowsPage  {...props}/>} />
          <Route path="file" element={<FilePage />} />
        </Route>
        <Route element={<ProtectedAdministratorRoute user={user} />}>
          <Route path="users" element={<UsersPage />} />
          <Route path="user" element={<UserPage {...props} /* onMutationMe={(evt)=>onMutationMe(evt)}*/ /> } />
          <Route path="dblog" element={<DblogPage />} />
          <Route path="files" element={<FilesPage />} />
          <Route path="faker" element={<FakerPage />} />
        </Route>
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  );
};

const mapStateToProps = (state, ownProps) => {
  return { 
          user:state.auth.user, 
          ws: state.ws,
          conversations: state.auth.conversations, 
        }
}

const mapDispatchToProps = {
  updateProfile,
  logout,
}

export default connect( mapStateToProps, mapDispatchToProps )(App)