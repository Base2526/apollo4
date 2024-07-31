import React, {useEffect, useState} from 'react';
import { useQuery, useMutation } from "@apollo/client";
import { useLocation, useNavigate } from "react-router-dom";
import Tree from 'react-d3-tree';
import _ from "lodash"
import mongoose from "mongoose";

import * as Constants from "../constants"
import { getHeaders, checkRole } from "../util"
import { queryMlmById } from "../apollo/gqlQuery"

const orgChart = {
  name: 'CEO',
  children: [
    {
      name: 'Manager 1',
      children: [
        { name: 'Employee 1.1' },
        { name: 'Employee 1.2' },
      ],
    },
    {
      name: 'Manager 2',
      children: [
        {
          name: 'Employee 2.1',
          children: [
            { name: 'Intern 2.1.1' },
            { name: 'Intern 2.1.2' },
          ],
        },
        { name: 'Employee 2.2' },
      ],
    },
  ],
};

const containerStyles = {
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

const ShowsPage = (props) => {
  const location = useLocation();
  const [datas, setDatas] = useState({});
  
  const { user } = props
  console.log("shows :", props, user?._id)
  const { loading: loadingMlmById, 
          data: dataMlmById, 
          error: errorMlmById, 
          refetch: refetchMlmById,
          networkStatus } = useQuery( queryMlmById, { 
                                      context: { headers: getHeaders(location) }, 
                                      variables: {id: user?._id },
                                      fetchPolicy: 'cache-first', 
                                      nextFetchPolicy: 'network-only', 
                                      notifyOnNetworkStatusChange: true});

  if(!_.isEmpty(errorMlmById)){
    console.log("errorMlmById :", errorMlmById)
  }

  useEffect(() => {
    if(!loadingMlmById){
      if (dataMlmById?.mlmById) {
          let { status, datas } = dataMlmById?.mlmById
          if(status){
            setDatas(datas)
          }
      }

      // console.log("useEffect :", dataMlmById)
    }
  }, [dataMlmById, loadingMlmById])

  useEffect(()=>{
    if(user?._id){
      refetchMlmById({id: user?._id});
    }
  }, [user?._id])

  return (
    <div style={containerStyles}>
      <button onClick={()=>refetchMlmById({id: user?._id})}>Refresh</button>
        <Tree data={datas} orientation="vertical" translate={{ x: 600, y: 100 }} />
    </div>
  );
}

export default ShowsPage;
