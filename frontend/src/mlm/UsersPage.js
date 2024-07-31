import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useQuery } from "@apollo/client";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import _ from "lodash"
import { Edit as EditIcon } from '@mui/icons-material';
import { useTranslation } from "react-i18next";
import { Avatar } from "@mui/material";
import moment from "moment";
import { ObjectView } from 'react-object-view'

import { getHeaders, handlerErrorApollo } from "../util"
import { queryMembers } from "../apollo/gqlQuery"
import TableComponent from "../components/TableComp"

const UsersPage = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [data, setData]           = useState([]);
  const [loading, setLoading]     = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const fetchIdRef                = useRef(0);
  const sortIdRef                 = useRef(0);
  const [serverData, setServerData]  = useState([]);

  const { loading: loadingUsers, 
          data: dataUsers, 
          error: errorUsers, 
          networkStatus: networkStatusUsers,
          fetchMore: fetchMoreUsers } = useQuery(queryMembers, 
                                        { 
                                          context: { headers: getHeaders(location) }, 
                                          // variables: {input},
                                          fetchPolicy: 'network-only', 
                                          nextFetchPolicy: 'cache-first', 
                                          notifyOnNetworkStatusChange: true
                                        }
                                      );

  if(!_.isEmpty(errorUsers)) handlerErrorApollo( props, errorUsers )

  useEffect(() => {
    if(!loadingUsers){
      if(!_.isEmpty(dataUsers?.members)){
        let { status, data } = dataUsers?.members
        if(status) setServerData(data)
      }
    }
  }, [dataUsers, loadingUsers])

  const columns = useMemo(
    () => [   
            {
              Header: 'Image',
              accessor: 'avatar',
              Cell: props =>{
                  let {original} = props.row
                  return  <div> 
                            <Avatar
                              alt="Avatar"
                              variant="rounded"
                              src={ _.isEmpty(original?.current?.avatar) ? "" : original?.current?.avatar?.url}
                              onClick={(e) => {
                                // onLightbox({ isOpen: true, photoIndex: 0, images:original?.avatar })
                              }}
                              sx={{ width: 56, height: 56 }}
                            />
                          </div>
              },
              disableSortBy: true
            },
            {
              Header: 'Display name',
              accessor: 'displayName',
              Cell: props =>{
                let { original } = props.row
                return <div>{ original?.current?.displayName }</div>
              }
            },
            {
              Header: 'Email',
              accessor: 'email',
              Cell: props =>{
                let { original } = props.row
                return <div>{ original?.current?.email }</div>
              }
            },
            {
              Header: 'Last access',
              accessor: 'lastAccess',
              Cell: props => {
                let {original} = props.row 
                // return <div>{(moment(new Date(original?.logAccess?.lastAccess), 'YYYY-MM-DD HH:mm')).format('MMMM Do YYYY, h:mm:ss a')} - { moment(new Date(original?.logAccess?.lastAccess)).fromNow() }</div>
                console.log("@@@@@@@@@ :", original?.logAccess)
                try {
                  return <ObjectView  data={original?.logAccess} />
                }catch (error) {
                  console.log("error :", error)
                  return <div>{(moment(new Date(original?.current?.lastAccess), 'YYYY-MM-DD HH:mm')).format('MMMM Do YYYY, h:mm:ss a')} - { moment(new Date(original?.current?.lastAccess)).fromNow() }</div>
                }
              }
            },
            {
              Header: 'Edit',
              Cell: props => {
                let { original } = props.row
                return <button onClick={()=>{ navigate("/user", {state: {from: "/", mode: "edit", id: original?._id}}) }}><EditIcon/>{t("edit")}</button>
              },
              disableSortBy: true
            },
          ], [] );

  const fetchData = useCallback((el) => {
    const { pageSize, pageIndex, sortBy, searchOption, selectedOption } = el;
    const fetchId = ++fetchIdRef.current;

    setLoading(true);
    setTimeout(() => {
      if (fetchId === fetchIdRef.current) {
          let sortedData = [...serverData]; // Create a shallow copy of serverData

          // Filter data based on searchOption
          if (!_.isEmpty(searchOption)) {
              const searchOptionLower = searchOption.toLowerCase();
              sortedData = sortedData.filter((item) => {
                  switch (selectedOption) {
                      case "Display name":
                          return item?.current?.displayName?.toLowerCase().includes(searchOptionLower);
                      case "Email":
                          return item?.current?.email?.toLowerCase().includes(searchOptionLower);
                      default:
                          return true; // Return all if no matching case
                  }
              });
          }

          // Apply sorting if sortBy is defined
          if (sortBy.length > 0) {
            sortedData.sort((a, b) => {
              console.log("sorting :", a, b)
              for (const { id, desc } of sortBy) {
                  const modifier = desc ? -1 : 1;
                  if (a?.current[id] > b?.current[id]) return modifier;
                  if (a?.current[id] < b?.current[id]) return -modifier;
              }
              return 0;
            });
          }

          const startRow = pageSize * pageIndex;
          const endRow = startRow + pageSize;
          setData(sortedData.slice(startRow, endRow));
          setPageCount(Math.ceil(sortedData.length / pageSize));
          setLoading(false);
      }
    }, 1000);
  }, [serverData]);

  return (<div class="wrapper">
            <TableComponent
              columns={columns}
              // pageSize={50}
              data={data}
              fetchData={fetchData}
              loading={loading}
              pageCount={pageCount}/>
          </div>);
};

export default UsersPage;