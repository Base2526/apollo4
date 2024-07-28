import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import _ from "lodash"
import { useMutation } from "@apollo/client";

import { getHeaders } from "../util";
import AttackFileField from "../components/AttackFileField";
import { mutationTest_upload } from "../apollo/gqlQuery"
const Home = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [input, setInput]       = useState({files: []});
    const { user, logout } = props
    
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
    
    return (<div>Home page</div>);
};

export default Home