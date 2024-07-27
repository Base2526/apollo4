import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useQuery } from "@apollo/client";
import styled from "styled-components";
import { useNavigate, useLocation, createSearchParams } from "react-router-dom";
import _ from "lodash"
import { AddBox as AddBoxIcon, 
         Edit as EditIcon, 
         DeleteForever as DeleteForeverIcon } from '@mui/icons-material';
import { useTranslation } from "react-i18next";
import {
  Box,
  Stack,
  Avatar,
  SpeedDial,
  SpeedDialIcon,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  LinearProgress,
  IconButton
} from "@mui/material";
import moment from "moment";
import { ObjectView } from 'react-object-view'

import { getHeaders, handlerErrorApollo, checkRole } from "../util"
import { queryManageSuppliers, queryMembers } from "../apollo/gqlQuery"
import UserComp from "../components/UserComp"
import * as Constants from "../constants"
// import TableComp from "../components/TableComp"
import TableComponent from "./TableComponent"

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`;

const UsersPage = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  // let { user, onLightbox, onMutationLottery } = props
  
  // const [openDialogDelete, setOpenDialogDelete] = useState({ isOpen: false, id: "", description: "" });
  // let [datas, setDatas] = useState([]);
  // let [total, setTotal] = useState(0)
  // let [slice, setSlice] = useState(20);
  // let [hasMore, setHasMore] = useState(true)

  // const [pageOptions, setPageOptions] = useState([30, 50, 100]);
  // const [pageIndex, setPageIndex] = useState(0);  
  // const [pageSize, setPageSize] = useState(pageOptions[0])
  // let [input, setInput] = useState({ OFF_SET: 0, LIMIT: 20 })
  // const [loading, setLoading] = useState(true);

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

  const getColmns = () =>{
    return  [
              {
                Header: 'Edit',
                Cell: props => {
                  let { original } = props.row
                  return <button onClick={()=>{ navigate("/user", {state: {from: "/", mode: "edit", id: original?._id}}) }}><EditIcon/>{t("edit")}</button>
                },
                disableSortBy: true
              },
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
            ]
  }

  const fetchData = useCallback((el) => {
    console.log("fetchData @1")
    const { pageSize, pageIndex, sortBy, searchOption, selectedOption } = el;
    const fetchId = ++fetchIdRef.current;

    setLoading(true);
    setTimeout(() => {
      if (fetchId === fetchIdRef.current) {
          let sortedData = [...serverData]; // Create a shallow copy of serverData

          console.log("fetchData @2 ", sortedData, selectedOption, sortBy)
          // Filter data based on searchOption
          if (!_.isEmpty(searchOption)) {
              const searchOptionLower = searchOption.toLowerCase();
              sortedData = sortedData.filter((item) => {
                  switch (selectedOption) {
                      case "Display name":
                          return item?.current?.displayName?.toLowerCase().includes(searchOptionLower);
                      case "Email":
                          return item?.current?.email?.toLowerCase().includes(searchOptionLower);
                      // case "Meta":
                      //     return item.meta.toLowerCase().includes(searchOptionLower);
                      // case "Date":
                      //     return item.timestamp.toString().includes(searchOption);
                      // case "Visits":
                      //     return item.visits.toString().includes(searchOption);
                      // case "Status":
                      //     return item.status.toLowerCase().includes(searchOptionLower);
                      // case "Profile Progress":
                      //     return item.progress.toString().includes(searchOption);
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

  return (<Styles>
            <TableComponent
              columns={getColmns()}
              // pageSize={50}
              data={data}
              fetchData={fetchData}
              loading={loading}
              pageCount={pageCount}/>
          </Styles>);
};

export default UsersPage;