import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import _ from "lodash";
import { useQuery } from "@apollo/client";
import { useLocation } from "react-router-dom";
import { ObjectView } from 'react-object-view'
import moment from "moment";

import { queryDblog } from "../apollo/gqlQuery"
import TableComponent from "../components/TableComp"
import { getHeaders } from "../util"

const DblogPage = (props) => {
    const location = useLocation();

    const [data, setData]           = useState([]);
    const [loading, setLoading]     = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const fetchIdRef                = useRef(0);
    const sortIdRef                 = useRef(0);
    const [serverData, setServerData]  = useState([]);

    const columns = useMemo(
      () => [
          {
              Header: 'Level',
              accessor: 'level',
              Cell: props =>{
                  let {level} = props.row.values 
                  return <div>{ level }</div>
              },
          },
          {
            Header: 'ข้อความ',
            accessor: "message",
            Cell: props =>{
              let {message} = props.row.values 
              try {
                return <ObjectView  data={JSON.parse(message)} />
              }catch (error) {
                return <div>{message}</div>
              }
            },
            disableSortBy: true
          },
          {
            Header: 'Meta',
            accessor: 'meta',
            Cell: props => {
              let {meta} = props.row.values 
              return <ObjectView  data={meta} />
            },
            disableSortBy: true
          },
          {
            Header: 'Date',
            accessor: 'timestamp',
            Cell: props => {
              let {timestamp} = props.row.values 
              return <div>{(moment(new Date(timestamp), 'YYYY-MM-DD HH:mm')).format('MMMM Do YYYY, h:mm:ss a')}</div>
            },
            // disableFilters:true
          },
      ],
      []
    );

    const { loading: loadingDblog, 
        data: dataDblog, 
        error: errorDblog  } =  useQuery( queryDblog, {
                                          context: { headers: getHeaders(location) },
                                          fetchPolicy: 'cache-first', 
                                          nextFetchPolicy: 'network-only', 
                                          notifyOnNetworkStatusChange: false,
                                          });

    useEffect(() => {
      if(!loadingDblog){
        if(!_.isEmpty(dataDblog?.dblog)){
          let { status, data } = dataDblog.dblog
          if(status) setServerData(_.sortBy(data, "timestamp").reverse())
        }
      }
    }, [dataDblog, loadingDblog])

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
                            case "Level":
                                return item.level.toLowerCase().includes(searchOptionLower);
                            case "ข้อความ":
                                return item.message.toLowerCase().includes(searchOptionLower);
                            case "Meta":
                                return item.meta.toLowerCase().includes(searchOptionLower);
                            case "Date":
                                return item.timestamp.toString().includes(searchOption);
                            default:
                                return true; // Return all if no matching case
                        }
                    });
                }
    
                // Apply sorting if sortBy is defined
                if (sortBy.length > 0) {
                    sortedData.sort((a, b) => {
                        for (const { id, desc } of sortBy) {
                            const modifier = desc ? -1 : 1;
                            if (a[id] > b[id]) return modifier;
                            if (a[id] < b[id]) return -modifier;
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
}

export default DblogPage;