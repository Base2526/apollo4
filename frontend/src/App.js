import React, { useEffect, useState } from "react";
import { Routes, Route, Outlet, Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import _ from "lodash"
import { useMutation, useApolloClient, useSubscription } from "@apollo/client";

import UAParser from 'ua-parser-js';

import FakerPage from "./faker/FakerPage"
import Login from "./mlm/Login"
import Mlm from "./mlm/Mlm"
import Shows from "./mlm/Shows"
import BreadcsComp from "./components/BreadcsComp";

import { update_profile as updateProfile, logout } from "./redux/actions/auth";
import { checkRole, getHeaders, handlerErrorApollo, showToast, setCookie, getCookie, removeCookie} from "./util";
import * as Constants from "./constants"

import { healthCheck, userConnected, mutationLottery, mutationTest_upload} from "./apollo/gqlQuery"

import AttackFileField from "./components/AttackFileField";

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

const Home = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const client = useApolloClient();

  const [input, setInput]       = useState({files: []});

  const { user, logout, refetch } = props

  // useEffect(() => {
  //   const checkServerStatus = async () => {
  //     try {
  //       const { data } = await client.query({ query: healthCheck });
  //       console.error("Health check :", data.healthCheck);
  //       // setServerStatus(data.healthCheck);
  //     } catch (error) {
  //       console.error("Health check error:", error);
  //       // setServerStatus('Server is down');
  //     }
  //   };

  //   checkServerStatus();

  //   const intervalId = setInterval(checkServerStatus, 30000); // Check every 30 seconds

  //   return () => clearInterval(intervalId);
  // }, [client]);

  // const { loading: loadingHealthCheck, 
  //         data: dataHealthCheck, 
  //         error: errorHealthCheck, 
  //         refetch: refetchHealthCheck,
  //         networkStatus } = useQuery( healthCheck, { 
  //                                     context: { headers: getHeaders(location) }, 
  //                                     // variables: {id: user?._id },
  //                                     // fetchPolicy: 'network-only', 
  //                                     // nextFetchPolicy: 'network-only', 
  //                                     notifyOnNetworkStatusChange: true
  //                                   });

  // if(!_.isEmpty(errorHealthCheck)){
  //   console.log("errorHealthCheck :", errorHealthCheck)
  // }

  // useEffect(() => {
  //   if(!loadingHealthCheck){
  //     // if (dataHealthCheck?.healthCheck) {
  //       console.log("dataHealthCheck :", dataHealthCheck)
  //     // }
  //   }
  // }, [dataHealthCheck, loadingHealthCheck])

  // useEffect(() => {
  //   const intervalId = setInterval(async() => {
  //     let xxx = await refetchHealthCheck();
  //     console.log("intervalId >> ", xxx)
  //     // setServerStatus(isUp ? 'Server is up' : 'Server is down');
  //   }, 30000); // Check every 5 seconds

  //   return () => clearInterval(intervalId); // Cleanup interval on component unmount
  // }, [refetchHealthCheck]);

  const [onMutationLottery, resultLottery] = useMutation(mutationTest_upload, {
    context: { headers: getHeaders(location) },
    update: (cache, {data: {test_upload}}) => {
      console.log("update :", test_upload)
    },
    onCompleted(data) {
        console.log("onCompleted :", data)
    },
    onError(error){
        console.log("onError :", error)
    }
  });

  if(!_.isEmpty(user)){
    return (
      <div>
        {/* <div>Server Status: {serverStatus}</div> */}
        <div>{window.location.origin}</div>
        <div>
          <div>
            <h4>Display name :{ user?.current?.displayName } ({ user?.current?.roles?.toString() })</h4>
          </div>
          <div>
            <h4>Emai :{ user?.current?.email }</h4>
          </div>
          {/*  onMutationMe({ variables: { input: {  type:'avatar', data: e.target.files[0] } } }) */}

          {/* 
          
          let newInput =  {
                                mode: "NEW",
                                title: faker.lorem.lines(1),
                                price: parseInt(makeNumber(3)),
                                priceUnit: parseInt(makeNumber(2)),
                                description: faker.lorem.paragraph(),
                                manageLottery: manageLotterys[randomNumberInRange(0, manageLotterys.length - 1)]?._id,
                                files: makeFile(5),
                                condition: parseInt(randomNumberInRange(11, 100)),    // 11-100
                                category: parseInt(randomNumberInRange(0, 3)),        // money, gold, things, etc
                                type: parseInt(randomNumberInRange(0, 1)),            // bon, lang
                                ownerId: users[randomNumberInRange(0, users.length - 1)]?._id,
                                test: true,
                            }
                            onMutationLottery({ variables: { input: newInput } });
          */}

          <div>
            <AttackFileField
              label={"attack_file" + " (อย่างน้อย  1 ไฟล์)"}
              values={input.files}
              multiple={true}
              onChange={(values) =>{ setInput({...input, files: values}) }}
              onSnackbar={(data) => console.log(data) }/>
          </div>
          <div>
          <button onClick={()=>{ onMutationLottery({ variables: { input } }) }}>Test upload</button>
          </div>
          <div>
            <button onClick={()=>{ logout(); navigate(0); }}>Logout</button>
          </div>
        </div>
        {/* <UserConnected /> */}
        <button onClick={()=>{ navigate('/mlm') }}>เพิ่ม Tree</button>
        <button onClick={()=>{ navigate('/shows') }}>แสดง Tree</button>
      </div>
    );
  }

  return (
    <div>
      {/* <UserConnected /> */}
      <button onClick={()=>{ navigate('/login') }}>Login first</button>
    </div>
  );
    
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
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">หน้าหลัก</Link>
          </li>
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

    
    console.log("@1 App result :", result, JSON.stringify(result), getCookie('usida'))

    useSubscription(userConnected);

    const refetchHealthCheck = async () => {
      try {
        await client.query({ query: healthCheck, context: { headers: getHeaders(location) },  fetchPolicy: 'network-only' });
      } catch (error) {
        console.error(error)
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
        <Route path="/" element={<Layout {...props} />}>
        {/* <button onClick={()=>refetch()}>button</button> */}
          <Route index element={<Home {...props} />} />
          <Route path="login" element={<Login {...props} onRefresh={()=>{
            navigate(0);
          }} />} />
          {/* <Route path="phoy-detail/:id" element={<PhoyDetail />} />
          <Route path="settings" element={<Settings />} />
          <Route path="limit-number-page" element={<LimitNumberPage />} /> */}
          <Route element={<ProtectedAuthenticatedRoute user={user} />}>
            <Route path="mlm" element={<Mlm />} />
            <Route path="shows" element={<Shows  {...props}/>} />
          </Route>
          <Route element={<ProtectedAdministratorRoute user={user} />}>
            <Route path="faker" element={<FakerPage />} />
          </Route>
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    );
};

// export default App;
const mapStateToProps = (state, ownProps) => {
  return { 
          user:state.auth.user, 
          ws: state.ws,
          conversations: state.auth.conversations, 
        }
}

const mapDispatchToProps = {
  // editedUserBalace,
  // editedUserBalaceBook,
  updateProfile,
  logout,

  // deletedConversation,

  // addedConversations,
  // addedConversation
}

export default connect( mapStateToProps, mapDispatchToProps )(App)